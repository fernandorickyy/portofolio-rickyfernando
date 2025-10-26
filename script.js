// SKILL ICONS – DARI CDN (UPDATE OTOMATIS)
let skillIcons = [
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg'
];

// ORBIT DESKTOP
function createSkillOrbit() {
  const orbit = document.querySelector('.skills-orbit');
  if (!orbit) return;

  orbit.innerHTML = '';

  skillIcons.forEach((icon, index) => {
    const angle = (index / skillIcons.length) * 2 * Math.PI;
    const radius = 150;

    const item = document.createElement('div');
    item.className = 'skill-item';

    const img = document.createElement('img');
    img.src = icon;
    img.alt = 'Skill';
    img.loading = 'lazy';

    img.onerror = () => {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMzMzIj48L3JlY3Q+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjY2NjIj5TZjwvdGV4dD48L3N2Zz4=';
    };

    item.appendChild(img);
    orbit.appendChild(item);

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// MOBILE SLIDER
let currentSlide = 0;
let sliderInterval;

function createMobileSlider() {
  const track = document.querySelector('.slider-track');
  const dotsContainer = document.querySelector('.slider-dots');
  if (!track || !dotsContainer) return;

  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  [...skillIcons, ...skillIcons].forEach((icon, i) => {
    const item = document.createElement('div');
    item.className = 'slider-item';

    const img = document.createElement('img');
    img.src = icon;
    img.alt = 'Skill';
    img.loading = 'lazy';

    img.onerror = () => {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMzMzIj48L3JlY3Q+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjY2NjIj5TZjwvdGV4dD48L3N2Zz4=';
    };

    item.appendChild(img);
    track.appendChild(item);
  });

  skillIcons.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slider-dot';
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });

  currentSlide = 0;
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
  
  const itemWidth = items[0].offsetWidth + 20;
  const containerWidth = container.offsetWidth;
  
  const totalOffset = currentSlide * itemWidth;
  const centerOffset = (containerWidth / 2) - (itemWidth / 2);
  const finalOffset = centerOffset - totalOffset;
  
  track.style.transform = `translateX(${finalOffset}px)`;

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
  sliderInterval = setInterval(nextSlide, 2000);
}

function stopAutoSlide() {
  if (sliderInterval) clearInterval(sliderInterval);
}

// INIT
window.addEventListener('load', () => {
  createSkillOrbit();
  if (window.innerWidth <= 768) {
    createMobileSlider();
  }
  // Footer year
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    createMobileSlider();
  }
});