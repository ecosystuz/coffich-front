<template>
  <div class="coffich-wrapper">
    <div class="coffich-container">

      <div class="banner-box">
        <div class="banner-content">
          <span class="mini-badge">
            <span class="pulse-dot"></span> Специальное предложение
          </span>
          <h1 class="banner-title">Атмосфера</h1>
          <p class="banner-desc">
            Просыпайтесь с ароматом настоящего кофе. Начните свой день с идеального вкуса.
          </p>
          <router-link to="/meny" class="link-reset">
            <button class="coffich-btn">
              Меню <span class="arrow">➔</span>
            </button>
          </router-link>
        </div>

        <div class="banner-visual">
          <div class="cup-glass-box">
            <img :src="cupImage" alt="Coffich Cup" class="banner-cup floating-anim" />
          </div>
          <div class="custom-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <div class="bento-grid">
        
        <div class="bento-item text-item">
          <div class="gold-badge">Премиум Арабика</div>
          <h3 class="bento-heading">Особенный <span class="gold-text">Вкус</span></h3>
          <p class="bento-sub">Отвлекитесь от городской суеты и отдохните в уютной атмосфере.</p>
        </div>

        <div class="bento-item image-item">
          <div class="steam-container">
            <div class="steam s1"></div>
            <div class="steam s2"></div>
          </div>
          <img :src="cupImage" alt="Coffich Bento" class="grid-cup floating-anim-rev" />
        </div>

        <div class="bento-item stat-item">
          <div class="stat-number">8<span class="accent-dot">+</span></div>
          <div class="stat-label">Уютных филиалов</div>
          <router-link to="/location" class="stat-link">Открыть карту ➔</router-link>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import cupImage from '/images/coffe.png';
</script>

<style scoped>
/* Основной фон страницы и центрирование */
.coffich-wrapper {
  width: 100%;
  background-color: #F8F6F1;
  display: flex;
  justify-content: center;
  padding: 24px 20px;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* ЕДИНЫЙ РОДИТЕЛЬСКИЙ КОНТЕЙНЕР */
.coffich-container {
  width: 100%;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

/* --- 1. ВЕРХНИЙ БАННЕР --- */
.banner-box {
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  padding: 30px 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(29, 64, 50, 0.03);
  box-sizing: border-box;
}

.banner-content {
  max-width: 520px;
}

.mini-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fdfaf5;
  border: 1px solid #e2d3c1;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #C19A6C;
  margin-bottom: 10px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: #C19A6C;
  border-radius: 50%;
  animation: pulseAnim 1.5s infinite;
}

@keyframes pulseAnim {
  0% { box-shadow: 0 0 0 0 rgba(193,154,108,0.6); }
  70% { box-shadow: 0 0 0 6px rgba(193,154,108,0); }
  100% { box-shadow: 0 0 0 0 rgba(193,154,108,0); }
}

.banner-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #1D4032;
  margin: 0 0 8px 0;
  line-height: 1.1;
}

.banner-desc {  
  font-size: 0.95rem;
  color: #556B61;
  margin-bottom: 18px;
  line-height: 1.5;
}

.link-reset { text-decoration: none; }

.coffich-btn {
  background-color: #1D4032;
  color: #fff;
  border: none;
  padding: 11px 24px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.coffich-btn:hover {
  background-color: #C19A6C;
  transform: translateY(-2px);
}

.banner-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cup-glass-box {
  background: #ffffff;
  padding: 10px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.04);
  border: 1px solid #f2efeb;
}

.banner-cup {
  width: 170px;
  height: auto;
  object-fit: contain;
}

.custom-dots {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #d8cebe;
  border-radius: 50%;
}

.dot.active {
  width: 20px;
  border-radius: 4px;
  background: #1D4032;
}

/* --- 2. НИЖНИЙ BENTO GRID --- */
.bento-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr;
  grid-template-rows: 195px;
  gap: 16px;
  box-sizing: border-box;
}

.bento-item {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background: #ffffff;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(29, 64, 50, 0.03);
  box-sizing: border-box;
}

/* Текстовый блок */
.gold-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #C19A6C;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.bento-heading {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1D4032;
  margin: 0 0 6px 0;
}

.gold-text { color: #C19A6C; }

.bento-sub {
  font-size: 0.88rem;
  color: #556B61;
  margin: 0;
  line-height: 1.4;
}

/* Блок с изображением */
.image-item {
  background: radial-gradient(circle at center, #244d3c, #1D4032);
  align-items: center;
  justify-content: center;
  padding: 0;
}

.grid-cup {
  width: 125%;
  height: 125%;
  object-fit: contain;
  transform: rotate(-10deg);
}

/* Блок статистики */
.stat-item {
  background: #C19A6C;
  color: #fff;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}

.accent-dot { color: #1D4032; }

.stat-label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.stat-link {
  color: #1D4032;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.85rem;
  transition: transform 0.2s ease;
  display: inline-block;
}
.stat-link:hover { transform: translateX(3px); }

/* Анимации */
.floating-anim { animation: floatEffect 5s ease-in-out infinite; }
.floating-anim-rev { animation: floatEffectRev 6s ease-in-out infinite; }

@keyframes floatEffect {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(1deg); }
}
@keyframes floatEffectRev {
  0%, 100% { transform: translateY(0) rotate(-10deg); }
  50% { transform: translateY(-5px) rotate(-8deg); }
}

/* Эффект пара */
.steam-container {
  position: absolute;
  top: 15%;
  left: 45%;
  width: 40px;
  height: 50px;
  z-index: 2;
}
.steam {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0;
  animation: steamRise 3s infinite ease-in;
}
.s1 { width: 12px; height: 12px; left: 5px; animation-delay: 0s; }
.s2 { width: 8px; height: 8px; left: 18px; animation-delay: 1.2s; }

@keyframes steamRise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  50% { opacity: 0.3; }
  100% { transform: translateY(-35px) scale(2); opacity: 0; }
}

/* Адаптивность */
@media (max-width: 1024px) {
  .banner-box {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 25px 20px;
  }
  .banner-content { max-width: 100%; }
  .bento-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
  .text-item { grid-column: 1 / 3; }
}

@media (max-width: 600px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .text-item { grid-column: 1 / 2; }
  .banner-title { font-size: 2.2rem; }
}
</style>