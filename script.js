// Animación GSAP para el texto CONTACT ME y entrada de textos principales
document.addEventListener('DOMContentLoaded', () => {
  // Hacer que al hacer click en CESAR DEL VALLE se vuelva al index
  const topBarLeft = document.querySelector('.top-bar-left');
  if (topBarLeft) {
    // Removemos el cursor override que puede interferir
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
        const selectable = e.target.closest('.img-drag, a, button, input, textarea, .top-bar-left, .hero-btn, .bg-changer-btn, .control-btn, .player-toggle, .player-minimize, .progress-bar, .genre-dropdown, .volume-slider, .contact-link, .contact-card, .cta-button, .card-link');
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
  
  // Lista de configuraciones de fondos optimizados
  const backgroundConfigs = [
    {
      name: 'floating-orbs',
      init: () => createFloatingOrbsBackground()
    },
    {
      name: 'geometric-waves',
      init: () => createGeometricWavesBackground()
    },
    {
      name: 'neural-network',
      init: () => createNeuralNetworkBackground()
    },
    {
      name: 'cosmic-dust',
      init: () => createCosmicDustBackground()
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
    },
    {
      name: 'aurora',
      init: () => createAuroraBackground()
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

  // Crear fondo de partículas personalizado (optimizado)
  function createParticleBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    vantaBg.innerHTML = '<canvas id="particles-canvas"></canvas>';
    
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
    `;
    
    const particles = [];
    const particleCount = 80; // Reducido para mejor rendimiento
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#6c5ce7', '#fd79a8'];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * 0.02 + 0.01
      });
    }
    
    function animateParticles() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar conexiones entre partículas cercanas (optimizado)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.globalAlpha = 0.2 * (1 - distance / 120);
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
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      requestAnimationFrame(animateParticles);
    }
    
    let animationId = requestAnimationFrame(animateParticles);
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    
    return { 
      destroy: () => {
        cancelAnimationFrame(animationId);
        vantaBg.innerHTML = '';
      }
    };
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

  // Crear fondo de esferas flotantes (reemplaza HALO)
  function createFloatingOrbsBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    vantaBg.innerHTML = '<div id="floating-orbs"></div>';
    
    const container = document.getElementById('floating-orbs');
    container.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
      overflow: hidden;
    `;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#6c5ce7'];
    
    for (let i = 0; i < 8; i++) {
      const orb = document.createElement('div');
      const size = Math.random() * 100 + 50;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      orb.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, ${color}88, ${color}22, transparent);
        border-radius: 50%;
        filter: blur(1px);
        animation: float-orb-${i} ${Math.random() * 10 + 15}s infinite linear;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      
      // Agregar keyframes únicas para cada esfera
      const keyframes = `
        @keyframes float-orb-${i} {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(${0.8 + Math.random() * 0.4}) rotate(90deg); }
          50% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(${0.8 + Math.random() * 0.4}) rotate(180deg); }
          75% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(${0.8 + Math.random() * 0.4}) rotate(270deg); }
          100% { transform: translate(0, 0) scale(1) rotate(360deg); }
        }
      `;
      
      if (!document.getElementById(`orb-style-${i}`)) {
        const style = document.createElement('style');
        style.id = `orb-style-${i}`;
        style.textContent = keyframes;
        document.head.appendChild(style);
      }
      
      container.appendChild(orb);
    }
    
    return { 
      destroy: () => {
        vantaBg.innerHTML = '';
        // Limpiar estilos
        for (let i = 0; i < 8; i++) {
          const style = document.getElementById(`orb-style-${i}`);
          if (style) style.remove();
        }
      }
    };
  }

  // Crear fondo de ondas geométricas (reemplaza WAVES)
  function createGeometricWavesBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    vantaBg.innerHTML = '<div id="geometric-waves"></div>';
    
    const container = document.getElementById('geometric-waves');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const primaryColor = colors[Math.floor(Math.random() * colors.length)];
    
    container.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%);
      overflow: hidden;
    `;
    
    // Crear múltiples capas de ondas
    for (let i = 0; i < 5; i++) {
      const wave = document.createElement('div');
      wave.style.cssText = `
        position: absolute;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent 40%, ${primaryColor}${Math.floor(Math.random() * 30 + 10).toString(16)} 50%, transparent 60%);
        animation: geometric-wave-${i} ${Math.random() * 20 + 20}s infinite linear;
        left: -50%;
        top: ${Math.random() * 100 - 50}%;
        transform-origin: center;
      `;
      
      const keyframes = `
        @keyframes geometric-wave-${i} {
          0% { transform: rotate(0deg) translateY(0px); }
          100% { transform: rotate(360deg) translateY(${Math.random() * 100 - 50}px); }
        }
      `;
      
      if (!document.getElementById(`wave-style-${i}`)) {
        const style = document.createElement('style');
        style.id = `wave-style-${i}`;
        style.textContent = keyframes;
        document.head.appendChild(style);
      }
      
      container.appendChild(wave);
    }
    
    return { 
      destroy: () => {
        vantaBg.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const style = document.getElementById(`wave-style-${i}`);
          if (style) style.remove();
        }
      }
    };
  }

  // Crear fondo de red neuronal (reemplaza CLOUDS)
  function createNeuralNetworkBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    vantaBg.innerHTML = '<canvas id="neural-canvas"></canvas>';
    
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%);
    `;
    
    const nodes = [];
    const nodeCount = 50;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    const primaryColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Crear nodos
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1
      });
    }
    
    function animateNetwork() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar nodos
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Dibujar nodo
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor + '80';
        ctx.fill();
      });
      
      // Dibujar conexiones
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = primaryColor + Math.floor((1 - distance / 150) * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animateNetwork);
    }
    
    let animationId = requestAnimationFrame(animateNetwork);
    
    return { 
      destroy: () => {
        cancelAnimationFrame(animationId);
        vantaBg.innerHTML = '';
      }
    };
  }

  // Crear fondo de polvo cósmico (reemplaza BIRDS)
  function createCosmicDustBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    vantaBg.innerHTML = '<canvas id="cosmic-canvas"></canvas>';
    
    const canvas = document.getElementById('cosmic-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f0f 100%);
    `;
    
    const particles = [];
    const particleCount = 200;
    const colors = ['#ffffff', '#feca57', '#ff9ff3', '#4ecdc4', '#ff6b6b'];
    
    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.02 + 0.01
      });
    }
    
    function animateCosmic() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.opacity += particle.twinkle;
        
        if (particle.opacity >= 1 || particle.opacity <= 0.1) {
          particle.twinkle *= -1;
        }
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Dibujar partícula con efecto de brillo
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.restore();
      });
      
      requestAnimationFrame(animateCosmic);
    }
    
    let animationId = requestAnimationFrame(animateCosmic);
    
    return { 
      destroy: () => {
        cancelAnimationFrame(animationId);
        vantaBg.innerHTML = '';
      }
    };
  }

  // Crear fondo de aurora boreal
  function createAuroraBackground() {
    const vantaBg = document.getElementById('vanta-bg');
    vantaBg.innerHTML = '<div id="aurora-container"></div>';
    
    const container = document.getElementById('aurora-container');
    container.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
      overflow: hidden;
    `;
    
    const colors = [
      'rgba(0, 255, 146, 0.3)',
      'rgba(0, 204, 255, 0.3)', 
      'rgba(147, 0, 211, 0.3)',
      'rgba(255, 20, 147, 0.3)',
      'rgba(255, 215, 0, 0.3)'
    ];
    
    for (let i = 0; i < 6; i++) {
      const aurora = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      aurora.style.cssText = `
        position: absolute;
        width: 100%;
        height: ${Math.random() * 200 + 100}px;
        background: linear-gradient(90deg, transparent, ${color}, transparent);
        top: ${Math.random() * 80}%;
        filter: blur(2px);
        animation: aurora-flow-${i} ${Math.random() * 15 + 10}s infinite ease-in-out;
        transform-origin: center;
      `;
      
      const keyframes = `
        @keyframes aurora-flow-${i} {
          0%, 100% { 
            transform: translateX(-100%) skewX(${Math.random() * 20 - 10}deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateX(100%) skewX(${Math.random() * 20 - 10}deg); 
            opacity: 0.8;
          }
        }
      `;
      
      if (!document.getElementById(`aurora-style-${i}`)) {
        const style = document.createElement('style');
        style.id = `aurora-style-${i}`;
        style.textContent = keyframes;
        document.head.appendChild(style);
      }
      
      container.appendChild(aurora);
    }
    
    return { 
      destroy: () => {
        vantaBg.innerHTML = '';
        for (let i = 0; i < 6; i++) {
          const style = document.getElementById(`aurora-style-${i}`);
          if (style) style.remove();
        }
      }
    };
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

// ===== REPRODUCTOR MUSICAL WIDGET =====
(function() {
  // Tu canción favorita de cada género
  const musicDatabase = {
    'rock-ingles': { title: 'I Still Haven\'t Found What I\'m Looking For', artist: 'U2', src: 'music/U2 - I Still Haven\'t Found What I\'m Looking For (Official Music Video).mp3' },
    'espanolada': { title: 'Llamando a la tierra', artist: 'M-Clan', src: 'music/M-Clan - Llamando a la Tierra (letra).mp3' },
    'reggaeton': { title: 'Guaya', artist: 'Don Omar', src: 'music/Don Omar - Guaya Guaya (Audio).mp3' },
    'techno': { title: 'Snow Crystal', artist: 'Babalos', src: 'music/Babalos - Snow Crystal [HQ] - Babalos.mp3' },
    'folk': { title: 'Vagabond', artist: 'Caamp', src: 'music/Vagabond.mp3' },
    'indie': { title: 'Si Algo Es Puro Vale El Doble', artist: 'West Srk', src: 'music/West Srk - Si Algo Es Puro Vale El Doble (Video Oficial) - West Srk.mp3' },
    'trap-urbano': { title: 'Moonlights Puppet Remix', artist: 'Al Safir, Interferencias', src: 'music/Interferencias - MOONLIGHT\'S PUPPET (REMIX) feat. Al Safir (Videoclip Oficial).mp3' },
    'pop-ingles': { title: 'Somebody That I Used to Know', artist: 'Gotye ft. Kimbra', src: 'music/Gotye - Somebody That I Used to Know.mp3' }
  };

  let currentGenre = 'rock-ingles';
  let isPlaying = false;
  let isMinimized = false;

  // Array de géneros para navegación
  const genreList = ['rock-ingles', 'espanolada', 'reggaeton', 'techno', 'folk', 'indie', 'trap-urbano', 'pop-ingles'];
  let currentGenreIndex = 0;

  // Elementos DOM
  const musicWidget = document.getElementById('music-player');
  const audio = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const genreSelect = document.getElementById('genre-select');
  const currentGenreText = document.getElementById('current-genre-text');
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeSpan = document.getElementById('current-time');
  const totalTimeSpan = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume-slider');
  const minimizeBtn = document.getElementById('player-minimize');
  const playerToggle = document.getElementById('player-toggle');
  const progressBar = document.querySelector('.progress-bar');

  // Inicializar reproductor
  function initPlayer() {
    updateCurrentSong();
    audio.volume = volumeSlider.value / 100;
    
    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Debug: verificar que los botones existen
    console.log('prevBtn:', prevBtn);
    console.log('nextBtn:', nextBtn);
    
    if (prevBtn) prevBtn.addEventListener('click', previousSong);
    if (nextBtn) nextBtn.addEventListener('click', nextSong);
    
    genreSelect.addEventListener('change', changeGenre);
    volumeSlider.addEventListener('input', changeVolume);
    minimizeBtn.addEventListener('click', toggleMinimize);
    playerToggle.addEventListener('click', togglePlayPause);
    progressBar.addEventListener('click', seekTo);
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      // Solo si el music player está visible
      if (musicWidget && !musicWidget.style.display === 'none') {
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            previousSong();
            break;
          case 'ArrowRight':
            e.preventDefault();
            nextSong();
            break;
          case ' ':
            e.preventDefault();
            togglePlayPause();
            break;
        }
      }
    });
    
    // Audio events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => {
      // Al terminar, pasar automáticamente a la siguiente canción
      nextSong();
    });
    
    // Agregar manejo de errores para diagnóstico
    audio.addEventListener('error', (e) => {
      console.error('Error al cargar audio:', e);
      console.error('Archivo problemático:', audio.src);
      showNotification('Error al cargar la canción');
      playPauseIcon.src = 'img/PLAY.svg';
      playPauseIcon.alt = 'Play';
      isPlaying = false;
    });
    
    audio.addEventListener('loadstart', () => {
      console.log('Iniciando carga de:', audio.src);
    });
    
    audio.addEventListener('canplay', () => {
      console.log('Audio listo para reproducir:', audio.src);
    });
    
    console.log('🎵 Reproductor musical personal inicializado');
  }

  function updateCurrentSong() {
    const song = musicDatabase[currentGenre];
    
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    audio.src = song.src;
    
    // Actualizar nombre del género
    const genreNames = {
      'rock-ingles': 'Rock Inglés',
      'espanolada': 'Españolada',
      'reggaeton': 'Reggaetón',
      'techno': 'Techno',
      'folk': 'Folk',
      'indie': 'Indie',
      'trap-urbano': 'Trap/Urbano',
      'pop-ingles': 'Pop Inglés'
    };
    
    currentGenreText.textContent = genreNames[currentGenre];
  }

  function togglePlayPause() {
    if (isPlaying) {
      audio.pause();
      playPauseIcon.src = 'img/PLAY.svg';
      playPauseIcon.alt = 'Play';
      playerToggle.textContent = '🎵';
      isPlaying = false;
    } else {
      audio.play().then(() => {
        playPauseIcon.src = 'img/PAUSE.svg';
        playPauseIcon.alt = 'Pause';
        playerToggle.textContent = '🎶';
        isPlaying = true;
      }).catch(error => {
        console.log('Error al reproducir:', error);
        // Si falla la reproducción automática, esperar interacción del usuario
        showNotification('Haz clic para reproducir música');
      });
    }
  }

  function changeGenre() {
    const wasPlaying = isPlaying;
    
    // Pausar canción actual
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    }
    
    currentGenre = genreSelect.value;
    
    // Actualizar índice para sincronizar con botones prev/next
    currentGenreIndex = genreList.indexOf(currentGenre);
    
    updateCurrentSong();
    
    // Si estaba reproduciendo, continuar con la nueva canción
    if (wasPlaying) {
      // Pequeño delay para asegurar que el archivo se carga
      setTimeout(() => {
        audio.play().then(() => {
          playPauseIcon.src = 'img/PAUSE.svg';
          playPauseIcon.alt = 'Pause';
          playerToggle.textContent = '🎶';
          isPlaying = true;
        }).catch(error => {
          console.error('Error al reproducir nueva canción:', error);
          showNotification('Error al reproducir esta canción');
          playPauseIcon.src = 'img/PLAY.svg';
          playPauseIcon.alt = 'Play';
          isPlaying = false;
        });
      }, 100);
    }
    
    // Mostrar notificación del cambio
    const genreNames = {
      'rock-ingles': 'Rock Inglés',
      'espanolada': 'Españolada',
      'reggaeton': 'Reggaetón',
      'techno': 'Techno',
      'folk': 'Folk',
      'indie': 'Indie',
      'trap-urbano': 'Trap/Urbano',
      'pop-ingles': 'Pop Inglés'
    };
    showNotification(`Ahora: ${genreNames[currentGenre]}`);
  }

  function changeVolume() {
    audio.volume = volumeSlider.value / 100;
  }

  function previousSong() {
    console.log('previousSong() called');
    console.log('currentGenreIndex before:', currentGenreIndex);
    
    currentGenreIndex = (currentGenreIndex - 1 + genreList.length) % genreList.length;
    currentGenre = genreList[currentGenreIndex];
    
    console.log('currentGenreIndex after:', currentGenreIndex);
    console.log('new currentGenre:', currentGenre);
    
    genreSelect.value = currentGenre;
    updateCurrentSong();
    
    if (isPlaying) {
      audio.play();
    }
    
    // Mostrar notificación
    const genreNames = {
      'rock-ingles': 'Rock Inglés',
      'espanolada': 'Españolada',
      'reggaeton': 'Reggaetón',
      'techno': 'Techno',
      'folk': 'Folk',
      'indie': 'Indie',
      'trap-urbano': 'Trap/Urbano',
      'pop-ingles': 'Pop Inglés'
    };
    showNotification(`← ${genreNames[currentGenre]}`);
  }

  function nextSong() {
    console.log('nextSong() called');
    console.log('currentGenreIndex before:', currentGenreIndex);
    
    currentGenreIndex = (currentGenreIndex + 1) % genreList.length;
    currentGenre = genreList[currentGenreIndex];
    
    console.log('currentGenreIndex after:', currentGenreIndex);
    console.log('new currentGenre:', currentGenre);
    
    genreSelect.value = currentGenre;
    updateCurrentSong();
    
    if (isPlaying) {
      audio.play();
    }
    
    // Mostrar notificación
    const genreNames = {
      'rock-ingles': 'Rock Inglés',
      'espanolada': 'Españolada',
      'reggaeton': 'Reggaetón',
      'techno': 'Techno',
      'folk': 'Folk',
      'indie': 'Indie',
      'trap-urbano': 'Trap/Urbano',
      'pop-ingles': 'Pop Inglés'
    };
    showNotification(`${genreNames[currentGenre]} →`);
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
    musicWidget.classList.toggle('minimized', isMinimized);
    minimizeBtn.textContent = isMinimized ? '+' : '−';
  }

  function seekTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  }

  function updateProgress() {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = progress + '%';
      
      currentTimeSpan.textContent = formatTime(audio.currentTime);
    }
  }

  function updateDuration() {
    totalTimeSpan.textContent = formatTime(audio.duration);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function showNotification(message) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px 16px;
      border-radius: 20px;
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      z-index: 4000;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.style.opacity = '1', 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Inicializar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que todo el CSS esté cargado
    setTimeout(initPlayer, 500);
  });

})();

// ===== ABOUT PAGE - EXQUISITE ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  // Solo ejecutar en la página About
  if (!document.body.classList.contains('about-page')) return;

  // Animaciones elegantes de entrada
  function elegantAnimations() {
    const elements = [
      { selector: '.elegant-title', delay: 0 },
      { selector: '.title-accent', delay: 200 },
      { selector: '.name-elegant', delay: 400 },
      { selector: '.role-elegant', delay: 500 },
      { selector: '.description-elegant', delay: 600 },
      { selector: '.visual-element', delay: 300 },
      { selector: '.section-title-elegant', delay: 800 },
      { selector: '.section-line', delay: 900 },
      { selector: '.skill-block', delay: 1000 },
      { selector: '.info-grid-elegant', delay: 1200 }
    ];

    elements.forEach(({ selector, delay }) => {
      const els = document.querySelectorAll(selector);
      els.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay + (index * 100));
      });
    });
  }

  // Smooth hover effects para skill blocks
  function addHoverEffects() {
    const skillBlocks = document.querySelectorAll('.skill-block');
    
    skillBlocks.forEach(block => {
      block.addEventListener('mouseenter', () => {
        block.style.transform = 'translateY(-4px)';
        block.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      
      block.addEventListener('mouseleave', () => {
        block.style.transform = 'translateY(0)';
      });
    });
  }

  // Inicializar animaciones elegantes
  setTimeout(() => {
    elegantAnimations();
    addHoverEffects();
  }, 100);
});
