<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    <!-- Header com Gradiente -->
    <header class="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          <!-- Logo e Título -->
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="icon-circle-primary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 class="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Controle de Estoque
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Sistema de gerenciamento de produtos
              </p>
            </div>
          </div>

          <!-- Lado Direito: Status + Toggle + Data + Logout -->
          <div class="flex items-center gap-3 sm:gap-4">
            <!-- Loading Indicator -->
            <span v-if="loading" class="hidden sm:flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="hidden md:inline">Sincronizando...</span>
            </span>

            <!-- User Email -->
            <span v-if="user" class="text-xs text-gray-500 dark:text-gray-400 hidden lg:block truncate max-w-[150px]">
              {{ user.email }}
            </span>

            <!-- Theme Toggle Button -->
            <button
              @click="toggleTheme"
              class="relative p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 group"
              :title="isDark ? 'Modo claro' : 'Modo escuro'"
            >
              <!-- Sol (Light Mode) -->
              <svg
                v-if="!isDark"
                class="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <!-- Lua (Dark Mode) -->
              <svg
                v-else
                class="w-5 h-5 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <!-- Logout Button -->
            <button
              @click="signOut"
              class="relative p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group"
              title="Sair"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            <!-- Data -->
            <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              {{ currentDate }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Error Alert -->
      <Transition name="slide">
        <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3">
          <div class="icon-circle-danger w-10 h-10">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="flex-1 text-sm text-red-700 dark:text-red-300">{{ error }}</p>
          <button @click="error = null" class="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </Transition>

      <!-- Stats Cards -->
      <StockStats :items="stockItems" />

      <!-- Search & Filters -->
      <StockSearch
        v-model:search="searchTerm"
        v-model:sort="sortBy"
        v-model:filter="stockFilter"
      />

      <!-- Botão de Teste -->
      <div class="mb-6 flex justify-center">
        <button
          @click="testarToast"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Testar Toast
        </button>
      </div>

      <!-- Form -->
      <StockForm @add-stock="addStock" :loading="loading" />

      <!-- List -->
      <StockList :items="filteredItems" :loading="loading" @remove="removeStock" />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { products, loading, error, fetchProducts, addProduct, deleteProduct } = useProducts()
const { signOut, user } = useAuth()
const toast = useToast()

const searchTerm = ref('')
const sortBy = ref('name')
const stockFilter = ref('all')

// Theme toggle direto
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  fetchProducts()

  // Inicializar tema
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const stockItems = computed(() => {
  return products.value.map(p => ({
    id: p.id,
    name: p.name_product || '',
    qty: p.quantidade || 0,
    price: p.value || 0
  }))
})

const filteredItems = computed(() => {
  let result = [...stockItems.value]

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    result = result.filter(item =>
      item.name.toLowerCase().includes(search)
    )
  }

  switch (stockFilter.value) {
    case 'low':
      result = result.filter(item => item.qty > 0 && item.qty < 5)
      break
    case 'ok':
      result = result.filter(item => item.qty >= 5)
      break
    case 'empty':
      result = result.filter(item => item.qty === 0)
      break
  }

  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'qty':
        return a.qty - b.qty
      case 'qty-desc':
        return b.qty - a.qty
      case 'price':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'value':
        return (a.qty * a.price) - (b.qty * b.price)
      case 'value-desc':
        return (b.qty * b.price) - (a.qty * a.price)
      default:
        return 0
    }
  })

  return result
})

async function addStock(payload: { name: string; qty: number; price: number }) {
  const total = payload.qty * payload.price
  const result = await addProduct({
    name_product: payload.name,
    quantidade: payload.qty,
    value: payload.price,
    total: total
  })
  
  if (result.success) {
    toast.success(`Produto "${payload.name}" adicionado com sucesso!`)
  } else {
    toast.error(result.error || 'Erro ao adicionar produto')
  }
}

async function removeStock(id: number) {
  const product = products.value.find(p => p.id === id)
  const result = await deleteProduct(id)
  
  if (result.success) {
    toast.success(`Produto "${product?.name_product || 'item'}" removido com sucesso!`)
  } else {
    toast.error(result.error || 'Erro ao remover produto')
  }
}

function testarToast() {
  const tipos = ['success', 'error', 'warning', 'info']
  const mensagens = [
    'Operação realizada com sucesso! 🎉',
    'Ocorreu um erro no sistema! ⚠️',
    'Atenção! Estoque baixo! 📦',
    'Informação importante para você! 💡'
  ]
  
  const randomIndex = Math.floor(Math.random() * tipos.length)
  const tipo = tipos[randomIndex] as 'success' | 'error' | 'warning' | 'info'
  const mensagem = mensagens[randomIndex]
  
  toast[tipo](mensagem)
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
