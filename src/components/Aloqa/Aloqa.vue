<template>
  <div class="coffich-branches-page">
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>

    <div class="branches-container">
      
      <header class="page-header">
        <span class="badge">☕ НАШИ АДРЕСА И КОНТАКТЫ</span>
        <h1>Филиалы Coffich и Связь</h1>
        <p>Адреса всех наших кофеен в Бухаре, график работы и прямые телефоны для заказов.</p>
      </header>

      <div class="glass-card main-hotline-card">
        <div class="hotline-left">
          <div class="hotline-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div class="hotline-info">
            <span class="sub-label">Единый Колл-Центр / Горячая Линия</span>
            <a href="tel:+998978620010" class="hotline-number">+998 97 862 00 10</a>
          </div>
        </div>

        <div class="hotline-right">
          <div class="status-badge">
            <span class="pulse-dot"></span>
            <span>Открыто (08:00 - 02:00)</span>
          </div>
        </div>
      </div>

      <div class="branches-grid">
        <div v-for="branch in branches" :key="branch.id" class="glass-card branch-card">
          <div class="branch-top">
            <span class="branch-index">#0{{ branch.id }}</span>
            <span class="branch-tag">Действующий филиал</span>
          </div>
          
          <div class="branch-main">
            <h3 class="branch-name">{{ branch.name }}</h3>
            <p class="branch-address">
              <span class="pin-icon">📍</span> {{ branch.address }}
            </p>
          </div>
          
          <div class="branch-footer">
            <div class="time-box">
              <span class="t-icon">🕒</span>
              <span>{{ branch.time }}</span>
            </div>
            <a :href="'tel:' + branch.phone.replace(/\s+/g, '')" class="branch-phone-btn">
              <span>Позвонить</span>
              <span class="phone-num">{{ branch.phone }}</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const branches = ref([
  {
    id: 1,
    name: 'Филиал «Школа Навои»',
    address: 'Напротив школы №4, г. Бухара',
    time: 'Круглосуточно (24/7)',
    phone: '+998 97 862 00 10'
  },
  {
    id: 2,
    name: 'Филиал «Ана Джон»',
    address: 'Улица М. Икбола, г. Бухара',
    time: 'Ежедневно: 08:00 - 02:00',
    phone: '+998 97 861 00 10'
  },
  {
    id: 3,
    name: 'Филиал «Media Park»',
    address: 'Комплекс Media Park, 1-й этаж, г. Бухара',
    time: 'Круглосуточно (24/7)',
    phone: '+998 97 865 00 10'
  },
  {
    id: 4,
    name: 'Филиал «Горбольница»',
    address: 'Напротив Городской больницы, г. Бухара',
    time: 'Ежедневно: 08:00 - 02:00',
    phone: '+998 97 869 00 10'
  },
  {
    id: 5,
    name: 'Филиал «Вокзал»',
    address: 'Привокзальная площадь, г. Бухара',
    time: 'Круглосуточно (24/7)',
    phone: '+998 91 244 17 01'
  },
  {
    id: 6,
    name: 'Филиал «Zarmed»',
    address: 'Ориентир: Клиника Zarmed, г. Бухара',
    time: 'Ежедневно: 08:00 - 23:00',
    phone: '+998 97 864 00 10'
  },
  {
    id: 7,
    name: 'Филиал «Самаркандский»',
    address: 'Улица Самаркандская, г. Бухара',
    time: 'Ежедневно: 08:00 - 02:00',
    phone: '+998 93 656 66 99'
  },
  {
    id: 8,
    name: 'Филиал «5-й микрорайон»',
    address: '5-й микрорайон, г. Бухара',
    time: 'Ежедневно: 08:00 - 02:00',
    phone: '+998 93 132 30 69'
  }
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Oswald:wght@600&display=swap');

.coffich-branches-page {
  min-height: 100vh;
  background-color: #0A2218;
  color: #F8F6F1;
  padding: 80px 24px;
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border-radius: 40px;
  margin-top: 100px;
}

/* Фоновое свечение */
.glow-orb {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(180px);
  pointer-events: none;
  z-index: 0;
}
.orb-1 { top: -15%; left: -10%; background: rgba(193, 154, 108, 0.15); }
.orb-2 { bottom: -15%; right: -10%; background: rgba(34, 197, 94, 0.12); }

.branches-container {
  max-width: 1140px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* Шапка */
.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.badge {
  background: rgba(193, 154, 108, 0.12);
  border: 1px solid rgba(193, 154, 108, 0.3);
  color: #C19A6C;
  padding: 7px 18px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  display: inline-block;
  margin-bottom: 18px;
}

.page-header h1 {
  font-family: 'Oswald', sans-serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 600;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #F8F6F1;
}

.page-header p {
  color: #A3B8B0;
  font-size: 1.05rem;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Glassmorphism стили */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(193, 154, 108, 0.18);
  border-radius: 24px;
  backdrop-filter: blur(24px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.glass-card:hover {
  border-color: rgba(193, 154, 108, 0.45);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.45);
}

/* Колл-центр */
.main-hotline-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 36px;
  margin-bottom: 48px;
  background: linear-gradient(135deg, rgba(193, 154, 108, 0.1) 0%, rgba(10, 34, 24, 0.6) 100%);
  border: 1px solid rgba(193, 154, 108, 0.35);
}

.hotline-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hotline-icon {
  width: 58px;
  height: 58px;
  background: rgba(193, 154, 108, 0.15);
  border: 1px solid rgba(193, 154, 108, 0.4);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C19A6C;
}

.hotline-icon svg {
  width: 26px;
  height: 26px;
}

.sub-label {
  font-size: 0.72rem;
  color: #A3B8B0;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
}

.hotline-number {
  font-size: 1.65rem;
  font-weight: 800;
  color: #F8F6F1;
  text-decoration: none;
  transition: color 0.25s ease;
  letter-spacing: 0.5px;
}

.hotline-number:hover {
  color: #C19A6C;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 10px 20px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #4ADE80;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #22C55E;
  border-radius: 50%;
  box-shadow: 0 0 12px #22C55E;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* Сетка карточек */
.branches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 24px;
}

.branch-card {
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 250px;
}

.branch-card:hover {
  transform: translateY(-6px);
}

.branch-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.branch-index {
  font-size: 0.8rem;
  font-weight: 800;
  color: #C19A6C;
  letter-spacing: 1px;
}

.branch-tag {
  font-size: 0.68rem;
  background: rgba(248, 246, 241, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  color: #A3B8B0;
  text-transform: uppercase;
}

.branch-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #F8F6F1;
}

.branch-address {
  font-size: 0.88rem;
  color: #D0DED5;
  line-height: 1.5;
  margin-bottom: 24px;
}

.pin-icon {
  margin-right: 4px;
}

.branch-footer {
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

.time-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #A3B8B0;
  font-weight: 600;
}

.branch-phone-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(193, 154, 108, 0.08);
  border: 1px solid rgba(193, 154, 108, 0.25);
  color: #F8F6F1;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.phone-num {
  color: #C19A6C;
  font-weight: 800;
}

.branch-phone-btn:hover {
  background: #C19A6C;
  border-color: #C19A6C;
  color: #0A2218;
}

.branch-phone-btn:hover .phone-num {
  color: #0A2218;
}

/* Адаптируемость */
@media (max-width: 768px) {
  .main-hotline-card {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 24px;
  }

  .hotline-left {
    flex-direction: column;
  }

  .hotline-number {
    font-size: 1.4rem;
  }
}
</style>