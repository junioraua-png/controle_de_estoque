export interface Product {
  id: number
  created_at: string
  name_product: string
  value: number
  quantidade: number
  total: number
  user_id?: string
}

export interface ProductInsert {
  name_product: string
  value: number
  quantidade: number
  total: number
}

export function useProducts() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const toast = useToast()
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts() {
    loading.value = true
    error.value = null

    try {
      if (!user.value) {
        products.value = []
        return
      }

      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      products.value = data || []
    } catch (e: any) {
      error.value = e.message
      toast.error('Erro ao carregar produtos')
      console.error('Erro ao buscar produtos:', e)
    } finally {
      loading.value = false
    }
  }

  async function addProduct(product: ProductInsert) {
    loading.value = true
    error.value = null

    try {
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error: err } = await supabase
        .from('products')
        .insert([{
          ...product,
          user_id: user.value.id
        }])
        .select()
        .single()

      if (err) throw err
      if (data) {
        products.value.unshift(data)
      }
      return { success: true, data }
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao adicionar produto:', e)
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id: number) {
    loading.value = true
    error.value = null

    try {
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.value.id)

      if (err) throw err
      products.value = products.value.filter(p => p.id !== id)
      return { success: true }
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao deletar produto:', e)
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id: number, updates: Partial<ProductInsert>) {
    loading.value = true
    error.value = null

    try {
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error: err } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.value.id)
        .select()
        .single()

      if (err) throw err
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1 && data) {
        products.value[index] = data
      }
      return { success: true, data }
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao atualizar produto:', e)
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    deleteProduct,
    updateProduct
  }
}
