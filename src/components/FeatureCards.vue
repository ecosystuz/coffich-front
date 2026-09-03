<template>
  <section class="ultra-family-section">
    <div class="header-container">
      <div class="live-pill">
        <span class="pulsing-dot"></span>
        Coffich Experience
      </div>

      <h2 class="section-title">
        Присоединяйтесь к нашей <span class="highlight-text">семье</span>
      </h2>
      <p class="section-subtitle">
        Нажмите на карточку, чтобы узнать подробнее.
      </p>

      <div class="filter-tabs">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.value"
          :class="['tab-btn', { active: currentFilter === tab.value }]"
          @click="currentFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="cards-grid">
      <div 
        v-for="(card, index) in filteredCards" 
        :key="card.id"
        :class="['ultra-card', card.type, { 'is-featured': card.isFeatured }]"
        @mousemove="handleMouseMove($event, index)"
        @mouseleave="handleMouseLeave(index)"
        @click="openModal(card)"
        :style="cardStyles[index]"
      >
        <div class="spotlight-overlay" :style="spotlightStyles[index]"></div>

        <div class="card-top">
          <div class="icon-badge">
            <span>{{ card.icon }}</span>
          </div>
          <span class="category-tag">{{ card.category }}</span>
        </div>

        <div class="card-middle">
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.description }}</p>
        </div>

        <div class="card-bottom">
          <span class="action-text">Подробнее</span>
          <div class="arrow-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="selectedCard" class="modal-backdrop" @click.self="closeModal">
          <div class="modal-container">
            <button class="modal-close-btn" @click="closeModal">✕</button>

            <div class="modal-header">
              <div class="modal-icon">{{ selectedCard.icon }}</div>
              <div>
                <span class="modal-tag">{{ selectedCard.category }}</span>
                <h2 class="modal-title">{{ selectedCard.title }}</h2>
              </div>
            </div>

            <div class="modal-body">
              <p class="modal-full-text">{{ selectedCard.fullDetails.overview }}</p>

              <div class="modal-features">
                <h4 class="features-title">Почему именно мы?</h4>
                <ul>
                  <li v-for="(feature, fIndex) in selectedCard.fullDetails.features" :key="fIndex">
                    <span class="check-icon">✓</span> {{ feature }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="modal-footer">
              <button class="modal-action-btn" @click="closeModal">Понятно</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentFilter = ref('all')
const selectedCard = ref(null)

const filterTabs = [
  { label: 'Все', value: 'all' },
  { label: 'Услуги', value: 'service' },
  { label: 'Атмосфера', value: 'atmosphere' },
  { label: 'Семья', value: 'family' }
]

const cards = ref([
  {
    id: 1,
    title: 'Мастерство Бариста',
    description: 'Идеальная экстракция и изысканность отборных кофейных зерен в каждой чашке.',
    icon: '☕',
    category: 'Услуга',
    type: 'dark',
    filterType: 'service',
    isFeatured: false,
    fullDetails: {
      overview: 'Наши бариста не просто готовят кофе — они вкладывают внимание и искусство в каждую чашку. Каждый день мы создаем идеальный вкус из свежеобжаренных зерен при точной температуре заваривания.',
      features: [
        'Бариста с сертификацией SCA (Specialty Coffee Association)',
        '100% премиальная арабика',
        'Авторский эспрессо и напитки с латте-артом'
      ]
    }
  },
  {
    id: 2,
    title: 'Искреннее и Теплое Общение',
    description: 'Для нас ценен каждый гость. Вежливость и теплая улыбка — наши постоянные спутники.',
    icon: '✨',
    category: 'Атмосфера',
    type: 'light',
    filterType: 'atmosphere',
    isFeatured: false,
    fullDetails: {
      overview: 'С того момента, как вы переступаете наш порог, вы чувствуете атмосферу гостеприимства и искренности. Каждый клиент для нас — не просто посетитель, а ценный член семьи Coffich.',
      features: [
        'Всегда вежливый и готовый помочь персонал',
        'Индивидуальный подход и запоминание ваших любимых рецептов',
        'Позитивная и теплая энергетика'
      ]
    }
  },
  {
    id: 3,
    title: 'Эксклюзивный Вкус',
    description: 'Авторские кофейные напитки и свежевыпеченные французские круассаны.',
    icon: '🥐',
    category: 'Вкус',
    type: 'dark',
    filterType: 'service',
    isFeatured: false,
    fullDetails: {
      overview: 'Мы предлагаем десерты и выпечку, идеально сочетающиеся с вашим кофе. Каждое утро свежая выпечка подчеркивает и обогащает вкус кофе.',
      features: [
        'Свежие круассаны, выпекаемые каждое утро',
        'Авторские десерты без глютена и сахара',
        'Сезонное специальное кофейное меню'
      ]
    }
  },
  {
    id: 4,
    title: 'Уютное и Комфортное Пространство',
    description: 'Уютная зона для комфортной работы, встреч или отдыха.',
    icon: '📍',
    category: 'Комфорт',
    type: 'light',
    filterType: 'atmosphere',
    isFeatured: false,
    fullDetails: {
      overview: 'Наше заведение оборудовано специальными зонами для повышения продуктивности работы или приятного общения с друзьями.',
      features: [
        'Высокоскоростной бесплатный Wi-Fi и розетки у каждого стола',
        'Уютная мягкая мебель и спокойная атмосфера',
        'Приятная фоновая музыка'
      ]
    }
  },
  {
    id: 5,
    title: 'Дружная Команда — Наша Семья',
    description: 'Мы не просто работаем вместе. Мы большая семья, объединенная общей идеей и любовью!',
    icon: '💚',
    category: 'Семья',
    type: 'featured',
    filterType: 'family',
    isFeatured: true,
    fullDetails: {
      overview: 'Команда Coffich — это дружная семья, объединенная одной целью, поддерживающая друг друга и вкладывающая любовь в каждую чашку кофе.',
      features: [
        'Постоянное развитие и внутренние тренинги',
        'Дружелюбная и искренняя рабочая атмосфера',
        'Стремление дарить гостям премиальное качество'
      ]
    }
  }
])

const filteredCards = computed(() => {
  if (currentFilter.value === 'all') return cards.value
  return cards.value.filter(c => c.filterType === currentFilter.value)
})

const openModal = (card) => {
  selectedCard.value = card
}

const closeModal = () => {
  selectedCard.value = null
}

// Логика 3D Tilt и Spotlight
const cardStyles = ref({})
const spotlightStyles = ref({})

const handleMouseMove = (e, index) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = ((y - centerY) / centerY) * -6
  const rotateY = ((x - centerX) / centerX) * 6

  cardStyles.value[index] = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  spotlightStyles.value[index] = {
    background: `radial-gradient(circle 180px at ${x}px ${y}px, rgba(255, 255, 255, 0.15), transparent 80%)`
  }
}

const handleMouseLeave = (index) => {
  cardStyles.value[index] = {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }
  spotlightStyles.value[index] = {
    background: 'none'
  }
}
</script>

<style scoped>
/* Основной контейнер */
.ultra-family-section {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 50px 20px;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  background: transparent;
}

/* Стили заголовка и фильтров */
.header-container { text-align: center; max-width: 680px; margin: 0 auto 48px auto; }
.live-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 99px; background: rgba(15, 41, 30, 0.06); border: 1px solid rgba(15, 41, 30, 0.12); font-size: 0.8rem; font-weight: 700; color: #0f291e; margin-bottom: 16px; }
.pulsing-dot { width: 8px; height: 8px; background-color: #2d6a4f; border-radius: 50%; box-shadow: 0 0 10px #2d6a4f; }
.section-title { font-size: 3rem; font-weight: 800; color: #0f291e; margin: 0 0 12px 0; }
.highlight-text { color: #2d6a4f; }
.section-subtitle { font-size: 1.05rem; color: #52796f; margin: 0 0 28px 0; }
.filter-tabs { display: inline-flex; gap: 8px; background: rgba(15, 41, 30, 0.05); padding: 6px; border-radius: 99px; }
.tab-btn { border: none; background: transparent; padding: 8px 20px; border-radius: 99px; font-size: 0.9rem; font-weight: 600; color: #52796f; cursor: pointer; transition: all 0.3s ease; }
.tab-btn.active { background: #0f291e; color: #ffffff; }

/* Сетка и карточки */
.cards-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }
.ultra-card { grid-column: span 4; position: relative; border-radius: 28px; padding: 32px 28px; display: flex; flex-direction: column; justify-content: space-between; min-height: 280px; box-sizing: border-box; cursor: pointer; transition: transform 0.15s ease-out, box-shadow 0.3s ease; overflow: hidden; }
.ultra-card.is-featured { grid-column: span 8; }
.ultra-card.dark { background: #0f291e; color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 14px 30px rgba(15, 41, 30, 0.15); }
.ultra-card.light { background: #ffffff; color: #0f291e; border: 1px solid rgba(15, 41, 30, 0.12); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06); }
.ultra-card.featured { background: linear-gradient(135deg, #1b4332 0%, #0f291e 100%); color: #ffffff; border: 2px solid #52b788; }
.spotlight-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.card-top, .card-middle, .card-bottom { position: relative; z-index: 2; }
.card-top { display: flex; justify-content: space-between; align-items: center; }
.icon-badge { width: 44px; height: 44px; border-radius: 14px; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
.ultra-card.light .icon-badge { background: rgba(15, 41, 30, 0.06); }
.category-tag { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; opacity: 0.7; }
.card-title { font-size: 1.45rem; font-weight: 800; margin: 16px 0 8px 0; }
.card-desc { font-size: 0.95rem; line-height: 1.5; opacity: 0.8; margin: 0; }
.card-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.ultra-card.light .card-bottom { border-top: 1px solid rgba(15, 41, 30, 0.08); }
.action-text { font-size: 0.85rem; font-weight: 700; }
.arrow-circle { width: 32px; height: 32px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
.arrow-circle svg { width: 16px; height: 16px; }
.ultra-card.light .arrow-circle { background: rgba(15, 41, 30, 0.08); }
.ultra-card:hover .arrow-circle { transform: translateX(4px); background: #2d6a4f; color: #ffffff; }

/* Стили модального окна */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 41, 30, 0.6);
  backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-container {
  background: #ffffff;
  color: #0f291e;
  width: 100%;
  max-width: 540px;
  border-radius: 28px;
  padding: 36px;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  background: rgba(15, 41, 30, 0.06);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.1rem;
  color: #0f291e;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-close-btn:hover { background: rgba(15, 41, 30, 0.12); }

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: #0f291e;
  color: #ffffff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.modal-tag {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #2d6a4f;
}

.modal-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 4px 0 0 0;
}

.modal-full-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 24px;
}

.features-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.modal-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #2d3748;
  margin-bottom: 10px;
}

.check-icon {
  color: #2d6a4f;
  font-weight: 800;
}

.modal-footer {
  margin-top: 32px;
}

.modal-action-btn {
  width: 100%;
  padding: 14px;
  border-radius: 99px;
  background: #0f291e;
  color: #ffffff;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-action-btn:hover { background: #1b4332; }

/* Анимационные переходы */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Адаптивность */
@media (max-width: 992px) { .ultra-card, .ultra-card.is-featured { grid-column: span 6; } }
@media (max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .ultra-card, .ultra-card.is-featured { grid-column: span 1; } }
</style>