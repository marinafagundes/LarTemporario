Schema Supabase.sql

-- ENUM
create type perfil_usuario as enum ('Voluntario', 'Lider');

-- USUÁRIOS
create table usuarios (
	id uuid primary key references auth.users(id) on delete cascade,
	nome text,
	email text,
	perfil perfil_usuario not null default 'Voluntario',
	telefone text,
	ativo boolean default true
);

-- GATOS
create table gatos (
	id serial primary key,
	nome text,
	data_resgate date,
	data_nascimento date,
	sexo text check (sexo in ('M','F')),
	status text,
	foto text,
	observacao text
);

-- ESCALAS
create table escalas (
	id serial primary key,
	usuario_id uuid references auth.users(id) on delete set null,
	data_hora_inicio timestamptz not null,
	data_hora_fim timestamptz not null,
	tipo text not null check (tipo in ('Limpeza','Socialização','Medicação','Consulta'))
);

-- LIMPEZA
create table limpeza (
	id serial primary key,
	escala_id int references escalas(id) on delete cascade
);

-- TAREFAS
create table tarefas (
	id serial primary key,
	nome text not null
);

-- LIMPEZA x TAREFAS
create table limpeza_tarefas (
	limpeza_id int references limpeza(id) on delete cascade,
	tarefa_id int references tarefas(id) on delete cascade,
	primary key (limpeza_id, tarefa_id)
);

-- SOCIALIZAÇÃO
create table socializacao (
	id serial primary key,
	escala_id int references escalas(id) on delete cascade,
	gato_id int references gatos(id) on delete cascade
);

-- CONSULTA
create table consulta (
	id serial primary key,
	escala_id int references escalas(id) on delete cascade,
	gato_id int references gatos(id) on delete cascade,
	data_hora timestamptz not null,
	status text,
	veterinario_responsavel text
);

-- MEDICAÇÃO
create table medicacao (
	id serial primary key,
	escala_id int references escalas(id) on delete cascade,
	gato_id int references gatos(id) on delete cascade,
	medicamento text not null,
	instrucoes text,
	data_hora_prevista timestamptz,
	data_hora_administracao timestamptz,
	registro text
);

-- NOTIFICAÇÕES
create table notificacoes (
	id serial primary key,
	usuario_id uuid references auth.users(id) on delete cascade,
	titulo text not null,
	mensagem text not null,
	tipo text check (tipo in ('info', 'alerta', 'urgente')) default 'info',
	lida boolean default false,
	criado_em timestamptz default now()
);

-- ÍNDICES para melhor performance
create index idx_notificacoes_usuario_id on notificacoes(usuario_id);
create index idx_notificacoes_lida on notificacoes(lida);
create index idx_notificacoes_criado_em on notificacoes(criado_em desc);

-- TRIGGER DE CRIAÇÃO AUTOMÁTICA DE USUÁRIO
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
	insert into public.usuarios (id, nome, email, perfil, ativo)
	values (
		new.id,
		new.raw_user_meta_data->>'full_name',
		new.email,
		'Voluntario',
		true
	);
	return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

