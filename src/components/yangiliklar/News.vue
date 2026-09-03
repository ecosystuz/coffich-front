<template>
  <section class="coffich-container">
    <header class="coffich-header">
      <div class="brand-badge">
        <span class="badge-dot"></span>
        <span>COFFICH PREMIUM</span>
      </div>
      
      <h1 class="main-title">Мир Нового Кофе</h1>
      <p class="sub-title">
        Отборные зёрна, авторские напитки и специальные предложения
      </p>

      <nav class="category-tabs">
        <button 
          v-for="cat in categories" 
          :key="cat"
          class="tab-btn"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </nav>
    </header>

    <main class="news-grid">
      <TransitionGroup name="grid-fade">
        <article 
          v-for="item in filteredNews" 
          :key="item.id" 
          class="news-card"
          @click="openModal(item)"
        >
          <div class="card-image-wrapper">
            <img :src="item.image" :alt="item.title" loading="lazy" />
            <span class="category-pill">{{ item.category }}</span>
          </div>

          <div class="card-body">
            <div class="card-meta">
              <span class="card-date">🗓 {{ item.date }}</span>
              <span class="card-tag" v-if="item.tag">{{ item.tag }}</span>
            </div>
            
            <h2 class="card-title">{{ item.title }}</h2>
            <p class="card-description">{{ item.description }}</p>

            <div class="card-footer">
              <span class="read-more">
                Подробнее
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </span>
            </div>
          </div>
        </article>
      </TransitionGroup>
    </main>

    <Transition name="modal-fade">
      <div v-if="selectedItem" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">
          <button class="modal-close-btn" @click="closeModal">✕</button>
          
          <div class="modal-image">
            <img :src="selectedItem.image" :alt="selectedItem.title" />
          </div>

          <div class="modal-content">
            <span class="modal-category">{{ selectedItem.category }}</span>
            <h3 class="modal-title">{{ selectedItem.title }}</h3>
            <p class="modal-date">🗓 {{ selectedItem.date }}</p>

            <div class="modal-text">
              <p>{{ selectedItem.fullContent }}</p>
            </div>

            <ul class="modal-features" v-if="selectedItem.features">
              <li v-for="(feat, idx) in selectedItem.features" :key="idx">
                ✓ {{ feat }}
              </li>
            </ul>

            <button class="modal-action-btn" @click="closeModal">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('Все')
const selectedItem = ref(null)

const categories = ['Все', 'Новые Вкусы', 'Акции', 'Мероприятия']

const newsList = ref([
  {
    id: 1,
    category: 'Новые Вкусы',
    date: '28 Августа',
    tag: 'Рекомендуем',
    title: 'Matcha Coffee Fusion',
    description: 'Идеальное сочетание зелёного чая матча и насыщенного эспрессо.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    fullContent: 'Уникальный микс классического эспрессо и органической японской матчи. Специальный рецепт для любителей нежного и бодрящего вкуса.',
    features: ['100% Японская матча', 'Легкая молочная пенка', 'Доступен вариант без сахара']
  },
  {
    id: 2,
    category: 'Акции',
    date: 'До 30 Августа',
    tag: 'Акция 1+1',
    title: 'Утренние Часы Эспрессо',
    description: 'Каждый день с 08:00 до 10:00 второй кофе бесплатно.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    fullContent: 'Начните день бодро! В указанные часы при покупке любого кофе на основе эспрессо получите второй абсолютно бесплатно.',
    features: ['На все виды кофе', 'Действует и навынос', 'Каждый день 08:00 - 10:00']
  },
  {
    id: 3,
    category: 'Мероприятия',
    date: '5 Сентября',
    tag: 'Мастер-класс',
    title: 'Секреты Бариста и Латте-Арт',
    description: 'Научитесь готовить идеальный кофе в домашних условиях от профессионального бариста.',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
    fullContent: 'На нашем практическом мастер-классе вы освоите навыки правильного выбора и помола зёрен, а также создания изящных рисунков на молоке (Латте-арт).',
    features: ['Практическое занятие', 'Выдаётся сертификат', 'Количество мест ограничено']
  },
  {
    id: 4,
    category: 'Новые Вкусы',
    date: 'Скоро',
    tag: 'Премьера',
    title: 'Pistachio Cold Brew',
    description: 'Незабываемый дуэт фисташкового крема и кофе холодного заваривания.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    fullContent: 'Освежающая новинка из кофе Cold Brew 12-часовой экстракции и натуральной фисташковой пасты.',
    features: ['Холодное заваривание 12 часов', 'Натуральная фисташковая паста', 'Освежающий напиток со льдом']
  }
])

const filteredNews = computed(() => {
  if (activeCategory.value === 'Все') return newsList.value
  return newsList.value.filter(item => item.category === activeCategory.value)
})

const openModal = (item) => {
  selectedItem.value = item
}

const closeModal = () => {
  selectedItem.value = null
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.coffich-container {
  --bg-dark: #0A1913;
  --bg-card: #122B20;
  --bg-card-hover: #173729;
  --accent-green: #258D5C;
  --accent-light: #4EFEAA;
  --text-white: #FFFFFF;
  --text-muted: #9EBEB0;
  --border-color: rgba(255, 255, 255, 0.1);

  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-white);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 60px 20px 80px 20px;
  box-sizing: border-box;
  margin-top: 100px;
}

.coffich-header {
  text-align: center;
  margin: 0 auto 50px auto;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(37, 141, 92, 0.15);
  border: 1px solid var(--accent-green);
  color: var(--accent-light);
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 20px;
}

.badge-dot {
  width: 7px;
  height: 7px;
  background-color: var(--accent-light);
  border-radius: 50%;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-white);
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.sub-title {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 10px 22px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tab-btn:hover {
  color: var(--text-white);
  border-color: var(--accent-green);
}

.tab-btn.active {
  background: var(--accent-green);
  color: var(--text-white);
  border-color: var(--accent-green);
  box-shadow: 0 4px 20px rgba(37, 141, 92, 0.4);
}

.news-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.news-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}

.news-card:hover {
  transform: translateY(-6px);
  background-color: var(--bg-card-hover);
  border-color: rgba(78, 254, 170, 0.3);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 190px;
  overflow: hidden;
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .card-image-wrapper img {
  transform: scale(1.06);
}

.category-pill {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(10, 25, 19, 0.85);
  backdrop-filter: blur(4px);
  color: var(--accent-light);
  border: 1px solid rgba(78, 254, 170, 0.3);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.card-tag {
  color: var(--accent-light);
  font-weight: 600;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-white);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.card-description {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent-light);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.25s ease;
}

.news-card:hover .arrow-icon {
  transform: translateX(4px);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 12, 9, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-box {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--accent-green);
  border-radius: 24px;
  width: 100%;
  max-width: 550px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  background: rgba(10, 25, 19, 0.7);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-white);
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image {
  height: 220px;
  width: 100%;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-content {
  padding: 24px;
}

.modal-category {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-white);
  margin: 6px 0 4px 0;
}

.modal-date {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.modal-text {
  font-size: 0.92rem;
  color: var(--text-white);
  line-height: 1.6;
  margin-bottom: 20px;
}

.modal-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-features li {
  font-size: 0.85rem;
  color: var(--accent-light);
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-action-btn {
  width: 100%;
  background: var(--accent-green);
  color: var(--text-white);
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-action-btn:hover {
  background: #1E754C;
}

.grid-fade-enter-active, .grid-fade-leave-active {
  transition: all 0.3s ease;
}
.grid-fade-enter-from, .grid-fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>