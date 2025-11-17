import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Notificacao = Database['public']['Tables']['notificacoes']['Row']
type NotificacaoInsert = Database['public']['Tables']['notificacoes']['Insert']
type NotificacaoUpdate = Database['public']['Tables']['notificacoes']['Update']

export const notificacoesApi = {
  // Listar todas as notificações do usuário
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('usuario_id', userId)
      .order('criado_em', { ascending: false })
    
    if (error) throw error
    return data as Notificacao[]
  },

  // Buscar notificações não lidas
  async getUnread(userId: string) {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('usuario_id', userId)
      .eq('lida', false)
      .order('criado_em', { ascending: false })
    
    if (error) throw error
    return data as Notificacao[]
  },

  // Contar notificações não lidas
  async countUnread(userId: string) {
    const { count, error } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', userId)
      .eq('lida', false)
    
    if (error) throw error
    return count || 0
  },

  // Criar nova notificação
  async create(notificacao: NotificacaoInsert) {
    const { data, error } = await supabase
      .from('notificacoes')
      .insert(notificacao)
      .select()
      .single()
    
    if (error) throw error
    return data as Notificacao
  },

  // Marcar notificação como lida
  async markAsRead(id: number) {
    const { data, error } = await supabase
      .from('notificacoes')
      .update({ lida: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Notificacao
  },

  // Marcar todas as notificações do usuário como lidas
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notificacoes')
      .update({ lida: true })
      .eq('usuario_id', userId)
      .eq('lida', false)
    
    if (error) throw error
  },

  // Deletar notificação
  async delete(id: number) {
    const { error } = await supabase
      .from('notificacoes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Subscrever a mudanças em tempo real
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('notificacoes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notificacoes',
          filter: `usuario_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}
