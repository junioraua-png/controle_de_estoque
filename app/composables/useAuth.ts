export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const toast = useToast()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      toast.success('Login realizado com sucesso!')
      await navigateTo('/')
    } catch (e: any) {
      error.value = e.message || 'Erro ao fazer login'
      toast.error(error.value)
      console.error('Erro de autenticação:', e)
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string, nome: string) => {
    loading.value = true
    error.value = null

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          }
        }
      })

      if (authError) throw authError

      // Se o usuário foi criado com sucesso, criar registro na tabela users
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            nome: nome,
            email: email,
            user_id: authData.user.id
          })

        if (dbError) {
          console.error('Erro ao criar registro na tabela users:', dbError)
        }
      }

      toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar.')
      return true
    } catch (e: any) {
      error.value = e.message || 'Erro ao criar conta'
      toast.error(error.value)
      console.error('Erro ao criar conta:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.signOut()

      if (authError) throw authError

      toast.info('Você saiu da sua conta')
      await navigateTo('/login')
    } catch (e: any) {
      error.value = e.message || 'Erro ao fazer logout'
      toast.error(error.value)
      console.error('Erro ao fazer logout:', e)
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (authError) throw authError

      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.')
      return true
    } catch (e: any) {
      error.value = e.message || 'Erro ao enviar e-mail de recuperação'
      toast.error(error.value)
      console.error('Erro ao recuperar senha:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword
  }
}
