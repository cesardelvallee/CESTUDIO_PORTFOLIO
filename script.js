// Animación GSAP para el texto CONTACT ME y entrada de textos principales
document.addEventListener('DOMContentLoaded', () => {
  // Hacer que al hacer click en CESAR DEL VALLE se vuelva al index
  const topBarLeft = document.querySelector('.top-bar-left');
  if (topBarLeft) {
    topBarLeft.style.cursor = 'pointer';
    topBarLeft.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
  // Unificar lógica del cursor personalizado: follow y hover
  const eggCursor = document.getElementById('egg-cursor');
  let isGrabbing = false;
  let lastClientX = 0, lastClientY = 0;
  document.addEventListener('mousemove', e => {
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    if (eggCursor) {
      eggCursor.style.left = lastClientX + 'px';
      eggCursor.style.top = lastClientY + 'px';
      if (isGrabbing) {
        eggCursor.style.backgroundImage = "url('img/GRAB.svg')";
      } else {
        const selectable = e.target.closest('.img-drag, a, button, input, textarea, .top-bar-left, .hero-btn');
        if (selectable) {
          eggCursor.style.backgroundImage = "url('img/HOVER.svg')";
        } else {
          eggCursor.style.backgroundImage = "url('img/DEFAULT.svg')";
        }
      }
    }
  });
  // Doble click en cada imagen para redirigir a una página distinta (Desktop)
  // Touch/tap en cada imagen para redirigir (Mobile)
  const imgLinks = [
    'img1.html', 
    'img2.html', 
    'img3.html', 
    'img4.html', 
    'img5.html'  
  ];
  
  // Función para detectar si es móvil
  function isMobile() {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
  }
  
  document.querySelectorAll('.img-drag').forEach((img, i) => {
    if (isMobile()) {
      // En móvil: un solo toque para navegar
      let touchStartTime = 0;
      
      img.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
      });
      
      img.addEventListener('touchend', (e) => {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        
        // Si el toque es rápido (menos de 300ms), navegar
        if (touchDuration < 300) {
          e.preventDefault();
          window.location.href = imgLinks[i];
        }
      });
      
      // Prevenir el comportamiento de drag en móvil para estas imágenes
      img.addEventListener('touchmove', (e) => {
        e.preventDefault();
      });
      
    } else {
      // En desktop: doble click como antes
      img.addEventListener('dblclick', () => {
        window.location.href = imgLinks[i];
      });
    }
  });
  // Animación GSAP al pasar el cursor por el botón CONTACT ME y hacerlo clickable
  const btn = document.querySelector('.hero-btn');
  const btnText = document.querySelector('.hero-btn-text');
  const subtitle = document.querySelector('.hero-subtitle');
  if (btn && btnText) {
    btn.addEventListener('mouseenter', () => {
      btnText.classList.remove('animate');
      void btnText.offsetWidth;
      btnText.classList.add('animate');
    });
    btn.addEventListener('mouseleave', () => {
      btnText.classList.remove('animate');
    });
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      window.location.href = 'about.html';
    });
  }

  // Animación hover para 'GRAPHIC DESIGNER' igual que el botón
  if (subtitle) {
    subtitle.addEventListener('mouseenter', () => {
      subtitle.classList.remove('animate');
      void subtitle.offsetWidth;
      subtitle.classList.add('animate');
    });
    subtitle.addEventListener('mouseleave', () => {
      subtitle.classList.remove('animate');
    });
  }
  // Animación de entrada para textos y botón
  function playHeroTitleAnimation() {
    const title = document.querySelector('.hero-title');
    const btn = document.querySelector('.hero-btn');
    const subtitle = document.querySelector('.hero-subtitle');
    // Estado inicial oculto y desenfocado, sin eventos
  gsap.set(title, {opacity: 0, y: 80, scale: 0.98, filter: 'blur(16px)', pointerEvents: 'none'});
  gsap.set(btn, {opacity: 0, y: 60, scale: 0.92, filter: 'blur(10px)'});
  gsap.set(subtitle, {opacity: 0, y: 40, scale: 0.98, filter: 'blur(10px)', visibility: 'hidden'});
    const tl = gsap.timeline();
    tl.to(title, {opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.38, ease: 'expo.out',
      onStart: () => { title.style.pointerEvents = 'none'; },
      onComplete: () => { title.style.pointerEvents = 'auto'; }
    })
      .to(subtitle, {opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', visibility: 'visible', duration: 0.23, ease: 'power3.out',
        onStart: () => { subtitle.style.pointerEvents = 'none'; subtitle.style.visibility = 'visible'; },
        onComplete: () => { subtitle.style.pointerEvents = 'auto'; }
      }, '-=0.13')
      .to(btn, {opacity: 1, y: 0, scale: 1.08, filter: 'blur(0px)', duration: 0.18, ease: 'back.out(2)',
        onStart: () => { btn.style.pointerEvents = 'none'; },
        onComplete:()=>{
          btn.style.pointerEvents = 'auto';
          gsap.to(btn, {scale:1, duration:0.12, ease:'power1.out'});
        }
      }, '-=0.09')
      .add(() => animateStackedImages());
  }

  // Llamar a la animación solo cuando el modelo 3D esté listo
  const modelViewer = document.querySelector('model-viewer');
  if (modelViewer) {
    modelViewer.addEventListener('load', () => {
      playHeroTitleAnimation();
    });
  } else {
    // Si no hay modelo, animar al cargar
    playHeroTitleAnimation();
  }

  // Permitir reiniciar la animación haciendo doble click en el texto PORTFOLIO
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.addEventListener('dblclick', playHeroTitleAnimation);
  }

  // Extraer animación de imágenes apiladas a función
  function animateStackedImages() {
    const stackedImgs = document.querySelectorAll('.stacked-images .img-drag');
    // Quitar el forzado de oculto por CSS y el !important para permitir animación
    stackedImgs.forEach(img => {
      img.style.setProperty('opacity', '0', '');
      img.style.setProperty('transform', (img.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(0)').trim(), '');
    });
    // Animación de entrada
    stackedImgs.forEach((img, i) => {
      setTimeout(() => {
        gsap.to(img, {
          scale: 1.06,
          opacity: 1,
          duration: 0.22,
          ease: 'back.out(1.3)',
          overwrite: true,
          onComplete: () => {
            gsap.to(img, { scale: 1, duration: 0.08, ease: 'power1.out' });
          }
        });
      }, 180 + i * 180);
    });
  }


  // --- RESTO DEL CÓDIGO ORIGINAL ---



  // Ocultar el cursor nativo
  document.body.style.cursor = 'none';

  // Cursor personalizado tipo follow con SVGs
  // (eliminado: ya está declarado arriba)
  // Siempre seguir el ratón
  // (eliminado: duplicado)

  // Escuchar eventos globales de mouseup para soltar el estado de agarre aunque el mouse salga de la imagen
  document.addEventListener('mouseup', () => {
    isGrabbing = false;
  });

  // Integrar con GSAP Draggable para saber cuándo realmente se está arrastrando
  window._setGrabbingCursor = function(state) {
    isGrabbing = state;
    if (state) {
      eggCursor.style.backgroundImage = "url('img/GRAB.svg')";
      // Forzar posición del cursor al último mousemove
      eggCursor.style.left = lastClientX + 'px';
      eggCursor.style.top = lastClientY + 'px';
    }
  };
  const dragmeBubble = document.getElementById('dragme-bubble');
  document.addEventListener('mousemove', e => {
    const target = e.target;
    if (target.classList && target.classList.contains('img-drag')) {
      dragmeBubble.style.opacity = '1';
      dragmeBubble.style.visibility = 'visible';
      dragmeBubble.style.left = (e.clientX + 8) + 'px';
      dragmeBubble.style.top = (e.clientY + 8) + 'px';
    } else {
      dragmeBubble.style.opacity = '0';
      dragmeBubble.style.visibility = 'hidden';
    }
  });
  // Mostrar el bocadillo DRAG ME justo debajo a la derecha del cursor cuando se pasa por una imagen draggable
  (function() {
    const bubble = document.getElementById('dragme-bubble');
    let isGrabbing = false;
    document.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('img-drag')) {
        isGrabbing = true;
      }
    });
    document.addEventListener('mouseup', function() {
      isGrabbing = false;
    });
    document.addEventListener('mousemove', function(e) {
      if (e.target.classList.contains('img-drag') || isGrabbing) {
        bubble.style.display = 'block';
        bubble.style.left = (e.clientX + 8) + 'px';
        bubble.style.top = (e.clientY + 8) + 'px';
      } else {
        bubble.style.display = 'none';
      }
    });
  })();
});
gsap.registerPlugin(Draggable, InertiaPlugin);

let clampSkew = gsap.utils.clamp(-20, 20);

class DraggableImg {
  constructor(Image) {
    const proxy = document.createElement("div"),
      tracker = InertiaPlugin.track(proxy, "x")[0],
      // Eliminamos el efecto de skew
      updateSkew = () => {},
  align = () => gsap.set(proxy, {attr:{class:'proxy'}, x: gsap.getProperty(Image, "x"), y: gsap.getProperty(Image, "y"), width: Image.offsetWidth, height: Image.offsetHeight, position: "absolute", pointerEvents: "none", top: Image.offsetTop, left: Image.offsetLeft});
    
    // make the proxy sit right on top and add it to the DOM so that bounds work
    align();
    Image.parentNode.append(proxy);

    // Agregar borde redondeado a la imagen
    Image.style.borderRadius = "12px";
    
    window.addEventListener('resize', align);
    
    this.drag = Draggable.create(proxy, {
      type: "x,y",
      trigger: Image,
      bounds: ".content-drag-area",
      edgeResistance: 0.6,
      onPressInit() {
        align();
      },
      onPress() {
        Image.style.zIndex = proxy.style.zIndex;
        window._setGrabbingCursor(true);
      },
      onDrag(e) {
        gsap.set(Image, {x: this.x, y: this.y});
        // Forzar el cursor a seguir el ratón durante el drag
        const evt = (e && e.type && e.clientX !== undefined) ? e : (window.event || {});
        if (evt.clientX !== undefined && evt.clientY !== undefined) {
          const eggCursor = document.getElementById('egg-cursor');
          eggCursor.style.left = evt.clientX + 'px';
          eggCursor.style.top = evt.clientY + 'px';
          // Mover el bocadillo DRAG ME junto al cursor
          const dragmeBubble = document.getElementById('dragme-bubble');
          dragmeBubble.style.left = (evt.clientX + 8) + 'px';
          dragmeBubble.style.top = (evt.clientY + 8) + 'px';
          dragmeBubble.style.opacity = '1';
          dragmeBubble.style.visibility = 'visible';
        }
      },
      onRelease() {
        window._setGrabbingCursor(false);
        // Ocultar el bocadillo al soltar
        const dragmeBubble = document.getElementById('dragme-bubble');
        dragmeBubble.style.opacity = '0';
        dragmeBubble.style.visibility = 'hidden';
      },
      onRelease() {
        window._setGrabbingCursor(false);
      },
      onThrowUpdate() {
        gsap.set(Image, {x: this.x, y: this.y});
      },
      inertia: true
    })[0];
  }
}

let draggables = gsap.utils.toArray(".img-drag").map(el => new DraggableImg(el));

// Fondo animado con partículas usando GSAP, ahora con colores y líneas conectando partículas cercanas
window.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('animated-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }
  window.addEventListener('resize', resize);

  // Partículas
  const particles = [];
  const COLORS = ['#fff', '#00eaff', '#ffb300', '#ff3b6b', '#7cff00'];
  const PARTICLE_COUNT = 48;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.5 + Math.random() * 2.5,
      alpha: 0.13 + Math.random() * 0.18,
      dx: -0.2 + Math.random() * 0.4,
      dy: -0.2 + Math.random() * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Dibujar líneas entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = 0.08;
          ctx.strokeStyle = p1.color;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    // Dibujar partículas
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      // Rebote en los bordes
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    }
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }
  animate();
});

// Animar solo el texto del botón ABOUT ME al hacer hover sobre el botón
(function() {
  const btn = document.querySelector('.hero-btn');
  const btnText = document.querySelector('.hero-btn-text');
  if (btn && btnText) {
    btn.addEventListener('mouseenter', function() {
      btnText.classList.remove('hover-animate');
      void btnText.offsetWidth;
      btnText.classList.add('hover-animate');
    });
    btn.addEventListener('mouseleave', function() {
      btnText.classList.remove('hover-animate');
    });
  }
})();

