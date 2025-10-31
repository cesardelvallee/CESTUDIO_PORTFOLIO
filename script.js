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
        const selectable = e.target.closest('.img-drag, a, button, input, textarea, .top-bar-left, .hero-btn, .bg-changer-btn');
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
      // Animación de click similar al botón CHANGE BG
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 400);
      
      // Navegación después de la animación
      setTimeout(() => {
        window.location.href = 'about.html';
      }, 200);
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
    tl.to(title, {opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.32, ease: 'expo.out',
      onStart: () => { title.style.pointerEvents = 'none'; },
      onComplete: () => { title.style.pointerEvents = 'auto'; }
    })
      .to(subtitle, {opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', visibility: 'visible', duration: 0.18, ease: 'power3.out',
        onStart: () => { subtitle.style.pointerEvents = 'none'; subtitle.style.visibility = 'visible'; },
        onComplete: () => { subtitle.style.pointerEvents = 'auto'; }
      }, '-=0.12')
      .to(btn, {opacity: 1, y: 0, scale: 1.08, filter: 'blur(0px)', duration: 0.14, ease: 'back.out(2)',
        onStart: () => { btn.style.pointerEvents = 'none'; },
        onComplete:()=>{
          btn.style.pointerEvents = 'auto';
          gsap.to(btn, {scale:1, duration:0.12, ease:'power1.out'});
        }
      }, '-=0.18')
      // Empezar la animación de las imágenes mientras el botón sigue entrando para reducir latencia
      .add(() => animateStackedImages(), '-=0.25');
  }

  // Función especial para ejecutar después de la pantalla de carga
  function startInitialAnimations() {
    // Ejecutar animaciones normalmente
    playHeroTitleAnimation();
  }

  // Hacer la función disponible globalmente para la pantalla de carga
  window.startInitialAnimations = startInitialAnimations;

  // Llamar a la animación solo cuando el modelo 3D esté listo
  const modelViewer = document.querySelector('model-viewer');
  if (modelViewer) {
    modelViewer.addEventListener('load', () => {
      // Solo ejecutar automáticamente si no hay pantalla de carga
      if (!document.getElementById('loading-screen')) {
        playHeroTitleAnimation();
      }
    });
  } else {
    // Si no hay modelo y no hay pantalla de carga, animar al cargar
    if (!document.getElementById('loading-screen')) {
      playHeroTitleAnimation();
    }
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
    // Animación de entrada con tiempos reducidos para que aparezcan más rápido
    stackedImgs.forEach((img, i) => {
      // Iniciar más pronto y con menor separación entre imágenes
      const delayMs = 60 + i * 90; // empieza a 60ms, luego +90ms por imagen
      gsap.delayedCall(delayMs / 1000, () => {
        gsap.to(img, {
          scale: 1.06,
          opacity: 1,
          duration: 0.18,
          ease: 'back.out(1.3)',
          overwrite: true,
          onComplete: () => {
            gsap.to(img, { scale: 1, duration: 0.06, ease: 'power1.out' });
          }
        });
      });
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

// ====== PANTALLA DE CARGA ======
// Iniciar inmediatamente sin esperar DOMContentLoaded para fluidez
(function() {
    // Detectar si existe la pantalla de carga lo antes posible
    function initializeLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');
        
        if (loadingScreen && loadingProgress && loadingText) {
            const minDisplayMs = 2000; // mostrar al menos 2s
            const startTime = Date.now();
            let progress = 0;
            const loadingMessages = [
                'Cargando Portfolio...',
                'Preparando experiencia...',
                'Casi listo...',
                'Perfecto!'
            ];

            // Mostrar texto inmediatamente
            loadingText.style.opacity = '1';

            // Forzar final si la animación tarda demasiado
            let forced = false;
            const forceFinishTimeout = setTimeout(() => {
                forced = true;
                progress = 100;
            }, 3600); // forzar tras ~3.6s si algo falla

            // Iniciar progreso muy pronto y con incrementos mayores para acelerar
            setTimeout(() => {
                const progressInterval = setInterval(() => {
                    // Incrementos grandes para avanzar rápido pero suavizados
                    progress += Math.random() * 18 + 10; // entre ~10 y ~28 por tick

                    if (progress >= 100 || forced) {
                        progress = 100;
                        clearInterval(progressInterval);
                        clearTimeout(forceFinishTimeout);

                        // Texto final
                        loadingText.textContent = loadingMessages[3];

                        // Asegurar que la pantalla se muestre al menos minDisplayMs
                        const elapsed = Date.now() - startTime;
                        const waitMore = Math.max(0, minDisplayMs - elapsed);

                        setTimeout(() => {
                            // aplicar clase de fade y después remover
                            loadingScreen.classList.add('fade-out');

                            // esperar la transición CSS (0.5s) antes de ocultar
                            setTimeout(() => {
                                try { loadingScreen.remove(); } catch(e) { loadingScreen.style.display='none'; }

                                // Mostrar el contenido principal
                                const mainContent = document.getElementById('main-content');
                                if (mainContent) {
                                    mainContent.style.opacity = '1';
                                    mainContent.style.visibility = 'visible';
                                }

                                // Ejecutar las animaciones del index INMEDIATAMENTE después de remover la pantalla
                                const triggerStartAnimations = () => {
                                    if (typeof window.startInitialAnimations === 'function') {
                                        window.startInitialAnimations();
                                    } else {
                                        // Si aún no está definida, esperarla al DOMContentLoaded
                                        document.addEventListener('DOMContentLoaded', function onReady() {
                                            document.removeEventListener('DOMContentLoaded', onReady);
                                            if (typeof window.startInitialAnimations === 'function') {
                                                window.startInitialAnimations();
                                            }
                                        });
                                    }
                                };

                                triggerStartAnimations();

                            }, 520); // ligeramente mayor que la transición para evitar parpadeos
                        }, waitMore + 40); // esperar el tiempo restante + un pequeño buffer

                    } else {
                        const messageIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
                        loadingText.textContent = loadingMessages[messageIndex];
                    }

                    loadingProgress.style.width = Math.min(100, Math.round(progress)) + '%';
                }, 45 + Math.random() * 90); // intervalos cortos
            }, 100); // iniciar muy pronto
        }
    }

    // Iniciar inmediatamente si ya existe, o esperar a que esté listo
    if (document.getElementById('loading-screen')) {
        initializeLoading();
    } else {
        document.addEventListener('DOMContentLoaded', initializeLoading);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // El resto del código de la pantalla de carga se maneja arriba para mayor fluidez
});

// ===== SISTEMA DE CAMBIO DE FONDOS DINÁMICOS =====
(function() {
  let currentBackgroundType = 'default';
  let currentVanta = null;
  
  // Lista de configuraciones de fondos
  const backgroundConfigs = [
    {
      name: 'halo',
      init: () => {
        if (window.VANTA && window.VANTA.HALO) {
          return VANTA.HALO({
            el: '#vanta-bg',
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: Math.random() * 0.5 + 0.8,
            baseColor: getRandomColor(),
            backgroundColor: getRandomDarkColor(),
            amplitudeFactor: Math.random() * 10 + 8,
            size: Math.random() * 0.8 + 0.8
          });
        }
      }
    },
    {
      name: 'waves',
      init: () => {
        if (window.VANTA && window.VANTA.WAVES) {
          return VANTA.WAVES({
            el: '#vanta-bg',
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: getRandomSubtleColor(), // Colores más sutiles
            waveHeight: Math.random() * 8 + 5, // Olas más bajas
            waveSpeed: Math.random() * 0.3 + 0.2, // Movimiento más lento
            zoom: Math.random() * 0.3 + 0.7, // Zoom más cerrado
            shininess: Math.random() * 20 + 10, // Menos brillo
            backgroundColor: 0x0a0a0a // Fondo oscuro
          });
        }
      }
    },
    {
      name: 'clouds',
      init: () => {
        if (window.VANTA && window.VANTA.CLOUDS) {
          return VANTA.CLOUDS({
            el: '#vanta-bg',
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            cloudShadows: true,
            skyColor: getRandomDarkColor(), // Cielo más oscuro
            cloudColor: getRandomSubtleColor(), // Nubes más sutiles
            speed: Math.random() * 0.4 + 0.3, // Movimiento más lento
            backgroundColor: 0x0a0a0a // Fondo muy oscuro
          });
        }
      }
    },
    {
      name: 'birds',
      init: () => {
        if (window.VANTA && window.VANTA.BIRDS) {
          return VANTA.BIRDS({
            el: '#vanta-bg',
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: getRandomDarkColor(),
            color1: getRandomColor(),
            color2: getRandomColor(),
            birdSize: Math.random() * 0.5 + 0.8,
            wingSpan: Math.random() * 10 + 15,
            speedLimit: Math.random() * 2 + 3,
            separation: Math.random() * 10 + 15,
            alignment: Math.random() * 10 + 15,
            cohesion: Math.random() * 10 + 15,
            quantity: Math.random() * 2 + 2
          });
        }
      }
    },
    {
      name: 'particles',
      init: () => createParticleBackground()
    },
    {
      name: 'gradient',
      init: () => createGradientBackground()
    },
    {
      name: 'matrix',
      init: () => createMatrixBackground()
    }
  ];

  // Función para obtener colores aleatorios
  function getRandomColor() {
    const colors = [0x181c24, 0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3, 0x6c5ce7];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function getRandomDarkColor() {
    const colors = [0x080808, 0x1a1a1a, 0x0f0f0f, 0x1e1e1e, 0x121212];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function getRandomLightColor() {
    const colors = [0xffffff, 0xf8f9fa, 0xe9ecef, 0xdee2e6];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function getRandomSubtleColor() {
    // Colores grises y tonos muy suaves para nubes más sutiles
    const colors = [0x2a2a2a, 0x404040, 0x353535, 0x4a4a4a, 0x303030, 0x3d3d3d];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Crear fondo de partículas personalizado
  function createParticleBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    vantaBg.innerHTML = '<canvas id="particles-canvas"></canvas>';
    
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const particles = [];
    const particleCount = 120;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#6c5ce7', '#fd79a8'];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: (Math.random() - 0.5) * 3,
        dy: (Math.random() - 0.5) * 3,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * 0.02 + 0.01
      });
    }
    
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar conexiones entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.globalAlpha = 0.15 * (1 - distance / 100);
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Dibujar y animar partículas
      particles.forEach(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.alpha += particle.pulse;
        
        if (particle.alpha >= 1 || particle.alpha <= 0.2) {
          particle.pulse *= -1;
        }
        
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.dx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.dy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }
        
        // Dibujar partícula con glow effect
        ctx.globalAlpha = particle.alpha;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    
    return { destroy: () => vantaBg.innerHTML = '' };
  }

  // Crear fondo de gradiente animado
  function createGradientBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#6c5ce7'];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
    
    vantaBg.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
    vantaBg.style.backgroundSize = '400% 400%';
    vantaBg.style.animation = 'gradient-shift 4s ease infinite';
    
    return { destroy: () => {
      vantaBg.style.background = '';
      vantaBg.style.animation = '';
    }};
  }

  // Crear efecto matrix
  function createMatrixBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    vantaBg.innerHTML = '<canvas id="matrix-canvas"></canvas>';
    
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    
    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    
    const matrixInterval = setInterval(drawMatrix, 35);
    
    return { destroy: () => {
      clearInterval(matrixInterval);
      vantaBg.innerHTML = '';
    }};
  }

  // Función principal para cambiar fondo
  function changeBackground() {
    // Destruir fondo actual
    if (currentVanta && typeof currentVanta.destroy === 'function') {
      currentVanta.destroy();
    }
    
    // Seleccionar nuevo fondo aleatorio
    const randomConfig = backgroundConfigs[Math.floor(Math.random() * backgroundConfigs.length)];
    
    // Mostrar notificación del nuevo fondo
    showBackgroundNotification(randomConfig.name);
    
    // Animación de transición
    const vantaBg = document.getElementById('vanta-bg');
    gsap.to(vantaBg, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        // Inicializar nuevo fondo
        currentVanta = randomConfig.init();
        currentBackgroundType = randomConfig.name;
        
        // Fade in del nuevo fondo
        gsap.to(vantaBg, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
    });
  }

  // Mostrar notificación del cambio de fondo
  function showBackgroundNotification(bgName) {
    // Remover notificación anterior si existe
    const existingNotification = document.getElementById('bg-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.id = 'bg-notification';
    notification.style.cssText = `
      position: fixed;
      top: 90px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      z-index: 3002;
      opacity: 0;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      white-space: nowrap;
    `;
    notification.textContent = `Background: ${bgName.toUpperCase()}`;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    gsap.to(notification, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });
    
    // Animar salida después de 2 segundos
    setTimeout(() => {
      gsap.to(notification, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => notification.remove()
      });
    }, 2000);
  }

  // Event listener para el botón
  document.addEventListener('DOMContentLoaded', () => {
    const bgChangerBtn = document.getElementById('bgChangerBtn');
    if (bgChangerBtn) {
      bgChangerBtn.addEventListener('click', () => {
        // Animación del botón
        bgChangerBtn.classList.add('clicked');
        setTimeout(() => bgChangerBtn.classList.remove('clicked'), 400);
        
        // Cambiar fondo
        changeBackground();
      });
    }
  });

  // CSS para gradiente animado
  const style = document.createElement('style');
  style.textContent = `
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;
  document.head.appendChild(style);
})();
