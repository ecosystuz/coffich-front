<template>
  <section class="coffee-section">
    <div class="section-header">
      <div class="header-title-group">
        <span class="sub-badge">
          <span class="pulse-dot"></span> Меню Coffich
        </span>
        <h2 class="main-title">Новинки кофе</h2>
      </div>

      <router-link to="/Meny" class="catalog-btn">
        <span>Перейти в каталог</span>
        <div class="arrow-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </router-link>
    </div>

    <div class="products-grid">
      <article
        v-for="item in coffeeProducts"
        :key="item.id"
        class="product-card"
        @click="goToMenu"
      >
        <div class="card-image-box">
          <span v-if="item.badge" class="badge-tag">{{ item.badge }}</span>
          <img :src="item.image" :alt="item.title" loading="lazy" />
          <div class="card-action-overlay">
            <router-link to="/Meny" class="view-btn">Просмотреть</router-link>
          </div>
        </div>

        <div class="card-info">
          <h3 class="product-title">{{ item.title }}</h3>
          <p class="product-desc">{{ item.description }}</p>
          <div class="card-footer">
            <div class="product-price">
              {{ formatPrice(item.price) }} <span class="currency">сум</span>
            </div>
              
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const coffeeProducts = ref([
  { 
    id: 'c1', 
    title: 'CAPPUCCINO', 
    description: 'Большая порция кофе с нежной и пышной молочной пенкой', 
    price: 40000, 
    badge: 'Хит', 
    image: '/images/1c.jpg' 
  },
  { 
    id: 'c6', 
    title: 'COFFEE LATTE', 
    description: 'Классический кофе латте стандартного объема', 
    price: 18000, 
    badge: '', 
    image: '/images/2c.jpg' 
  },
  { 
    id: 'c7', 
    title: 'DOUBLE-CAPPUCCINO', 
    description: 'Насыщенный капучино с двойной порцией эспрессо', 
    price: 30000, 
    badge: '', 
    image: '/images/3c.jpg' 
  },
  { 
    id: 'c9', 
    title: 'AMERICANO', 
    description: 'Ароматный классический американо средней крепости', 
    price: 25000, 
    badge: '', 
    image: '/images/4c.jpg' 
  },
  { 
    id: 'c11', 
    title: 'COFFICH', 
    description: 'Фирменный авторский кофе Coffich малого объема', 
    price: 23000, 
    badge: 'Новинка', 
    image: '/images/5c.jpg' 
  },
  { 
    id: 'c13', 
    title: 'COFFEE RAF', 
    description: 'Нежный большой раф, заваренный на натуральных сливках', 
    price: 35000, 
    badge: 'Премиум', 
    image: '/images/6c.jpg' 
  },
  { 
    id: 'c15', 
    title: 'LATTE SPICES', 
    description: 'Большой латте с добавлением согревающих специй', 
    price: 28000, 
    badge: '', 
    image: '/images/7c.jpg' 
  },
  { 
    id: 'c17', 
    title: 'MOCACCINO', 
    description: 'Большой моккачино с глубоким шоколадным вкусом', 
    price: 28000, 
    badge: '', 
    image: '/images/8c.jpg' 
  },
])

const formatPrice = (val) => {
  return val.toLocaleString('ru-RU')
}

const goToMenu = () => {
  router.push('/Meny')
}
</script>

<style scoped>
/* Основной контейнер */
.coffee-section {
  width: 100%;
  max-width: 1280px;
  margin: 60px auto 0 auto;
  padding: 48px 32px;
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  background-color: #F8F6F1;
  box-sizing: border-box;
  border-radius: 40px;
}

/* Секция заголовка */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 36px;
}

.sub-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #C19A6C;
  background: #FFFFFF;
  border: 1px solid rgba(193, 154, 108, 0.3);
  padding: 6px 14px;
  border-radius: 99px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(193, 154, 108, 0.08);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: #C19A6C;
  border-radius: 50%;
  animation: pulseAnim 1.5s infinite;
}

@keyframes pulseAnim {
  0% { box-shadow: 0 0 0 0 rgba(193, 154, 108, 0.6); }
  70% { box-shadow: 0 0 0 6px rgba(193, 154, 108, 0); }
  100% { box-shadow: 0 0 0 0 rgba(193, 154, 108, 0); }
}

.main-title {
  font-size: 2.6rem;
  font-weight: 800;
  color: #1D4032;
  letter-spacing: -0.5px;
  margin: 0;
  line-height: 1.1;
}

/* Кнопка перехода в каталог */
.catalog-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background-color: #1D4032;
  color: #FFFFFF;
  text-decoration: none;
  padding: 12px 26px;
  border-radius: 99px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 10px 24px rgba(29, 64, 50, 0.12);
}

.arrow-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.catalog-btn:hover {
  background-color: #C19A6C;
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(193, 154, 108, 0.28);
}

.catalog-btn:hover .arrow-icon {
  transform: translateX(4px);
}

/* Сетка товаров */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 24px;
}

/* Карточка товара */
.product-card {
  background: #FFFFFF;
  border-radius: 28px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 10px 30px rgba(29, 64, 50, 0.04);
  border: 1px solid rgba(29, 64, 50, 0.05);
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 22px 42px rgba(29, 64, 50, 0.1);
  border-color: rgba(193, 154, 108, 0.4);
}

/* Контейнер для изображения */
.card-image-box {
  position: relative;
  width: 100%;
  height: 220px;
  background: radial-gradient(circle at center, #FDFBF7, #F4F0E6);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 18px;
}

.card-image-box img {
  width: 75%;
  height: 75%;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.product-card:hover .card-image-box img {
  transform: scale(1.1) rotate(-3deg);
}

/* Оверлей при наведении */
.card-action-overlay {
  position: absolute;
  inset: 0;
  background: rgba(29, 64, 50, 0.25);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.view-btn {
  background: #FFFFFF;
  color: #1D4032;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 10px 22px;
  border-radius: 99px;
  text-decoration: none;
  transform: translateY(10px);
  transition: transform 0.3s ease, background 0.2s ease;
  display: inline-block;
}

.view-btn:hover {
  background: #C19A6C;
  color: #FFFFFF;
}

.product-card:hover .card-action-overlay {
  opacity: 1;
}

.product-card:hover .view-btn {
  transform: translateY(0);
}

/* Бейдж */
.badge-tag {
  position: absolute;
  top: 14px;
  left: 14px;
  background-color: #1D4032;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 99px;
  letter-spacing: 0.5px;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* Информация о товаре */
.card-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1D4032;
  margin: 0 0 6px 0;
  line-height: 1.3;
  transition: color 0.2s ease;
}

.product-card:hover .product-title {
  color: #C19A6C;
}

.product-desc {
  font-size: 0.85rem;
  color: #556B61;
  line-height: 1.5;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

/* Футер карточки */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(29, 64, 50, 0.06);
}

.product-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1D4032;
}

.currency {
  font-size: 0.8rem;
  font-weight: 600;
  color: #7A8B82;
}

.quick-add-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: rgba(29, 64, 50, 0.06);
  color: #1D4032;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover .quick-add-btn {
  background-color: #1D4032;
  color: #FFFFFF;
}

/* Адаптивность */
@media (max-width: 992px) {
  .coffee-section {
    padding: 36px 24px;
    border-radius: 32px;
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .main-title {
    font-size: 2.1rem;
  }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .card-image-box {
    height: 170px;
  }
}

@media (max-width: 520px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>