<template>
  <div class="menu-layout">
    <!-- SIDEBAR (Faqat Desktop uchun) -->
    <aside class="sidebar desktop-only">
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
          <span class="active-indicator" v-if="activeCategory === category.id"></span>
        </button>
      </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- MOBIL HEADER (Faqat Telefonda chiqadi) -->
      <div class="mobile-header mobile-only">
        <div class="mobile-brand-row">
          <div class="brand-logo-sm">☕</div>
          <div>
            <h2 class="mobile-brand-title">COFFICH</h2>
            <span class="mobile-brand-sub">Premium Taste</span>
          </div>
        </div>
        <div class="search-box mobile-search">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Поиск напитков..." 
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</button>
        </div>
      </div>

      <!-- MOBIL KATEGORIYALAR (Gorizontal suriladigan) -->
      <div class="mobile-categories mobile-only">
        <button
          v-for="category in categories"
          :key="category.id"
          class="mob-cat-pill"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span>{{ category.icon }}</span>
          <span>{{ category.name }}</span>
        </button>
      </div>

      <!-- DESKTOP HEADER -->
      <header class="category-header desktop-only">
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
              placeholder="Поиск напитков и десертов..." 
              class="search-input"
            />
            <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</button>
          </div>
          <div class="items-count">
            <span>{{ filteredItems.length }} шт.</span>
          </div>
        </div>
      </header>

      <!-- PRODUCTS GRID -->
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

            <div class="card-footer" :class="{ 'mt-auto': !item.sizes || item.sizes.length <= 1 }">
              <div class="product-price">
                <span class="price-num">{{ formatPrice(getItemPrice(item)) }}</span>
                <span class="currency">сум</span>
              </div>
              <button class="add-btn" @click.stop="openProductModal(item)">➔</button>
            </div>
          </div>
        </article>
      </TransitionGroup>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <span class="empty-icon">☕</span>
        <p>К сожалению, ничего не найдено...</p>
      </div>
    </main>

    <!-- PREMIUM MODAL / BOTTOM SHEET -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="selectedProduct" class="modal-overlay" @click="closeProductModal">
          <div class="modal-container" @click.stop>
            
            <div class="swipe-indicator"></div>
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
              <div class="modal-image-gradient"></div>
            </div>

            <div class="modal-details">
              <div class="modal-header-info">
                <h2 class="modal-title">{{ selectedProduct.title }}</h2>
                <p class="modal-description">{{ selectedProduct.description }}</p>
                <p class="modal-ingredients" v-if="selectedProduct.ingredients">
                  <strong>Состав:</strong> {{ selectedProduct.ingredients }}
                </p>
              </div>

              <div class="modal-sizes-section" v-if="selectedProduct.sizes && selectedProduct.sizes.length > 1">
                <h4 class="section-title">Выберите объем / размер:</h4>
                <div class="modal-size-selector">
                  <button 
                    v-for="(size, index) in selectedProduct.sizes" 
                    :key="index"
                    class="modal-size-btn"
                    :class="{ active: (selectedSizes[selectedProduct.id] || 0) === index }"
                    @click.stop="selectSize(selectedProduct.id, index)"
                  >
                    <span class="size-name">{{ size.name }}</span>
                  </button>
                </div>
              </div>

              <div class="modal-footer">
                <div class="product-price modal-price">
                  <span class="price-num">{{ formatPrice(getItemPrice(selectedProduct)) }}</span>
                  <span class="currency">сум</span>
                </div>
                <button class="modal-add-to-cart" @click="closeProductModal">
                  Хорошо 
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue'

const activeCategory = ref('coffee')
const searchQuery = ref('')
const selectedSizes = reactive({})
const selectedProduct = ref(null)

const categories = ref([
  { id: 'coffee', name: 'COFFEE', icon: '☕', description: 'Утонченные и ароматные кофейные напитки' },
  { id: 'non-coffee', name: 'NON COFFEE', icon: '🥛', description: 'Какао, горячий шоколад и виды матчи' },
  { id: 'pechenie', name: 'SWEETS', icon: '🥐', description: 'Сладости, десерты и вкусная выпечка' },
  { id: 'choy', name: 'TEA', icon: '🍵', description: 'Заварные и фруктовые бодрящие чаи' },
  { id: 'ice-drink', name: 'ICE DRINKS', icon: '🧊', description: 'Освежающие холодные коктейли' },
  { id: 'ice', name: 'BUBBLE TEA', icon: '🧋', description: 'Освежающие холодные коктейли' },
])

const menuData = {
    coffee: [

    { id: 'c1', title: 'CAPPUCCINO', description: 'Классический кофейный напиток с мягкой кремовой пенкой', badge: 'Хит', sizes: [{ name: '500 мл', price: 40000, image: '/images/1c.jpg' }, { name: '300 мл', price: 20000, image: '/images/1q.jpg' }, { name: '220 мл', price: 18000, image: '/images/1e.jpg' }] },

    { id: 'c2', title: 'COFFEE LATTE', description: 'Идеальное сочетание нежного молока и эспрессо', badge: '', sizes: [{ name: '500 мл', price: 40000, image: '/images/2c.jpg' }, { name: '300 мл', price: 20000, image: '/images/1q.jpg' }, { name: '220 мл', price: 18000, image: '/images/1e.jpg' }] },

    { id: 'c3', title: 'DOUBLE COFFEE', description: 'Чистый экстракт кофе и горячая вода', badge: '', sizes: [{ name: 'CAPPUCCINO', price: 30000, image: '/images/3c.jpg' }, { name: 'LATTE', price: 30000, image: '/images/1c.jpg' }] },

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

    { id: 'p10', title: 'Круассан', description: 'Фирменный чизкейк со Сникерсом и вишней', badge: 'Хит', sizes: [{ name: 'Целый', price: 40000, image: '/images/kur.png' }] }

  ],

  choy: [

    { id: 'ch2', title: 'Малиновый каркаде', description: 'Чай с фруктовым вкусом', badge: 'Рекомендуем', sizes: [{ name: 'Стандарт', price: 25000, image: '/images/2a.jpg' }] },

    { id: 'ch3', title: 'Чай Глинтвейн', description: 'Согревающий фирменный чай', badge: '', sizes: [{ name: 'Стандарт', price: 35000, image: '/images/3a.jpg' }] },

    { id: 'ch4', title: 'Масала', description: 'Традиционный чай со специями', badge: '', sizes: [{ name: 'Стандарт', price: 50000, image: '/images/4a.jpg' }] },

    { id: 'ch5', title: 'Пуэр', description: 'Крепкий черный чай', badge: '', sizes: [{ name: 'Стандарт', price: 40000, image: '/images/1a.jpg' }] },

    { id: 'ch6', title: 'Лимонный чай', description: 'Легкий цитрусовый чай', badge: 'Рекомендуем', sizes: [{ name: '200 мл', price: 30000, image: '/images/6a.jpg' }] },

    { id: 'ch7', title: 'Жасмин', description: 'Ароматный чай с цветочным вкусом', badge: 'Рекомендуем', sizes: [{ name: 'Целый', price: 40000, image: '/images/7a.jpg' }] },

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

    { id: 'bt1', title: 'МАРАКУЙЯ ЛИМОНАД', description: 'Освежающий тропический лимонад с сиропом маракуйи и шариками тапиоки.', badge: 'Новинка', sizes: [{ name: 'Стандарт', price: 35000, image: '/images/buble1.jpg' }] },

    { id: 'bt2', title: 'ГРАНАТ ЧЕРНИКА', description: 'Яркий ягодный микс граната и черники с жемчужинами бабл ти.', badge: '', sizes: [{ name: 'Стандарт', price: 38000, image: '/images/3.jpg' }] },

    { id: 'bt3', title: 'АНАНАС МАНГО', description: 'Солнечный коктейль со вкусом спелого манго и сочного ананаса.', badge: 'Хит', sizes: [{ name: 'Стандарт', price: 38000, image: '/images/buble4.jpg' }] },

    { id: 'bt4', title: 'КЛЮКВА РОЗА', description: 'Нежное сочетание терпкой клюквы и цветочного аромата розы с тапиокой.', badge: 'Рекомендуем', sizes: [{ name: 'Стандарт', price: 35000, image: '/images/buble5.jpg' }] },

    { id: 'bt5', title: 'ТАРХУН АЛОЭ', description: 'Уникальный тонизирующий напиток с кусочками алоэ и нотками тархуна.', badge: '', sizes: [{ name: 'Стандарт', price: 36000, image: '/images/buble6.jpg' }] },

    { id: 'bt6', title: 'ФРАППЕ ДЫНЯ ЛАЙМ', description: 'Ледяной фраппе со сладкой дыней, легкой кислинкой лайма и бобой.', badge: 'Ice', sizes: [{ name: 'Стандарт', price: 42000, image: '/images/buble7.jpg' }] },

    { id: 'bt7', title: 'МАТЧА АНАНАС', description: 'Японский чай матча, дополненный сладким ананасовым соком и тапиокой.', badge: 'Рекомендуем', sizes: [{ name: 'Стандарт', price: 45000, image: '/images/buble8.jpg' }] },

    { id: 'bt8', title: 'КЛУБНИКА МАНГО', description: 'Сладкий фруктовый бабл ти на основе клубники и тропического манго.', badge: '', sizes: [{ name: 'Стандарт', price: 38000, image: '/images/buble9.jpg' }] },

    { id: 'bt9', title: 'КЛАССИКА', description: 'Традиционный тайваньский бабл ти с черным чаем, молоком и тапиокой.', badge: 'Классика', sizes: [{ name: 'Стандарт', price: 32000, image: '/images/buble10.jpg' }] },

    { id: 'bt10', title: 'КАРАМЕЛЬНЫЙ', description: 'Сливочный бабл ти с насыщенным карамельным сиропом и мягкой тапиокой.', badge: 'Хит', sizes: [{ name: 'Стандарт', price: 38000, image: '/images/buble11.jpg' }] },

    { id: 'bt11', title: 'ТАПИКОС', description: 'Авторский молочный напиток с двойной порцией жевательной тапиоки.', badge: 'Спецпредложение', sizes: [{ name: 'Стандарт', price: 40000, image: '/images/buble12.jpg' }] }

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
const selectCategory = (id) => { activeCategory.value = id; searchQuery.value = '' }
const getItemPrice = (item) => item.sizes?.[selectedSizes[item.id] || 0]?.price || item.sizes?.[0]?.price || 0
const getItemImage = (item) => item.sizes?.[selectedSizes[item.id] || 0]?.image || item.sizes?.[0]?.image || ''
const formatPrice = (val) => val ? val.toLocaleString('ru-RU') : 0

const getBadgeClass = (badge) => {
  if (badge === 'Хит') return 'badge-hit'
  if (badge === 'Рекомендуем') return 'badge-recommend'
  if (badge === 'Эко') return 'badge-eco'
  if (badge === 'Новинка') return 'badge-new'
  return 'badge-default'
}

const openProductModal = (item) => { 
  selectedProduct.value = item 
  if (selectedSizes[item.id] === undefined) {
    selectedSizes[item.id] = 0
  }
}
const closeProductModal = () => { selectedProduct.value = null }

watch(selectedProduct, (val) => {
  if (val) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})

const handleKeydown = (e) => {
  if (e.key === 'Escape' && selectedProduct.value) closeProductModal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');

* {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

.desktop-only { display: flex; }
.mobile-only { display: none; }

.menu-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f4f6f5; 
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0a1e17;
  position: relative;
  margin-top: 85px;
}

/* SIDEBAR */
.sidebar {
  width: 300px;
  background: #0a1e17;
  padding: 32px 24px;
  flex-direction: column;
  height: 100vh;
  flex-shrink: 0;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  position: relative;
  z-index: 20;
}
.sidebar::-webkit-scrollbar { display: none; }

.sidebar-brand { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; }
.brand-logo { font-size: 24px; background: linear-gradient(135deg, #e6b85c, #d4a03b); color: #0a1e17; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 16px; }
.brand-title { font-size: 22px; font-weight: 900; color: #ffffff; margin: 0; }
.brand-subtitle { font-size: 11px; color: #e6b85c; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; }

.nav-menu { display: flex; flex-direction: column; gap: 12px; }
.nav-item { position: relative; display: flex; align-items: center; gap: 16px; background: transparent; border: none; width: 100%; padding: 16px 20px; border-radius: 16px; cursor: pointer; transition: all 0.3s ease; color: #8da398; font-size: 15px; font-weight: 700; text-align: left; }
.nav-item:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
.nav-item.active { background: rgba(230, 184, 92, 0.1); color: #e6b85c; }
.active-indicator { position: absolute; right: 16px; width: 6px; height: 6px; border-radius: 50%; background: #e6b85c; box-shadow: 0 0 10px #e6b85c; }

/* MAIN CONTENT */
.main-content { flex-grow: 1; height: 100vh; overflow-y: auto; padding: 40px 50px; scroll-behavior: smooth; background: #f9faf9; position: relative; }
.main-content::-webkit-scrollbar { width: 8px; }
.main-content::-webkit-scrollbar-track { background: transparent; }
.main-content::-webkit-scrollbar-thumb { background: rgba(10, 30, 23, 0.15); border-radius: 10px; }

.category-header { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 16px 0 20px 0; margin-bottom: 28px; border-bottom: 1px solid rgba(10, 30, 23, 0.08); }
.category-name { font-size: 32px; font-weight: 900; color: #0a1e17; margin: 0 0 4px 0; }
.category-desc { font-size: 14px; color: #5e736a; margin: 0; font-weight: 500; }

.header-actions { display: flex; align-items: center; gap: 12px; }
.search-box { display: flex; align-items: center; background: #ffffff; border: 1px solid rgba(10, 30, 23, 0.08); border-radius: 18px; padding: 10px 18px; }
.search-input { border: none; outline: none; font-size: 14px; font-weight: 600; width: 220px; background: transparent; margin-left: 8px; color: #0a1e17; }
.clear-search { background: none; border: none; font-size: 14px; color: #8da398; cursor: pointer; }
.items-count { background: #0a1e17; color: #e6b85c; font-size: 13px; font-weight: 700; padding: 10px 18px; border-radius: 16px; }

/* PRODUCTS GRID */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; padding-bottom: 60px; }
.product-card { background: #ffffff; border-radius: 24px; padding: 16px; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(10, 30, 23, 0.04); border: 1px solid rgba(10, 30, 23, 0.03); cursor: pointer; transition: all 0.3s; }
.product-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(10, 30, 23, 0.1); }
.card-image-box { position: relative; width: 100%; aspect-ratio: 4/3; border-radius: 16px; overflow: hidden; background: #f4f6f5; margin-bottom: 16px; }
.product-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.product-card:hover .product-image { transform: scale(1.08); }

.badge-tag { position: absolute; top: 12px; left: 12px; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 12px; z-index: 1; text-transform: uppercase; }
.badge-hit { background: #d93832; color: #fff; box-shadow: 0 4px 12px rgba(217, 56, 50, 0.3); }
.badge-recommend { background: #0a1e17; color: #e6b85c; }
.badge-eco { background: #2e7d32; color: #fff; }
.badge-new { background: #3b82f6; color: #fff; }
.badge-default { background: rgba(10, 30, 23, 0.8); color: #fff; }

.card-info { display: flex; flex-direction: column; flex-grow: 1; }
.product-title { font-size: 18px; font-weight: 800; color: #0a1e17; margin: 0 0 6px 0; }
.product-desc { font-size: 13px; color: #63776e; line-height: 1.5; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.size-selector { display: flex; gap: 6px; background: #f4f6f5; padding: 6px; border-radius: 14px; margin-bottom: 16px; margin-top: auto; }
.size-btn { flex: 1; background: transparent; border: none; color: #5e736a; padding: 8px 4px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.size-btn.active { background: #ffffff; color: #0a1e17; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); }

.card-footer { display: flex; justify-content: space-between; align-items: center; }
.mt-auto { margin-top: auto; }
.price-num { font-size: 20px; font-weight: 900; color: #0a1e17; }
.currency { font-size: 12px; font-weight: 700; color: #8da398; margin-left: 4px; }
.add-btn { background: #f4f6f5; border: none; width: 40px; height: 40px; border-radius: 12px; font-size: 22px; color: #0a1e17; cursor: pointer; transition: all 0.2s; }
.product-card:hover .add-btn { background: #0a1e17; color: #e6b85c; }

/* MODAL / BOTTOM SHEET */
.modal-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 30, 23, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-container {
  background: #ffffff;
  width: 100%;
  max-width: 460px;
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.swipe-indicator {
  display: none;
  width: 40px;
  height: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: #0a1e17;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  background: #f4f6f5;
}

.modal-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
}

.modal-badge { top: 16px; left: 16px; font-size: 12px; padding: 6px 14px; border-radius: 14px; }

.modal-details { 
  padding: 10px 28px 28px 28px; 
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-header-info { display: flex; flex-direction: column; gap: 6px; }
.modal-title { font-size: 24px; font-weight: 900; color: #0a1e17; margin: 0; }
.modal-description { font-size: 14px; color: #5e736a; line-height: 1.5; margin: 0; }
.modal-ingredients { font-size: 13px; color: #8da398; margin: 0; }
.modal-ingredients strong { color: #0a1e17; }

.section-title { font-size: 12px; font-weight: 800; color: #8da398; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px; }

.modal-size-selector { display: flex; gap: 8px; }
.modal-size-btn { flex: 1; padding: 12px 8px; background: #f4f6f5; border: 2px solid transparent; color: #5e736a; border-radius: 14px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; text-align: center; }
.modal-size-btn.active { background: rgba(10, 30, 23, 0.04); border-color: #0a1e17; color: #0a1e17; }

.modal-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
.modal-price .price-num { font-size: 26px; font-weight: 900; }
.modal-price .currency { font-size: 14px; font-weight: 700; }

.modal-add-to-cart {
  background: #0a1e17;
  color: #e6b85c;
  border: none;
  padding: 15px 28px;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 20px rgba(10, 30, 23, 0.2);
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-container { animation: modalPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.1); }
.modal-fade-leave-active .modal-container { animation: modalPopOut 0.25s ease-in forwards; }

@keyframes modalPop { 0% { transform: scale(0.95) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
@keyframes modalPopOut { 0% { transform: scale(1) translateY(0); opacity: 1; } 100% { transform: scale(0.95) translateY(20px); opacity: 0; } }

/* MOBIL RESPONSIVE QUILISH (900px dan pastda ishlaydi) */
@media (max-width: 900px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }

  .menu-layout { flex-direction: column; }
  
  .main-content { 
    padding: 16px; 
    padding-bottom: 90px; 
    height: 100vh;
  }

  /* Mobil Header */
  .mobile-header {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 14px;
  }
  .mobile-brand-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand-logo-sm {
    font-size: 20px;
    background: linear-gradient(135deg, #e6b85c, #d4a03b);
    color: #0a1e17;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }
  .mobile-brand-title { font-size: 18px; font-weight: 900; color: #0a1e17; margin: 0; }
  .mobile-brand-sub { font-size: 10px; color: #e6b85c; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; }
  
  .mobile-search { width: 100%; border-radius: 14px; padding: 8px 14px; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
  .mobile-search .search-input { width: 100%; }

  /* Gorizontal Kategoriya tasmachalari */
  .mobile-categories {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 10px;
    margin-bottom: 16px;
    scrollbar-width: none;
  }
  .mobile-categories::-webkit-scrollbar { display: none; }
  
  .mob-cat-pill {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    border: 1px solid rgba(10, 30, 23, 0.08);
    padding: 10px 16px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 700;
    color: #5e736a;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    transition: all 0.2s;
  }
  .mob-cat-pill.active {
    background: #0a1e17;
    color: #e6b85c;
    border-color: #0a1e17;
  }

  /* Kichik ekranli Grid */
  .products-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 12px; 
  }
  
  .product-card { 
    padding: 10px; 
    border-radius: 18px; 
  }
  
  .card-image-box { 
    aspect-ratio: 1/1; 
    border-radius: 12px; 
    margin-bottom: 10px;
  }
  
  .product-title { font-size: 14px; margin-bottom: 4px; }
  .product-desc { font-size: 11px; margin-bottom: 10px; -webkit-line-clamp: 1; }
  
  .size-selector { padding: 4px; border-radius: 10px; margin-bottom: 10px; }
  .size-btn { font-size: 11px; padding: 6px 2px; }
  
  .price-num { font-size: 16px; }
  .currency { font-size: 10px; }
  .add-btn { width: 34px; height: 34px; border-radius: 10px; font-size: 16px; }

  /* Telefonda Bottom-Sheet Modal */
  .modal-overlay { 
    align-items: flex-end; 
    padding: 0; 
  }
  
  .modal-container { 
    border-radius: 32px 32px 0 0; 
    position: absolute; 
    bottom: 0; 
    max-width: 100%;
    max-height: 85vh; 
    overflow-y: auto;
  }
  
  .modal-image-wrapper { height: 200px; }
  .swipe-indicator { display: block; }
  
  .modal-details {
    padding: 10px 20px 30px 20px;
    gap: 14px;
  }

  .modal-title { font-size: 20px; }
  .modal-description { font-size: 13px; }
  
  .modal-add-to-cart {
    padding: 14px 20px;
    font-size: 14px;
    flex-grow: 1;
  }

  .modal-footer {
    gap: 16px;
  }
  
  .modal-fade-enter-active .modal-container { animation: mobileBottomSheetIn 0.3s cubic-bezier(0.1, 0.9, 0.2, 1); }
  .modal-fade-leave-active .modal-container { animation: mobileBottomSheetOut 0.2s ease-in forwards; }
}

@keyframes mobileBottomSheetIn {
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
}

@keyframes mobileBottomSheetOut {
  0% { transform: translateY(0); }
  100% { transform: translateY(100%); }
}
</style>