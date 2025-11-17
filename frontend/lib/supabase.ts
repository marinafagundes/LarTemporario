import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente Supabase para uso no lado do cliente (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados baseados no schema existente
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nome: string | null
          email: string | null
          perfil: 'Voluntario' | 'Lider'
          telefone: string | null
          ativo: boolean
        }
        Insert: {
          id: string
          nome?: string | null
          email?: string | null
          perfil?: 'Voluntario' | 'Lider'
          telefone?: string | null
          ativo?: boolean
        }
        Update: {
          id?: string
          nome?: string | null
          email?: string | null
          perfil?: 'Voluntario' | 'Lider'
          telefone?: string | null
          ativo?: boolean
        }
      }
      gatos: {
        Row: {
          id: number
          nome: string | null
          data_resgate: string | null
          data_nascimento: string | null
          sexo: 'M' | 'F' | null
          status: string | null
          foto: string | null
          observacao: string | null
        }
        Insert: {
          id?: number
          nome?: string | null
          data_resgate?: string | null
          data_nascimento?: string | null
          sexo?: 'M' | 'F' | null
          status?: string | null
          foto?: string | null
          observacao?: string | null
        }
        Update: {
          id?: number
          nome?: string | null
          data_resgate?: string | null
          data_nascimento?: string | null
          sexo?: 'M' | 'F' | null
          status?: string | null
          foto?: string | null
          observacao?: string | null
        }
      }
      escalas: {
        Row: {
          id: number
          usuario_id: string | null
          data_hora_inicio: string
          data_hora_fim: string
          tipo: 'Limpeza' | 'Socialização' | 'Medicação' | 'Consulta'
        }
        Insert: {
          id?: number
          usuario_id?: string | null
          data_hora_inicio: string
          data_hora_fim: string
          tipo: 'Limpeza' | 'Socialização' | 'Medicação' | 'Consulta'
        }
        Update: {
          id?: number
          usuario_id?: string | null
          data_hora_inicio?: string
          data_hora_fim?: string
          tipo?: 'Limpeza' | 'Socialização' | 'Medicação' | 'Consulta'
        }
      }
      limpeza: {
        Row: {
          id: number
          escala_id: number | null
        }
        Insert: {
          id?: number
          escala_id?: number | null
        }
        Update: {
          id?: number
          escala_id?: number | null
        }
      }
      tarefas: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
      }
      limpeza_tarefas: {
        Row: {
          limpeza_id: number
          tarefa_id: number
        }
        Insert: {
          limpeza_id: number
          tarefa_id: number
        }
        Update: {
          limpeza_id?: number
          tarefa_id?: number
        }
      }
      socializacao: {
        Row: {
          id: number
          escala_id: number | null
          gato_id: number | null
        }
        Insert: {
          id?: number
          escala_id?: number | null
          gato_id?: number | null
        }
        Update: {
          id?: number
          escala_id?: number | null
          gato_id?: number | null
        }
      }
      consulta: {
        Row: {
          id: number
          escala_id: number | null
          gato_id: number | null
          data_hora: string
          status: string | null
          veterinario_responsavel: string | null
        }
        Insert: {
          id?: number
          escala_id?: number | null
          gato_id?: number | null
          data_hora: string
          status?: string | null
          veterinario_responsavel?: string | null
        }
        Update: {
          id?: number
          escala_id?: number | null
          gato_id?: number | null
          data_hora?: string
          status?: string | null
          veterinario_responsavel?: string | null
        }
      }
      medicacao: {
        Row: {
          id: number
          escala_id: number | null
          gato_id: number | null
          medicamento: string
          instrucoes: string | null
          data_hora_prevista: string | null
          data_hora_administracao: string | null
          registro: string | null
        }
        Insert: {
          id?: number
          escala_id?: number | null
          gato_id?: number | null
          medicamento: string
          instrucoes?: string | null
          data_hora_prevista?: string | null
          data_hora_administracao?: string | null
          registro?: string | null
        }
        Update: {
          id?: number
          escala_id?: number | null
          gato_id?: number | null
          medicamento?: string
          instrucoes?: string | null
          data_hora_prevista?: string | null
          data_hora_administracao?: string | null
          registro?: string | null
        }
      }
      notificacoes: {
        Row: {
          id: number
          usuario_id: string
          titulo: string
          mensagem: string
          tipo: 'info' | 'alerta' | 'urgente'
          lida: boolean
          criado_em: string
        }
        Insert: {
          id?: number
          usuario_id: string
          titulo: string
          mensagem: string
          tipo?: 'info' | 'alerta' | 'urgente'
          lida?: boolean
          criado_em?: string
        }
        Update: {
          id?: number
          usuario_id?: string
          titulo?: string
          mensagem?: string
          tipo?: 'info' | 'alerta' | 'urgente'
          lida?: boolean
          criado_em?: string
        }
      }
    }
  }
}
