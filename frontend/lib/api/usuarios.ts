import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Usuario = Database['public']['Tables']['usuarios']['Row']
type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert']
type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update']

export const usuariosApi = {
  // Buscar usuário atual
  async getCurrent() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    return data as Usuario
  },

  // Buscar usuário por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Usuario
  },

  // Listar todos os usuários (apenas para admin/lider)
  async getAll() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true })
    
    if (error) throw error
    return data as Usuario[]
  },

  // Listar usuários por perfil
  async getByPerfil(perfil: 'Voluntario' | 'Lider') {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('perfil', perfil)
      .eq('ativo', true)
      .order('nome', { ascending: true })
    
    if (error) throw error
    return data as Usuario[]
  },

  // Atualizar perfil do usuário
  async update(id: string, updates: UsuarioUpdate) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Usuario
  },

  // Desativar usuário (soft delete)
  async deactivate(id: string) {
    return this.update(id, { ativo: false })
  },

  // Reativar usuário
  async reactivate(id: string) {
    return this.update(id, { ativo: true })
  },

  // Promover usuário a líder
  async promoteToLider(id: string) {
    return this.update(id, { perfil: 'Lider' })
  },

  // Rebaixar líder a voluntário
  async demoteToVoluntario(id: string) {
    return this.update(id, { perfil: 'Voluntario' })
  }
}
