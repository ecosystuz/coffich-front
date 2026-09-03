<template>
  <header class="main-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container">
      
      <div class="logo-container">
        <a href="/" class="logo-link">
          <div class="logo-glow"></div>
          <img src="/images/photo_2026-08-31_23-15-56.jpg" alt="COFFICH Logo" class="logo-img" />
          <span class="logo-text">COFFICH</span>
        </a>
      </div>

      <nav class="nav-menu" :class="{ 'is-active': isMobileMenuActive }">
        <ul class="nav-list">
          <li v-for="(item, index) in menuItems" :key="index" class="nav-item">
            <a 
              :href="item.link" 
              class="nav-link" 
              :class="{ 'active': currentPath === item.link }"
              @click="closeMobileMenu"
            >
              <span class="link-text">{{ item.name }}</span>
              <span class="link-glow"></span>
            </a>
          </li>
        </ul>
      </nav>

      <button 
        class="mobile-menu-toggle" 
        :class="{ 'is-active': isMobileMenuActive }"
        @click="toggleMobileMenu" 
        aria-label="Menyuni ochish"
      >
        <span class="bar bar-1"></span>
        <span class="bar bar-2"></span>
        <span class="bar bar-3"></span>
      </button>

    </div>

    <Transition name="fade">
      <div 
        v-if="isMobileMenuActive" 
        class="mobile-backdrop" 
        @click="closeMobileMenu"
      ></div>
    </Transition>
  </header>
</template>

<script>
import Brandesmap from './location/Brandesmap.vue';
import Breakmeny from './Meny/Breakmeny.vue';
import Aloqa from './Aloqa/Aloqa.vue';
import News from './yangiliklar/News.vue';

export default {
  name: 'TheHeader',
  data() {
    return {
      isMobileMenuActive: false,
      isScrolled: false,
      currentPath: window.location.pathname,
      menuItems: [
        { name: 'Главная', link: '/home' },
        { name: 'Меню', link: '/Meny', component: Breakmeny },
        { name: 'Новости', link: '/News', component: News },
        { name: 'Локация', link: '/location', component: Brandesmap },
        { name: 'Контакты', link: '/contact', component: Aloqa },
      ],
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuActive = !this.isMobileMenuActive;
      document.body.style.overflow = this.isMobileMenuActive ? 'hidden' : '';
    },
    closeMobileMenu() {
      this.isMobileMenuActive = false;
      document.body.style.overflow = '';
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 20;
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

/* O'ZGARCHILAR VA RESET */
:root {
  --header-bg: hsl(168, 65%, 22%);
  --header-bg-glass: rgba(13, 99, 78, 0.85);
  --text-color: #ffffff;
  --accent-gold: #f0a500;
  --accent-glow: rgba(240, 165, 0, 0.4);
  --transition-smooth: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--header-bg, hsl(168, 65%, 22%));
  color: #ffffff;
  padding: 1.2rem 0;
  transition: all 0.4s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  animation: slideDownHeader 0.6s ease;
}

@keyframes slideDownHeader {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* SCROLL BO'LGANDAGI SHISHA (GLASS) EFFEKTI */
.main-header.is-scrolled {
  padding: 0.7rem 0;
  background-color: rgba(13, 99, 78, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(240, 165, 0, 0.2);
}

.container {
  max-width: 1200px;
  height: 50px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LOGO ANIMATSIYASI */
.logo-container .logo-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #ffffff;
}

.logo-img {
  height: 48px;
  width: auto;
  object-fit: contain;
  transition: transform 0.4s ease;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
  border-radius: 10px;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  background: linear-gradient(135deg, #ffffff 0%, #f0a500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease;
}

.logo-link:hover .logo-img {
  transform: scale(1.1) rotate(-3deg);
}

/* DESKTOP NAVIGATSIYA */
.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 36px;
  align-items: center;
}

.nav-link {
  position: relative;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.link-text {
  position: relative;
  z-index: 2;
}

/* Hover-dagi harakatlanuvchi nur chizig'i */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #f0a500, #ffc107);
  border-radius: 4px;
  transform: translateX(-50%);
  transition: width 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 0 12px rgba(240, 165, 0, 0.8);
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 80%;
}

.nav-link.active {
  color: #f0a500;
  font-weight: 700;
}

/* MOBIL HAMBURGER TUGMASI (ANIMATSIYALI) */
.mobile-menu-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 1001;
  border-radius: 8px;
  padding: 8px;
  transition: background 0.3s;
}

.mobile-menu-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-toggle .bar {
  display: block;
  width: 24px;
  height: 2px;
  margin: 5px auto;
  background-color: #ffffff;
  border-radius: 2px;
  transition: all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

/* Burger 'X' ga aylanish animatsiyasi */
.mobile-menu-toggle.is-active .bar-1 {
  transform: translateY(7px) rotate(45deg);
  background-color: #f0a500;
}

.mobile-menu-toggle.is-active .bar-2 {
  opacity: 0;
  transform: translateX(-10px);
}

.mobile-menu-toggle.is-active .bar-3 {
  transform: translateY(-7px) rotate(-45deg);
  background-color: #f0a500;
}

/* MOBIL USTRYOSTVALAR UCHUN STIL */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: hsl(168, 65%, 18%);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000;
    border-left: 1px solid rgba(240, 165, 0, 0.2);
  }

  .nav-menu.is-active {
    right: 0;
  }

  .nav-list {
    flex-direction: column;
    gap: 16px;
    width: 100%;
    padding: 0 30px;
    text-align: center;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    display: block;
    padding: 14px 20px;
    font-size: 1.1rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
  }

  .nav-link::after {
    display: none;
  }

  .nav-link:hover, .nav-link.active {
    background: rgba(240, 165, 0, 0.15);
    color: #f0a500;
    transform: translateX(-5px);
  }

  /* Backdrop Blur */
  .mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 999;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
}
</style>