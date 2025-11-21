import { createClient } from '@/lib/supabase-browser'
import { Database } from '@/lib/supabase'

type Escala = Database['public']['Tables']['escalas']['Row']
type EscalaInsert = Database['public']['Tables']['escalas']['Insert']
type EscalaUpdate = Database['public']['Tables']['escalas']['Update']
type Limpeza = Database['public']['Tables']['limpeza']['Row']
type Socializacao = Database['public']['Tables']['socializacao']['Row']
type Consulta = Database['public']['Tables']['consulta']['Row']
type Medicacao = Database['public']['Tables']['medicacao']['Row']

export const escalasApi = {
  // Listar todas as escalas do usuário
  async getByUser(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('escalas')
      .select('*')
      .eq('usuario_id', userId)
      .order('data_hora_inicio', { ascending: true })
    
    if (error) throw error
    return data as Escala[]
  },

  // Buscar escala por ID
  async getById(id: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('escalas')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Escala
  },

  // Buscar escalas por período
  async getByPeriod(startDate: string, endDate: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('escalas')
      .select('*')
      .gte('data_hora_inicio', startDate)
      .lte('data_hora_fim', endDate)
      .order('data_hora_inicio', { ascending: true })
    
    if (error) throw error
    return data as Escala[]
  },

  // Buscar escalas por tipo
  async getByTipo(tipo: 'Limpeza' | 'Socialização' | 'Medicação' | 'Consulta') {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('escalas')
      .select('*')
      .eq('tipo', tipo)
      .order('data_hora_inicio', { ascending: true })
    
    if (error) throw error
    return data as Escala[]
  },

  // Criar nova escala
  async create(escala: EscalaInsert) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('escalas')
      .insert(escala)
      .select()
      .single()
    
    if (error) throw error
    return data as Escala
  },

  // Atualizar escala
  async update(id: number, updates: EscalaUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('escalas')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Escala
  },

  // Deletar escala
  async delete(id: number) {
    const supabase = createClient()
    const { error } = await supabase
      .from('escalas')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // === LIMPEZA ===
  
  // Criar escala de limpeza
  async createLimpeza(escala: EscalaInsert, tarefasIds?: number[]) {
    const supabase = createClient()
    const novaEscala = await this.create({ ...escala, tipo: 'Limpeza' })
    
    // Criar registro de limpeza
    const { data: limpeza, error: limpezaError } = await supabase
      .from('limpeza')
      .insert({ escala_id: novaEscala.id })
      .select()
      .single()
    
    if (limpezaError) throw limpezaError
    
    // Associar tarefas se fornecidas
    if (tarefasIds && tarefasIds.length > 0) {
      const limpezaTarefas = tarefasIds.map(tarefaId => ({
        limpeza_id: limpeza.id,
        tarefa_id: tarefaId
      }))
      
      const { error: tarefasError } = await supabase
        .from('limpeza_tarefas')
        .insert(limpezaTarefas)
      
      if (tarefasError) throw tarefasError
    }
    
    return { escala: novaEscala, limpeza }
  },

  // Buscar tarefas disponíveis
  async getTarefas() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .order('nome', { ascending: true })
    
    if (error) throw error
    return data
  },

  // === SOCIALIZAÇÃO ===
  
  // Criar escala de socialização
  async createSocializacao(escala: EscalaInsert, gatoId: number) {
    const supabase = createClient()
    const novaEscala = await this.create({ ...escala, tipo: 'Socialização' })
    
    const { data, error } = await supabase
      .from('socializacao')
      .insert({
        escala_id: novaEscala.id,
        gato_id: gatoId
      })
      .select()
      .single()
    
    if (error) throw error
    return { escala: novaEscala, socializacao: data }
  },

  // Buscar socializações por gato
  async getSocializacoesByGato(gatoId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('socializacao')
      .select('*, escalas(*)')
      .eq('gato_id', gatoId)
    
    if (error) throw error
    return data
  },

  // === CONSULTA ===
  
  // Criar escala de consulta
  async createConsulta(
    escala: EscalaInsert,
    gatoId: number,
    dataHora: string,
    veterinario?: string
  ) {
    const supabase = createClient()
    const novaEscala = await this.create({ ...escala, tipo: 'Consulta' })
    
    const { data, error } = await supabase
      .from('consulta')
      .insert({
        escala_id: novaEscala.id,
        gato_id: gatoId,
        data_hora: dataHora,
        veterinario_responsavel: veterinario,
        status: 'Agendada'
      })
      .select()
      .single()
    
    if (error) throw error
    return { escala: novaEscala, consulta: data }
  },

  // Atualizar status da consulta
  async updateConsultaStatus(consultaId: number, status: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('consulta')
      .update({ status })
      .eq('id', consultaId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar consultas por gato
  async getConsultasByGato(gatoId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('consulta')
      .select('*, escalas(*)')
      .eq('gato_id', gatoId)
      .order('data_hora', { ascending: false })
    
    if (error) throw error
    return data
  },

  // === MEDICAÇÃO ===
  
  // Criar escala de medicação
  async createMedicacao(
    escala: EscalaInsert,
    gatoId: number,
    medicamento: string,
    instrucoes?: string,
    dataHoraPrevista?: string
  ) {
    const supabase = createClient()
    const novaEscala = await this.create({ ...escala, tipo: 'Medicação' })
    
    const { data, error } = await supabase
      .from('medicacao')
      .insert({
        escala_id: novaEscala.id,
        gato_id: gatoId,
        medicamento,
        instrucoes,
        data_hora_prevista: dataHoraPrevista
      })
      .select()
      .single()
    
    if (error) throw error
    return { escala: novaEscala, medicacao: data }
  },

  // Registrar administração de medicação
  async registrarMedicacao(medicacaoId: number, registro: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('medicacao')
      .update({
        data_hora_administracao: new Date().toISOString(),
        registro
      })
      .eq('id', medicacaoId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar medicações por gato
  async getMedicacoesByGato(gatoId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('medicacao')
      .select('*, escalas(*)')
      .eq('gato_id', gatoId)
      .order('data_hora_prevista', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar medicações pendentes
  async getMedicacoesPendentes() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('medicacao')
      .select('*, escalas(*), gatos(*)')
      .is('data_hora_administracao', null)
      .order('data_hora_prevista', { ascending: true })
    
    if (error) throw error
    return data
  }
}
