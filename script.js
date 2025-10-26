const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let skillIcons = [
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg'
];
let skillElements = [];

// Canvas
function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  const count = window.innerWidth > 768 ? 250 : 120;
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random()
    });
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    ctx.globalAlpha = s.opacity;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    s.x -= s.speed;
    if (s.x < 0) s.x = canvas.width;
    s.opacity = Math.sin(Date.now() * 0.001 + s.x) * 0.5 + 0.5;
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateStars);
}

// Orbit Skill
function createSkillOrbit() {
  const orbit = document.querySelector('.skills-orbit');
  orbit.innerHTML = '<div class="orbit-line"></div>';
  skillElements = [];

  skillIcons.forEach((icon, i) => {
    const angle = (i / skillIcons.length) * 2 * Math.PI;
    const radius = window.innerWidth > 768 ? 160 : 110;
    const x = 210 + radius * Math.cos(angle);
    const y = 210 + radius * Math.sin(angle);

    const el = document.createElement('div');
    el.className = 'skill-item';
    
    const img = document.createElement('img');
    img.src = icon;
    img.alt = 'Skill icon';
    img.style.width = '32px';
    img.style.height = '32px';
    
    el.appendChild(img);
    el.style.left = `${x - 30}px`;
    el.style.top = `${y - 30}px`;
    orbit.appendChild(el);
    skillElements.push(el);
  });
}

// === MOBILE: AUTO SLIDER ===
let currentSlide = 0;
let sliderInterval;

function createMobileSlider() {
  const track = document.querySelector('.slider-track');
  const dotsContainer = document.querySelector('.slider-dots');
  if (!track || !dotsContainer) return;

  // Kosongkan
  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  // Tambah skill (duplikat untuk loop halus)
  [...skillIcons, ...skillIcons].forEach((icon, i) => {
    const item = document.createElement('div');
    item.className = 'slider-item';
    
    const img = document.createElement('img');
    img.src = icon;
    img.alt = 'Skill';
    
    item.appendChild(img);
    track.appendChild(item);
  });

  // Tambah dots
  skillIcons.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slider-dot';
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });

  // Reset posisi
  goToSlide(0);
  startAutoSlide();
}

function goToSlide(index) {
  const track = document.querySelector('.slider-track');
  const items = document.querySelectorAll('.slider-item');
  const dots = document.querySelectorAll('.slider-dot');
  const container = document.querySelector('.slider-container');
  
  if (!track || items.length === 0 || !container) return;

  currentSlide = index;
  
  const itemWidth = items[0].offsetWidth + 20; // 10px margin x2
  const containerWidth = container.offsetWidth;
  
  // Hitung offset agar item aktif di TENGAH
  const totalOffset = currentSlide * itemWidth;
  const centerOffset = (containerWidth / 2) - (itemWidth / 2);
  const finalOffset = centerOffset - totalOffset;
  
  track.style.transform = `translateX(${finalOffset}px)`;

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % skillIcons.length;
  goToSlide(currentSlide);
}

function startAutoSlide() {
  stopAutoSlide();
  sliderInterval = setInterval(nextSlide, 2000); // Ganti slide tiap 2 detik
}

function stopAutoSlide() {
  if (sliderInterval) clearInterval(sliderInterval);
}

// Restart saat resize
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    createMobileSlider();
  }
});

// Init
window.addEventListener('load', () => {
  // ... kode sebelumnya ...
  if (window.innerWidth <= 768) {
    createMobileSlider();
  }
});

let rotation = 0;
function animateOrbit() {
  rotation += 0.003;
  const centerX = 210;
  const centerY = 210;
  const radius = window.innerWidth > 768 ? 160 : 110;

  skillElements.forEach((el, i) => {
    const angle = (i / skillIcons.length) * 2 * Math.PI + rotation;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    el.style.left = `${x - 30}px`;
    el.style.top = `${y - 30}px`;
  });
  requestAnimationFrame(animateOrbit);
}

// Nav Aktif
function updateActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  let current = 'hero';
  if (window.scrollY > 100) {
    document.querySelectorAll('section').forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = sec.getAttribute('id');
      }
    });
  }
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Init
window.addEventListener('load', () => {
  initCanvas();
  animateStars();
  createSkillOrbit();
  animateOrbit();
  updateActiveNav();
});

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('resize', () => {
  initCanvas();
  createSkillOrbit();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// FOOTER: Update tahun otomatis
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});