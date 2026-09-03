<template>
  <footer class="footer-wrapper">
    <div class="footer-container">
      <div class="footer-content">
        
        <div class="footer-left">
          <div class="brand-section">
            <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
            <div class="brand-text">
              <h2>{{ brand.name }}</h2>
              <span>{{ brand.subtitle }}</span>
            </div>
          </div>
          <p class="brand-description">{{ brand.description }}</p>
        </div>

        <div class="footer-links">
          <h4>Навигация</h4>
          <ul>
            <li v-for="(link, index) in navLinks" :key="index">
              <a :href="link.url">{{ link.text }}</a>
            </li>
          </ul>
        </div>

        <div class="footer-social-wrapper">
          <h4>Мы в соцсетях</h4>
          <div class="footer-social">
            <a 
              v-for="(social, index) in socialLinks" 
              :key="index" 
              :href="social.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-icon"
              :title="social.name"
            >
              <span v-html="social.icon"></span>
            </a>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} {{ copyrightText }}. Все права защищены. — {{ brand.subtitle }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const brand = ref({
  logo: ' /images/photo_2026-08-31_23-15-56.jpg',
  name: 'Coffich',
  subtitle: 'Вкус, который вы искали',
  description: 'Уютная атмосфера, свежеобжаренный кофе премиум-класса и неповторимые десерты. Открывайте новые грани вкуса вместе с нами.'
})

const currentYear = 2026
const copyrightText = 'Coffich'

const navLinks = ref([
  { text: 'Главная', url: '#' },
  { text: 'О нас', url: '#' },
  { text: 'Меню', url: '#' },
  { text: 'Филиалы', url: '#' }
])

const socialLinks = ref([
  {
    name: 'Telegram',
    url: 'https://web.telegram.org/a/#8936625886',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`
  },
  {
    name: 'YouTube',
    url: '#',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"></polygon></svg>`
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/coffichbukhara/',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`
  }
])
</script>

<style scoped>
.footer-wrapper {
  width: 100%;
  padding: 30px 20px;
  box-sizing: border-box;
}

.footer-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background: linear-gradient(145deg, #153328 0%, #0D231A 100%);
  color: #F8F6F1;
  padding: 56px 6% 28px 6%;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  border-radius: 28px;
  box-shadow: 0 20px 40px rgba(13, 35, 26, 0.4);
  border: 1px solid rgba(193, 154, 108, 0.2);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.footer-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 80% 20%, rgba(193, 154, 108, 0.08) 0%, transparent 40%);
  pointer-events: none;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  align-items: start;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(248, 246, 241, 0.1);
  position: relative;
  z-index: 1;
}

.footer-left {
  max-width: 420px;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.brand-logo {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #C19A6C;
  box-shadow: 0 4px 12px rgba(193, 154, 108, 0.25);
}

.brand-text h2 {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin: 0;
  color: #F8F6F1;
  line-height: 1.1;
}

.brand-text span {
  font-size: 13px;
  color: #C19A6C;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.brand-description {
  font-size: 14px;
  color: #A3B8B0;
  line-height: 1.65;
  margin: 0;
  font-weight: 400;
}

.footer-links h4,
.footer-social-wrapper h4 {
  font-size: 14px;
  font-weight: 700;
  color: #C19A6C;
  margin: 0 0 18px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: #E2D9CC;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: #C19A6C;
  transform: translateX(4px);
}

.footer-social {
  display: flex;
  gap: 14px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: rgba(248, 246, 241, 0.05);
  border: 1px solid rgba(193, 154, 108, 0.3);
  border-radius: 14px;
  color: #F8F6F1;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  text-decoration: none;
}

.social-icon:hover {
  background-color: #C19A6C;
  border-color: #C19A6C;
  color: #1D4032;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(193, 154, 108, 0.35);
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
  font-size: 13px;
  color: #7A8B82;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

@media (max-width: 900px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-container {
    padding: 40px 6% 24px 6%;
    border-radius: 20px;
  }
}
</style>