<template>
  <div class="coffich-wrapper">
    <div class="master-grid">
      
      <!-- 1. HERO KARTA: Asosiy Premium Blok -->
      <div class="bento-box hero-box">
        <div class="hero-ambient"></div>
        
        <div class="hero-content">
          <div class="glass-pill">
            <span class="live-dot"></span>
            <span>Эксклюзивное предложение</span>
          </div>
          
          <h1 class="hero-heading">
            Искусство <br>
            <span class="gold-gradient">Идеального Кофе</span>
          </h1>
          
          <p class="hero-text">
            Погрузитесь в атмосферу уюта и изысканного вкуса. Каждая чашка создана для вашего вдохновения.
          </p>

          <div class="hero-actions">
            <router-link to="/meny" class="link-reset">
              <button class="btn-gold">
                <span>Смотреть меню</span>
                <div class="icon-circle">➔</div>
              </button>
            </router-link>
            
          </div>
        </div>

        <div class="hero-image-area">
          <div class="cup-glow"></div>
          <div class="steam-group">
            <span class="steam-line s1"></span>
            <span class="steam-line s2"></span>
            <span class="steam-line s3"></span>
          </div>
          <img :src="cupImage" alt="Coffich Cup" class="floating-cup" />
        </div>
      </div>

      <!-- 2. SIFAT KARTASI: 100% Arabika -->
      <div class="bento-box quality-box">
        <div class="quality-header">
          <span class="badge-text">Премиум зерна</span>
          <div class="mini-icon">✨</div>
        </div>
        <div class="quality-body">
          <h3 class="box-title">100% Арабика</h3>
          <p class="box-desc">Отборные зерна высшего сорта с лучших плантаций мира.</p>
        </div>
        <div class="card-pattern"></div>
      </div>

      <!-- 3. STATISTIKA KARTASI: Filiallar -->
      <div class="bento-box stats-box">
        <div class="stats-content">
          <div class="huge-number">8<span class="dot-accent">+</span></div>
          <p class="stats-label">Уютных филиалов по всему городу</p>
        </div>
        <router-link to="/location" class="location-link-btn">
          <span>Карта</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
      </div>

      <!-- 4. QO'SHIMCHA BLOK: Tezkor Buyurtma / Atmosfera -->
     
    </div>
  </div>
</template>

<script setup>
import cupImage from '/images/coffe.png';
</script>

<style scoped>
/* ================= ASOSIY KONTEYNER ================= */
.coffich-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #F4F1EB;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

.link-reset { text-decoration: none; }

/* ================= MASTER GRID (BENTO) ================= */
.master-grid {
  width: 100%;
  max-width: 1240px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 24px;
}

/* Umumiy Karta Dizayni */
.bento-box {
  background: #FFFFFF;
  border-radius: 32px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.03);
}

.bento-box:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 60px rgba(29, 64, 50, 0.08);
}

/* ================= 1. HERO KARTA (Asosiy) ================= */
.hero-box {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
  background: linear-gradient(135deg, #173629 0%, #0E2219 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 55px;
  color: #FFFFFF;
  box-shadow: 0 25px 50px rgba(23, 54, 41, 0.2);
}

.hero-ambient {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(193,154,108,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  flex: 1;
  max-width: 440px;
  z-index: 2;
}

/* Glassmorphism Pill */
.glass-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #E5D3BE;
  margin-bottom: 24px;
}

.live-dot {
  width: 7px;
  height: 7px;
  background: #C19A6C;
  border-radius: 50%;
  box-shadow: 0 0 10px #C19A6C;
  animation: pulseGlow 2s infinite;
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 0 0 rgba(193,154,108,0.8); }
  70% { box-shadow: 0 0 0 8px rgba(193,154,108,0); }
  100% { box-shadow: 0 0 0 0 rgba(193,154,108,0); }
}

.hero-heading {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 18px 0;
  letter-spacing: -0.5px;
}

.gold-gradient {
  background: linear-gradient(90deg, #F0E6D8 0%, #C19A6C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-text {
  font-size: 1rem;
  color: #9EB0A6;
  line-height: 1.6;
  margin-bottom: 35px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  align-items: center;
}

/* Premium Gold Tugma */
.btn-gold {
  background: #C19A6C;
  color: #0E2219;
  border: none;
  padding: 14px 26px;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(193, 154, 108, 0.3);
}

.btn-gold:hover {
  background: #d4b087;
  transform: translateY(-2px);
}

.icon-circle {
  width: 28px;
  height: 28px;
  background: #0E2219;
  color: #C19A6C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.btn-gold:hover .icon-circle {
  transform: translateX(4px);
}

/* Shaffof Glass Tugma */
.btn-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 14px 24px;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* Hero Visual & 3D Cup */
.hero-image-area {
  position: relative;
  width: 320px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cup-glow {
  position: absolute;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(193,154,108,0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
}

.floating-cup {
  width: 100%;
  height: auto;
  object-fit: contain;
  position: relative;
  z-index: 3;
  filter: drop-shadow(0 25px 35px rgba(0,0,0,0.4));
  animation: floatEpic 6s ease-in-out infinite;
}

@keyframes floatEpic {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-14px) rotate(2deg); }
}

/* Steam Animatsiyasi */
.steam-group {
  position: absolute;
  top: 10%;
  left: 45%;
  width: 60px;
  height: 90px;
  z-index: 2;
}

.steam-line {
  position: absolute;
  background: #FFFFFF;
  border-radius: 50%;
  filter: blur(12px);
  opacity: 0;
  animation: steamRiseEpic 4s infinite ease-in;
}

.s1 { width: 16px; height: 16px; left: 5px; animation-delay: 0s; }
.s2 { width: 10px; height: 10px; left: 30px; animation-delay: 1.4s; }
.s3 { width: 14px; height: 14px; left: 18px; animation-delay: 2.5s; }

@keyframes steamRiseEpic {
  0% { transform: translateY(15px) scale(0.6); opacity: 0; }
  30% { opacity: 0.35; }
  100% { transform: translateY(-70px) scale(2.2); opacity: 0; }
}

/* ================= 2. QUALITY KARTA ================= */
.quality-box {
  background: #FFFFFF;
  padding: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.quality-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.badge-text {
  font-size: 0.78rem;
  font-weight: 700;
  color: #C19A6C;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mini-icon {
  width: 40px;
  height: 40px;
  background: #F4F1EB;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.box-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #173629;
  margin: 0 0 8px 0;
}

.box-desc {
  font-size: 0.9rem;
  color: #62756B;
  margin: 0;
  line-height: 1.5;
}

/* ================= 3. STATS KARTA (Tilla) ================= */
.stats-box {
  background: linear-gradient(135deg, #C19A6C 0%, #A88358 100%);
  padding: 35px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 20px 40px rgba(193, 154, 108, 0.25);
}

.huge-number {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  margin: 0 0 4px 0;
}

.dot-accent {
  color: #173629;
}

.stats-label {
  font-size: 0.92rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.95;
}

.location-link-btn {
  background: #FFFFFF;
  color: #173629;
  padding: 12px 18px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s ease;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.stats-box:hover .location-link-btn {
  transform: scale(1.05);
}

/* ================= 4. ATMOSFERA KARTA ================= */
.atmos-box {
  background: #173629;
  color: #FFFFFF;
  padding: 30px 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.atmos-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #C19A6C;
  margin: 0 0 6px 0;
}

.atmos-desc {
  font-size: 0.85rem;
  color: #9EB0A6;
  margin: 0;
  max-width: 220px;
  line-height: 1.4;
}

.atmos-badge {
  background: rgba(193, 154, 108, 0.15);
  border: 1px solid rgba(193, 154, 108, 0.3);
  color: #C19A6C;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

/* ================= RESPONSIVE (Mobil va Planshet) ================= */
@media (max-width: 1024px) {
  .master-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .hero-box {
    grid-column: 1 / -1;
    grid-row: auto;
    flex-direction: column;
    text-align: center;
    padding: 45px 25px;
  }
  .hero-content {
    max-width: 100%;
    margin-bottom: 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-actions { justify-content: center; }
  .hero-image-area { width: 240px; }
  .hero-heading { font-size: 2.8rem; }
}

@media (max-width: 600px) {
  .coffich-wrapper { padding: 15px 10px; }
  .hero-heading { font-size: 2.3rem; }
  .bento-box { border-radius: 24px; }
  .atmos-box { flex-direction: column; text-align: center; gap: 15px; }
  .atmos-desc { max-width: 100%; }
}
</style>