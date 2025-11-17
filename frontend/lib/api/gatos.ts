import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Gato = Database['public']['Tables']['gatos']['Row']
type GatoInsert = Database['public']['Tables']['gatos']['Insert']
type GatoUpdate = Database['public']['Tables']['gatos']['Update']

export const gatosApi = {
  // Listar todos os gatos
  async getAll() {
    const { data, error } = await supabase
      .from('gatos')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    return data as Gato[]
  },

  // Buscar gato por ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('gatos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Gato
  },

  // Buscar gatos por status
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('gatos')
      .select('*')
      .eq('status', status)
      .order('id', { ascending: false })
    
    if (error) throw error
    return data as Gato[]
  },

  // Buscar gatos por sexo
  async getBySexo(sexo: 'M' | 'F') {
    const { data, error } = await supabase
      .from('gatos')
      .select('*')
      .eq('sexo', sexo)
      .order('id', { ascending: false })
    
    if (error) throw error
    return data as Gato[]
  },

  // Criar novo gato
  async create(gato: GatoInsert) {
    const { data, error } = await supabase
      .from('gatos')
      .insert(gato)
      .select()
      .single()
    
    if (error) throw error
    return data as Gato
  },

  // Atualizar gato
  async update(id: number, updates: GatoUpdate) {
    const { data, error } = await supabase
      .from('gatos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Gato
  },

  // Deletar gato
  async delete(id: number) {
    const { error } = await supabase
      .from('gatos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Calcular idade do gato com base na data de nascimento
  calcularIdade(dataNascimento: string): number {
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    const diff = hoje.getTime() - nascimento.getTime()
    const idade = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
    return idade
  },

  // Upload de foto
  async uploadFoto(file: File, gatoId: number) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${gatoId}-${Date.now()}.${fileExt}`
    const filePath = `gatos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('fotos')
      .getPublicUrl(filePath)

    return publicUrl
  }
}
