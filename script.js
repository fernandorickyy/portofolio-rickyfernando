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

// Mobile: Horizontal Skill Scroll
function createMobileSkills() {
  const container = document.querySelector('.skill-scroll');
  if (!container) return;
  container.innerHTML = '';

  skillIcons.forEach(icon => {
    const item = document.createElement('div');
    item.className = 'skill-item';
    
    const img = document.createElement('img');
    img.src = icon;
    img.alt = 'Skill';
    
    item.appendChild(img);
    container.appendChild(item);
  });
}

// Panggil saat load & resize
window.addEventListener('load', () => {
  // ... kode sebelumnya ...
  createMobileSkills();
});

window.addEventListener('resize', () => {
  // ... kode sebelumnya ...
  createMobileSkills();
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