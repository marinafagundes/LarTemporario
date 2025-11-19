import { createClient } from '@/lib/supabase-browser'

export const authApi = {
  async signIn(email: string, password: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Registrar novo usuário
  async signUp(email: string, password: string, metadata?: {
    nome?: string
    telefone?: string
  }) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  },

  // Fazer logout
  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obter usuário atual
  async getCurrentUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getSession() {
    const supabase = createClient()
    // getUser() valida o token no servidor
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    
    // Se precisar da sessão completa, busca após validar o usuário
    if (user) {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    }
    return null
  },

  // Obter claims do token JWT
  async getClaims() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getClaims()
    if (error) throw error
    return data
  },

  // Resetar senha
  async resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
  },

  // Atualizar senha
  async updatePassword(newPassword: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  },

  // Atualizar email
  async updateEmail(newEmail: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    })
    
    if (error) throw error
  },

  // Verificar se o usuário está autenticado (validado no servidor)
  async isAuthenticated() {
    const supabase = createClient()
    // Usa getUser() para validar o token no servidor
    const { data: { user }, error } = await supabase.auth.getUser()
    return !!user && !error
  },

  // Subscrever a mudanças de autenticação
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = createClient()
    return supabase.auth.onAuthStateChange(callback)
  }
}
