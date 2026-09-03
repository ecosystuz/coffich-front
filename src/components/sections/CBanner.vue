<template>
  <div class="banner-container" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
    <div class="floating-elements">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="banner-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <div v-for="(slide, index) in slides" :key="index" class="slide" :class="{ active: currentSlide === index }">
        <div class="slide-content">
          
          <div class="text-group">
            <span class="brand-tag animate-item tag-delay">{{ slide.tag }}</span>
            <h1 class="main-title animate-item title-delay">
              {{ slide.titleStart }} <br/> <span class="highlight">{{ slide.titleEnd }}</span>
            </h1>
            <p class="description animate-item desc-delay">{{ slide.description }}</p>
            
            <div class="btn-container animate-item btn-delay">
              <router-link to="/Meny" class="no-underline">
                <button class="cta-button ">
                  {{ slide.buttonText }}
                  <span class="btn-icon">➔</span>
                </button>
              </router-link>
            </div>
          </div>

          <div class="image-group">
            <div class="main-image-frame animate-image" :style="{ backgroundColor: slide.bgColor }">
              <img :src="slide.mainImageUrl" :alt="slide.titleStart" class="breathing-image" />
            </div>
            <div class="secondary-image-frame animate-image-secondary">
              <img :src="slide.secondaryImageUrl" alt="Детали Coffich" />
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <div class="indicators">
      <span 
        v-for="(slide, index) in slides" 
        :key="'dot-'+index" 
        class="dot" 
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const slides = ref([
  {
    tag: 'НОВЫЙ ДЕНЬ',
    titleStart: 'Утренний',
    titleEnd: 'Заряд',
    description: 'Просыпайтесь с ароматом настоящего кофе. Начните свой день с идеального вкуса.',
    buttonText: 'Меню',
    bgColor: '#1D4032',
    mainImageUrl: '/images/Без названия (1).png', 
    secondaryImageUrl: '/images/coffe.png'
  },
  {
    tag: 'УЮТ',
    titleStart: 'Уютная',
    titleEnd: 'Атмосфера',
    description: 'Отдохните от городской суеты и насладитесь приятной атмосферой.',
    buttonText: 'Посмотреть меню',
    bgColor: '#C19A6C',
    mainImageUrl: '/images/Без названия (1).png',
    secondaryImageUrl: '/images/coffe.png'
  },
  {
    tag: 'ОСОБЕННОЕ',
    titleStart: 'Сладкие',
    titleEnd: 'Мгновения',
    description: 'Премиальные десерты к вашему кофе, тающие во рту. Каждый кусочек — произведение искусства.',
    buttonText: 'Десерты',
    bgColor: '#8B5A2B',
    mainImageUrl: '/images/Без названия (1).png',
    secondaryImageUrl: '/images/coffe.png'
  }
]);

const currentSlide = ref(0);
let autoPlayInterval = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const startAutoPlay = () => {
  autoPlayInterval = setInterval(nextSlide, 55000);
};

const pauseAutoPlay = () => {
  clearInterval(autoPlayInterval);
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  pauseAutoPlay();
});
</script>

<style scoped>
.banner-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  background-color: #F8F6F1;
}

/* Плавающие фоновые элементы (непрерывное движение) */
.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(193, 154, 108, 0.12);
  animation: float 10s infinite ease-in-out alternate;
}

.shape-1 { width: 350px; height: 350px; top: -100px; left: -50px; }
.shape-2 { width: 180px; height: 180px; bottom: 15%; right: 5%; animation-duration: 8s; animation-direction: alternate-reverse; }
.shape-3 { width: 250px; height: 250px; top: 35%; left: 35%; background: rgba(29, 64, 50, 0.04); animation-duration: 12s; }

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  100% { transform: translate(30px, -40px) rotate(15deg) scale(1.05); }
}

.banner-track {
  display: flex;
  height: 100%;
  width: 100%;
  transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1);
  z-index: 2;
  position: relative;
}

.slide {
  flex: 0 0 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-content {
  width: 90%;
  max-width: 1300px;
  height: 80%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

/* Каскадная анимация текста */
.text-group { padding-right: 40px; }

.animate-item {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Поочерёдное появление элементов при активном слайде */
.slide.active .animate-item { opacity: 1; transform: translateY(0); }
.slide.active .tag-delay { transition-delay: 0.3s; }
.slide.active .title-delay { transition-delay: 0.5s; }
.slide.active .desc-delay { transition-delay: 0.7s; }
.slide.active .btn-delay { transition-delay: 0.9s; }

.brand-tag {
  display: inline-block;
  background-color: #C19A6C;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 20px;
  letter-spacing: 2px;
  margin-bottom: 20px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(193, 154, 108, 0.4);
}

.main-title {
  font-size: 5rem;
  font-weight: 800;
  color: #1D4032;
  margin: 0;
  line-height: 1.05;
}

.highlight { color: #C19A6C; }

.description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #556B61;
  margin: 20px 0 40px;
  max-width: 450px;
}

.cta-button {
  background-color: #1D4032;
  color: #fff;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 16px 36px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 8px 25px rgba(29, 64, 50, 0.25);
  overflow: hidden;
  text-decoration: none;
}
.btn-container router-link,
.btn-container a {
  text-decoration: none !important;
}
.cta-button:hover {
  background-color: #C19A6C;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 35px rgba(193, 154, 108, 0.35);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.cta-button:hover .btn-icon {
  transform: translateX(5px);
}
.image-group {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animate-image {
  opacity: 0;
  transform: scale(0.8) rotate(-10deg);
  transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide.active .animate-image {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  transition-delay: 0.4s;
}

.main-image-frame {
  width: 80%;
  height: 80%;
  border-radius: 40px;
  position: relative;
}

/* Эффект дыхания для основного изображения */
.breathing-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 115%;
  object-fit: contain;
  animation: breathe 6s infinite alternate ease-in-out;
}

@keyframes breathe {
  0% { transform: translate(-50%, -50%) scale(1); }
  100% { transform: translate(-50%, -50%) scale(1.06); }
}

.animate-image-secondary {
  opacity: 0;
  transform: translateY(50px) rotate(5deg);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide.active .animate-image-secondary {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
  transition-delay: 0.8s;
}

.secondary-image-frame {
  width: 40%;
  height: 40%;
  position: absolute;
  bottom: 8%;
  left: -5%;
  border-radius: 24px;
  background-color: #fff;
  border: 6px solid #F8F6F1;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  overflow: hidden;
}

.secondary-image-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Индикаторы-точки (внизу слайдера) */
.indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 10;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: rgba(29, 64, 50, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
}

.dot.active {
  width: 40px;
  border-radius: 10px;
  background-color: #1D4032;
}

@media (max-width: 1024px) {
  .main-title { font-size: 3.5rem; }
}

@media (max-width: 768px) {
  .slide-content { grid-template-columns: 1fr; grid-template-rows: auto 1fr; text-align: center; gap: 20px; }
  .text-group { padding: 0 20px; }
  .main-title { font-size: 3rem; }
  .description { margin: 15px auto 30px; max-width: 100%; }
  .btn-container { display: flex; justify-content: center; }
  .secondary-image-frame { display: none; }
}
</style>