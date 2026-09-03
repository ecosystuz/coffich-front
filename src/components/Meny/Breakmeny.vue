<template>
  <div class="menu-layout">
        <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo">☕</div>
        <div class="brand-info">
          <h2 class="brand-title">COFFICH</h2>
          <span class="brand-subtitle">Premium Taste</span>
        </div>
      </div>

      <nav class="nav-menu">
        <button
          v-for="category in categories"
          :key="category.id"
          class="nav-item"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="nav-icon">{{ category.icon }}</span>
          <span class="nav-title">{{ category.name }}</span>
          <span class="active-indicator"></span>
        </button>
      </nav>
    </aside>

        <main class="main-content">
      <header class="category-header">
        <div class="header-titles">
          <h1 class="category-name">{{ currentCategoryInfo.name }}</h1>
          <p class="category-desc">{{ currentCategoryInfo.description }}</p>
        </div>

        <div class="header-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Поиск..." 
              class="search-input"
            />
            <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</button>
          </div>
          
          <div class="items-count">
            <span>{{ filteredItems.length }} шт.</span>
          </div>
        </div>
      </header>

            <TransitionGroup name="grid-anim" tag="div" class="products-grid">
        <article
          v-for="item in filteredItems"
          :key="item.id"
          class="product-card"
          @click="openProductModal(item)"
        >
          <div class="card-image-box">
            <span v-if="item.badge" class="badge-tag" :class="getBadgeClass(item.badge)">
              {{ item.badge }}
            </span>
            <img 
              :src="getItemImage(item)" 
              :alt="item.title" 
              class="product-image"
              loading="lazy" 
            />
          </div>

          <div class="card-info">
            <h3 class="product-title">{{ item.title }}</h3>
            <p class="product-desc">{{ item.description }}</p>

            <div class="size-selector" v-if="item.sizes && item.sizes.length > 1">
              <button 
                v-for="(size, index) in item.sizes" 
                :key="index"
                class="size-btn"
                :class="{ active: (selectedSizes[item.id] || 0) === index }"
                @click.stop="selectSize(item.id, index)"
              >
                {{ size.name }}
              </button>
            </div>

            <div class="card-footer">
              <div class="product-price">
                <span class="price-num">{{ formatPrice(getItemPrice(item)) }}</span>
                <span class="currency">сум</span>
              </div>
            </div>
          </div>
        </article>
      </TransitionGroup>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <span class="empty-icon">☕</span>
        <p>К сожалению, ничего не найдено...</p>
      </div>
    </main>

        <Transition name="modal-fade">
      <div v-if="selectedProduct" class="modal-overlay" @click="closeProductModal">
        <div class="modal-container" @click.stop>
          <button class="modal-close" @click="closeProductModal">✕</button>
          
          <div class="modal-image-wrapper">
             <span v-if="selectedProduct.badge" class="badge-tag modal-badge" :class="getBadgeClass(selectedProduct.badge)">
              {{ selectedProduct.badge }}
            </span>
            <img 
              :src="getItemImage(selectedProduct)" 
              :alt="selectedProduct.title" 
              class="modal-main-image"
            />
          </div>

          <div class="modal-details">
            <h2 class="modal-title">{{ selectedProduct.title }}</h2>
            <p class="modal-description">{{ selectedProduct.description }}</p>
            <p class="modal-ingredients" v-if="selectedProduct.ingredients">Состав: {{ selectedProduct.ingredients }}</p>

            <div class="modal-sizes-section" v-if="selectedProduct.sizes && selectedProduct.sizes.length > 1">
              <h4 class="section-title">Выберите объем:</h4>
              <div class="size-selector modal-size-selector">
                <button 
                  v-for="(size, index) in selectedProduct.sizes" 
                  :key="index"
                  class="size-btn"
                  :class="{ active: (selectedSizes[selectedProduct.id] || 0) === index }"
                  @click.stop="selectSize(selectedProduct.id, index)"
                >
                  {{ size.name }}
                </button>
              </div>
            </div>

            <div class="modal-footer">
              <div class="product-price modal-price">
                <span class="price-num">{{ formatPrice(getItemPrice(selectedProduct)) }}</span>
                <span class="currency">сум</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'

const activeCategory = ref('coffee')
const searchQuery = ref('')
const selectedSizes = reactive({})
const selectedProduct = ref(null) // Modal uchun tanlangan mahsulot

const categories = ref([
  { id: 'coffee', name: 'COFFEE', icon: '☕', description: 'Утонченные и ароматные кофейные напитки' },
  { id: 'non-coffee', name: 'NON COFFEE', icon: '🥛', description: 'Какао, горячий шоколад и виды матчи' },
  { id: 'pechenie', name: 'COOKIES & SWEETS', icon: '🥐', description: 'Сладости, десерты и вкусная выпечка' },
  { id: 'choy', name: 'TEA', icon: '🍵', description: 'Заварные и фруктовые бодрящие чаи' },
  { id: 'ice-drink', name: 'ICE DRINKS', icon: '🧊', description: 'Освежающие холодные коктейли' },
  { id: 'ice', name: 'BUBBLE TEA', icon: '🧋', description: 'Освежающие холодные коктейли' },
])

const menuData = {
  coffee: [
    { id: 'c1', title: 'CAPPUCCINO', description: 'Классический кофейный напиток с мягкой кремовой пенкой', badge: 'Хит', sizes: [{ name: '500 мл', price: 40000, image: '/images/1c.jpg' }, { name: '300 мл', price: 20000, image: '/images/1q.jpg' }, { name: '220 мл', price: 18000, image: '/images/1e.jpg' }] },
    { id: 'c2', title: 'COFFEE LATTE', description: 'Идеальное сочетание нежного молока и эспрессо', badge: '', sizes: [{ name: '500 мл', price: 40000, image: '/images/2c.jpg' }, { name: '300 мл', price: 20000, image: '/images/1q.jpg' }, { name: '220 мл', price: 18000, image: '/images/1e.jpg' }] },
    { id: 'c3', title: 'DOUBLE COFFEE', description: 'Чистый экстракт кофе и горячая вода', badge: '', sizes: [{ name: 'CAPPUCCINO', price: 30000, image: '/images/3c.jpg' }, { name: 'LATTE', price: 30000, image: '/images/1c.jpg' }  ] },
    { id: 'c4', title: 'AMERIKANO', description: 'Легкий и классический крепкий кофе', badge: 'Хит', sizes: [{ name: '260 мл', price: 25000, image: '/images/4c.jpg' }, { name: '150 мл', price: 15000, image: '/images/1p.jpg' }] },
    { id: 'c5', title: 'COFFICH', description: 'Фирменный', badge: 'Хит', sizes: [{ name: '300 мл', price: 28000, image: '/images/5c.jpg' }, { name: '220 мл', price: 23000, image: '/images/2z.jpg' }] },
    { id: 'c6', title: 'COFFEE RAF', description: 'Мягкий кофе со сливками и ванилью', badge: 'Хит', sizes: [{ name: '300 мл', price: 35000, image: '/images/8c.jpg' }, { name: '220 мл', price: 25000, image: '/images/9i.jpg' }] },
    { id: 'c7', title: 'LATTE SPICES', description: 'Приготовлен с добавлением изысканных специй', badge: 'Хит', sizes: [{ name: '300 мл', price: 28000, image: '/images/6c.jpg' }, { name: '220 мл', price: 23000, image: '/images/6t.jpg' }] },
    { id: 'c8', title: 'MOCACCINO', description: 'Нежный кофейно-шоколадный напиток с молоком', badge: 'Хит', sizes: [{ name: '300 мл', price: 28000, image: '/images/7c.jpg' }, { name: '220 мл', price: 23000, image: '/images/8u.jpg' }] },
    { id: 'c9', title: 'FLAT WHITE', description: 'Крепкий эспрессо с бархатистой пенкой', badge: 'Хит', sizes: [{ name: '200 мл', price: 25000, image: '/images/10c.jpg' }, { name: '100 мл', price: 18000, image: '/images/23.jpg' }] },
    { id: 'c10', title: 'FILTER COFFEE', description: 'Ароматный фирменный фильтр-кофе', badge: 'Хит', sizes: [{ name: '200 мл', price: 25000, image: '/images/9c.jpg' }, { name: '100 мл', price: 15000, image: '/images/67.jpg' }] },
    { id: 'c11', title: 'LUNGO', description: 'Кофе долгой экстракции', badge: 'Хит', sizes: [{ name: '180 мл', price: 23000, image: '/images/12c.jpg' }, { name: '100 мл', price: 15000, image: '/images/9.jpg' }] },
    { id: 'c12', title: 'ESPRESSO MACCHIATO', description: 'Эспрессо с небольшой молочной пенкой', badge: 'Хит', sizes: [{ name: '130 мл', price: 25000, image: '/images/11c.jpg' }, { name: '70 мл', price: 15000, image: '/images/=.jpg' }] },
    { id: 'c13', title: 'ESPRESSO', description: 'Чистый и крепкий эспрессо', badge: 'Хит', sizes: [{ name: '100 мл', price: 23000, image: '/images/13c.jpg' }, { name: '50 мл', price: 15000, image: '/images/4.jpg' }] },
    { id: 'c14', title: 'RISTRETTO', description: 'Очень крепкий и насыщенный кофе', badge: 'Хит', sizes: [{ name: '50 мл', price: 23000, image: '/images/4.jpg' }] }
  ],
  'non-coffee': [
    { id: 'nc1', title: 'HOT CHOCOLATE', description: 'Густой и согревающий шоколад', badge: '', sizes: [{ name: '300 мл', price: 20000, image: '/images/1n.jpg' }, { name: '220 мл', price: 16000, image: '/images/7.jpg' }] },
    { id: 'nc2', title: 'MATCHA LATTE', description: 'Сочетание японского зеленого чая и молока', badge: 'Эко', sizes: [{ name: '300 мл', price: 25000, image: '/images/3n.jpg' }, { name: '220 мл', price: 20000, image: '/images/1y.jpg' }] },
    { id: 'nc3', title: 'COCOA', description: 'Теплое и сладкое какао', badge: 'Эко', sizes: [{ name: '300 мл', price: 18000, image: '/images/2n.jpg' }, { name: '220 мл', price: 15000, image: '/images/8.jpg' }] }
  ],
  pechenie: [
    { id: 'p1', title: 'Медовик', description: 'Классический медово-сливочный десерт', badge: 'Хит', sizes: [{ name: 'Целый', price: 20000, image: '/images/1d.jpg' }] },
    { id: 'p2', title: 'Спартак', description: 'Слоеный шоколадно-медовый десерт', badge: 'Рекомендуем', sizes: [{ name: 'Целый', price: 20000, image: '/images/2d.jpg' }] },
    { id: 'p3', title: 'Эклер', description: 'Сладость, наполненная нежным кремом', badge: '', sizes: [{ name: 'Целый', price: 15000, image: '/images/3d.jpg' }] },
    { id: 'p4', title: 'ТРИ ШОКОЛАДА', description: 'Нежный десерт из трех видов шоколада', badge: 'Хит', sizes: [{ name: 'Целый', price: 30000, image: '/images/4d.jpg' }] },
    { id: 'p5', title: 'СНИКЕРС соленый', description: 'Сладость со вкусом классического Сникерса', badge: '', sizes: [{ name: 'Целый', price: 35000, image: '/images/8d.jpg' }] },
    { id: 'p6', title: 'СНИКЕРС', description: 'Сладость со вкусом классического Сникерса', badge: '', sizes: [{ name: 'Целый', price: 30000, image: '/images/5d.jpg' }] },
    { id: 'p7', title: 'ТВОРОЖНАЯ МАЛИНА', description: 'Сочетание легкого творога и малины', badge: 'Рекомендуем', sizes: [{ name: 'Целый', price: 30000, image: '/images/6d.jpg' }] },
    { id: 'p8', title: 'САН-СЕБАСТЬЯН', description: 'Нежный чизкейк из сливочного сыра', badge: 'Рекомендуем', sizes: [{ name: 'Целый', price: 35000, image: '/images/7d.jpg' }] },
    { id: 'p9', title: 'ЧИЗКЕЙК СНИКЕРС И ВИШНЯ', description: 'Фирменный чизкейк со Сникерсом и вишней', badge: 'Хит', sizes: [{ name: 'Целый', price: 40000, image: '/images/-.jpg' }] },
    { id: 'p10', title: 'Круассан', description: 'Фирменный чизкейк со Сникерсом и вишней', badge: 'Хит', sizes: [{ name: 'Целый', price: 40000, image: '/images/kurasan.jpg' }] }
  ],
  choy: [
    { id: 'ch2', title: 'Малиновый каркаде', description: 'Чай с фруктовым вкусом', badge: 'Рекомендуем', sizes: [{ name: 'Стандарт', price: 25000, image: '/images/2a.jpg' }] },
    { id: 'ch3', title: 'Чай Глинтвейн', description: 'Согревающий фирменный чай', badge: '', sizes: [{ name: 'Стандарт', price: 35000, image: '/images/3a.jpg' }] },
    { id: 'ch4', title: 'Масала', description: 'Традиционный чай со специями', badge: '', sizes: [{ name: 'Стандарт', price: 50000, image: '/images/4a.jpg' }] },
    { id: 'ch5', title: 'Пуэр', description: 'Крепкий черный чай', badge: '', sizes: [{ name: 'Стандарт', price: 40000, image: '/images/1a.jpg' }] },
    { id: 'ch6', title: 'Лимонный чай', description: 'Легкий цитрусовый чай', badge: 'Рекомендуем', sizes: [{ name: '200 мл', price: 30000, image: '/images/6a.jpg' },] },
    { id: 'ch7', title: 'Жасмин', description: 'Ароматный чай с цветочным вкусом', badge: 'Рекомендуем', sizes: [{ name: 'Целый', price: 40000, image: '/images/7a.jpg' },] },
    { id: 'ch8', title: 'Тегуаньинь', description: 'Изысканный чай сорта Улун', badge: '', sizes: [{ name: 'Стандарт', price: 40000, image: '/images/tiguanin.jpg' }] },
    { id: 'ch9', title: 'Да Хун Пао', description: 'Легендарный темный улун', badge: '', sizes: [{ name: 'Стандарт', price: 40000, image: '/images/13a.jpg' }] },
    { id: 'ch10', title: 'ЖЕНЬШЕНЬ', description: 'Бодрящий чай с женьшенем', badge: '', sizes: [{ name: 'Стандарт', price: 40000, image: '/images/jrnshen.jpg' }] }
  ],
  'ice-drink': [
    { id: 'ic1', title: 'ICE AMERICANO', description: 'Классический ледяной американо', badge: 'Хит', sizes: [{ name: '330 мл', price: 25000, image: '/images/1s.jpg' }, { name: '200 мл', price: 15000, image: '/images/6.jpg' }] },
    { id: 'ic2', title: 'ICE CAPPUCCINO', description: 'Ледяной капучино с пенкой', badge: 'Хит', sizes: [{ name: '500 мл', price: 40000, image: '/images/2s.jpg' }, { name: '350 мл', price: 30000, image: '/images/2.jpg' }, { name: '300 мл', price: 20000, image: '/images/2s.jpg' }] },
    { id: 'ic3', title: 'ICE LATTE', description: 'Ледяной кофе с молоком', badge: 'Рекомендуем', sizes: [{ name: '500 мл', price: 40000, image: '/images/ice.jpg' }, { name: '350 мл', price: 30000, image: '/images/ice1.jpg' }, { name: '300 мл', price: 20000, image: '/images/3s.jpg' }] },
    { id: 'ic4', title: 'МОХИТО', description: 'Освежающий коктейль с мятой и лаймом', badge: 'Хит', sizes: [{ name: 'Стандарт', price: 30000, image: '/images/3s.jpg' }] },
    { id: 'ic5', title: 'АПЕЛЬСИНОВЫЙ ФРЕШ', description: 'Свежевыжатый апельсиновый сок', badge: 'Эко', sizes: [{ name: 'Стандарт', price: 50000, image: '/images/4s.jpg' }] },
    { id: 'ic6', title: 'ЯБЛОЧНЫЙ ФРЕШ', description: 'Свежевыжатый яблочный сок', badge: 'Эко', sizes: [{ name: 'Стандарт', price: 40000, image: '/images/5s.jpg' }] },
    { id: 'ic7', title: 'МИКС ФРЕШ', description: 'Свежевыжатый сок из смеси фруктов', badge: 'Рекомендуем', sizes: [{ name: 'Стандарт', price: 45000, image: '/images/6s.jpg' }] },
    { id: 'ic8', title: 'MILKSHAKE', description: 'Молочный коктейль с мороженым', badge: 'Хит', sizes: [{ name: 'Стандарт', price: 30000, image: '/images/7s.jpg' }] }
  ],
  ice: [
    { 
    id: 'bt1', 
    title: 'МАРАКУЙЯ ЛИМОНАД', 
    description: 'Освежающий тропический лимонад с сиропом маракуйи и шариками тапиоки.', 
    badge: 'Новинка', 
    sizes: [{ name: 'Стандарт', price: 35000, image: '/images/buble1.jpg' }] 
  },
  { 
    id: 'bt2', 
    title: 'ГРАНАТ ЧЕРНИКА', 
    description: 'Яркий ягодный микс граната и черники с жемчужинами бабл ти.', 
    badge: '', 
    sizes: [{ name: 'Стандарт', price: 38000, image: '/images/3.jpg' }] 
  },
  { 
    id: 'bt3', 
    title: 'АНАНАС МАНГО', 
    description: 'Солнечный коктейль со вкусом спелого манго и сочного ананаса.', 
    badge: 'Хит', 
    sizes: [{ name: 'Стандарт', price: 38000, image: '/images/buble4.jpg' }] 
  },
  { 
    id: 'bt4', 
    title: 'КЛЮКВА РОЗА', 
    description: 'Нежное сочетание терпкой клюквы и цветочного аромата розы с тапиокой.', 
    badge: 'Рекомендуем', 
    sizes: [{ name: 'Стандарт', price: 35000, image: '/images/buble5.jpg' }] 
  },
  { 
    id: 'bt5', 
    title: 'ТАРХУН АЛОЭ', 
    description: 'Уникальный тонизирующий напиток с кусочками алоэ и нотками тархуна.', 
    badge: '', 
    sizes: [{ name: 'Стандарт', price: 36000, image: '/images/buble6.jpg' }] 
  },
  { 
    id: 'bt6', 
    title: 'ФРАППЕ ДЫНЯ ЛАЙМ', 
    description: 'Ледяной фраппе со сладкой дыней, легкой кислинкой лайма и бобой.', 
    badge: 'Ice', 
    sizes: [{ name: 'Стандарт', price: 42000, image: '/images/buble7.jpg' }] 
  },
  { 
    id: 'bt7', 
    title: 'МАТЧА АНАНАС', 
    description: 'Японский чай матча, дополненный сладким ананасовым соком и тапиокой.', 
    badge: 'Рекомендуем', 
    sizes: [{ name: 'Стандарт', price: 45000, image: '/images/buble8.jpg' }] 
  },
  { 
    id: 'bt8', 
    title: 'КЛУБНИКА МАНГО', 
    description: 'Сладкий фруктовый бабл ти на основе клубники и тропического манго.', 
    badge: '', 
    sizes: [{ name: 'Стандарт', price: 38000, image: '/images/buble9.jpg' }] 
  },
  { 
    id: 'bt9', 
    title: 'КЛАССИКА', 
    description: 'Традиционный тайваньский бабл ти с черным чаем, молоком и тапиокой.', 
    badge: 'Классика', 
    sizes: [{ name: 'Стандарт', price: 32000, image: '/images/buble10.jpg' }] 
  },
  { 
    id: 'bt10', 
    title: 'КАРАМЕЛЬНЫЙ', 
    description: 'Сливочный бабл ти с насыщенным карамельным сиропом и мягкой тапиокой.', 
    badge: 'Хит', 
    sizes: [{ name: 'Стандарт', price: 38000, image: '/images/buble11.jpg' }] 
  },
  { 
    id: 'bt11', 
    title: 'ТАПИКОС', 
    description: 'Авторский молочный напиток с двойной порцией жевательной тапиоки.', 
    badge: 'Спецпредложение', 
    sizes: [{ name: 'Стандарт', price: 40000, image: '/images/buble12 .jpg' }] 
  }
    ]
}

const currentCategoryInfo = computed(() => {
  return categories.value.find(c => c.id === activeCategory.value) || categories.value[0]
})

const filteredItems = computed(() => {
  const items = menuData[activeCategory.value] || []
  if (!searchQuery.value.trim()) return items
  const query = searchQuery.value.toLowerCase().trim()
  return items.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.description.toLowerCase().includes(query)
  )
})

const selectSize = (itemId, index) => { selectedSizes[itemId] = index }
const selectCategory = (id) => { activeCategory.value = id }
const getItemPrice = (item) => item.sizes?.[selectedSizes[item.id] || 0]?.price || item.sizes?.[0]?.price || 0
const getItemImage = (item) => item.sizes?.[selectedSizes[item.id] || 0]?.image || item.sizes?.[0]?.image || ''
const formatPrice = (val) => val ? val.toLocaleString('ru-RU') : 0

const getBadgeClass = (badge) => {
  if (badge === 'Хит') return 'badge-hit'
  if (badge === 'Рекомендуем') return 'badge-recommend'
  if (badge === 'Эко') return 'badge-eco'
  return ''
}

// Modalni ochish va yopish funksiyalari
const openProductModal = (item) => {
  selectedProduct.value = item;
  document.body.style.overflow = 'hidden'; // Orqa fon skrollini to'xtatish
}

const closeProductModal = () => {
  selectedProduct.value = null;
  document.body.style.overflow = 'auto'; // Skrollni qaytarish
}

// Esc tugmasi bosilganda modalni yopish
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectedProduct.value) closeProductModal()
  })
})
</script>
<style scoped>
* {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

.menu-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f6f0 0%, #ece6d8 100%);
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
  color: #0f241c;
  margin-top: 100px;
}

/* Sidebar Desktop */
.sidebar {
  width: 290px;
  background: #0a1e17;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
  border-top-right-radius: 28px;
  border-bottom-right-radius: 28px;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.12);
  z-index: 100;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
}

.brand-logo {
  font-size: 26px;
  background: linear-gradient(135deg, rgba(230, 184, 92, 0.3), rgba(230, 184, 92, 0.1));
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 1px solid rgba(230, 184, 92, 0.4);
}

.brand-title {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.brand-subtitle {
  font-size: 11px;
  color: #e6b85c;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: transparent;
  border: none;
  width: 100%;
  padding: 14px 18px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: #8da398;
  font-size: 14px;
  font-weight: 700;
}

.nav-item.active {
  background: linear-gradient(135deg, #153e30 0%, #0d2a20 100%);
  color: #e6b85c;
  border: 1px solid rgba(230, 184, 92, 0.25);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

/* Main Content */
.main-content {
  flex-grow: 1;
  padding: 36px 44px;
  max-width: 1350px;
  width: 100%;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px dashed rgba(15, 36, 28, 0.1);
  gap: 16px;
}

.category-name {
  font-size: 32px;
  font-weight: 900;
  color: #0a1e17;
  margin: 0 0 6px 0;
}

.category-desc {
  font-size: 14px;
  color: #5e736a;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(10, 30, 23, 0.12);
  border-radius: 16px;
  padding: 8px 14px;
}

.search-input {
  border: none;
  outline: none;
  font-size: 13px;
  font-weight: 600;
  color: #0a1e17;
  width: 160px;
}

.clear-search {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}

.items-count {
  background: #0a1e17;
  color: #e6b85c;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 16px;
  white-space: nowrap;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 22px;
}

.product-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(10, 30, 23, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer; /* Qo'shildi */
}

.product-card:hover {
  box-shadow: 0 12px 32px rgba(10, 30, 23, 0.12);
  transform: translateY(-4px);
}

.product-card:active {
  transform: scale(0.98);
}

.card-image-box {
  position: relative;
  width: 100%;
  height: 190px;
  border-radius: 18px;
  overflow: hidden;
  background: #e5e0d4;
  margin-bottom: 12px;
}

.product-image {
  width: 100%;
  height: 30vh;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.badge-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(10, 30, 23, 0.85);
  color: #e6b85c;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 10px;
  z-index: 10;
}

.badge-hit { background: #d9534f; color: #fff; }
.badge-recommend { background: #0a1e17; color: #e6b85c; }
.badge-eco { background: #2e7d32; color: #fff; }

.product-title {
  font-size: 17px;
  font-weight: 800;
  color: #0a1e17;
  margin: 0 0 4px 0;
}

.product-desc {
  font-size: 12px;
  color: #63776e;
  line-height: 1.4;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.size-selector {
  display: flex;
  gap: 4px;
  background: #f2efe8;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 14px;
  margin-top: auto;
}

.size-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: #5e736a;
  padding: 6px 2px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn.active {
  background: #ffffff;
  color: #0a1e17;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-num {
  font-size: 17px;
  font-weight: 900;
  color: #0a1e17;
}

.currency {
  font-size: 11px;
  font-weight: 700;
  color: #8da398;
  margin-left: 3px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #5e736a;
}

/* ==================================
   MODAL OYNASI UCHUN STIL (Batafsil)
   ================================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 30, 23, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: #0a1e17;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.modal-close:hover {
  background: #fff;
}

.modal-image-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  background: #e5e0d4;
}

.modal-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-badge {
  top: 16px;
  left: 16px;
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 12px;
}

.modal-details {
  padding: 24px;
}

.modal-title {
  font-size: 26px;
  font-weight: 900;
  color: #0a1e17;
  margin: 0 0 8px 0;
}

.modal-description {
  font-size: 14px;
  color: #63776e;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.section-title {
  font-size: 14px;
  font-weight: 800;
  color: #0a1e17;
  margin: 0 0 10px 0;
}

.modal-size-selector {
  padding: 6px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.modal-size-selector .size-btn {
  padding: 10px 6px;
  font-size: 14px;
  border-radius: 12px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 10px;
}

.modal-price .price-num {
  font-size: 28px;
}

.modal-price .currency {
  font-size: 14px;
}

.add-to-cart-large {
  flex-grow: 1;
  background: #0a1e17;
  color: #e6b85c;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.add-to-cart-large:active {
  transform: scale(0.96);
}

/* Modal Animatsiyasi */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-fade-leave-active .modal-container {
  animation: modalPopOut 0.2s ease-in forwards;
}

@keyframes modalPop {
  0% { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes modalPopOut {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0; }
}
/* Mobil Moslashtirish */
@media (max-width: 900px) {
  .menu-layout { flex-direction: column; }
  .sidebar {
    width: 100%; height: auto; position: sticky; top: 0;
    border-radius: 0 0 20px 20px; padding: 14px 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); backdrop-filter: blur(12px);
  }
  .sidebar-brand { margin-bottom: 12px; gap: 10px; }
  .nav-menu { flex-direction: row; overflow-x: auto; scrollbar-width: none; }
  .nav-menu::-webkit-scrollbar { display: none; }
  .nav-item { white-space: nowrap; flex-shrink: 0; }
  .main-content { padding: 20px 14px; }
  .category-header { flex-direction: column; align-items: stretch; gap: 12px; margin-bottom: 20px; }
  .header-actions { justify-content: space-between; width: 100%; }
}

@media (max-width: 580px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .product-card { padding: 10px; border-radius: 18px; }
  .card-image-box { height: 130px; border-radius: 14px; margin-bottom: 8px; }
  .product-title { font-size: 14px; line-height: 1.2; }
  .product-desc { font-size: 11px; margin-bottom: 8px; -webkit-line-clamp: 1; }
  
  /* Mobil Modal Oynasi */
  .modal-container { border-radius: 24px 24px 0 0; position: absolute; bottom: 0; max-width: 100%; }
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-image-wrapper { height: 220px; }
  .modal-title { font-size: 22px; }
  @keyframes modalPop {
    0% { transform: translateY(100%); }
    100% { transform: translateY(0); }
  }
  @keyframes modalPopOut {
    0% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }
}
</style>