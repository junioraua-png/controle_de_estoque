export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Se não está logado e não está na página de login, redireciona para login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Se está logado e está na página de login, redireciona para home
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})
