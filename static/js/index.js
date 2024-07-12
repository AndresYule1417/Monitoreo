document.addEventListener('DOMContentLoaded', function() {
    const toggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarLogo = document.getElementById('navbar-logo');

    toggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('active');
        navbarLogo.classList.toggle('hidden');
    });

    // Función para el desplazamiento suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efecto 3D para las imágenes
    const images = document.querySelectorAll('.img-fluid');
    
    images.forEach(img => {
        img.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            const tiltX = (y - 0.5) * 20; // Ajusta el 20 para más o menos inclinación
            const tiltY = (x - 0.5) * -20; // Ajusta el -20 para más o menos inclinación
            
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });


    // Código del carrusel
    const carousel = document.querySelector('.carousel');
    const items = carousel.querySelectorAll('.carousel-item');
    const controls = document.querySelectorAll('.carousel-control');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

let currentIndex = 0;
const totalItems = items.length;

// Clonar el primer elemento y añadirlo al final
const firstClone = items[0].cloneNode(true);
carousel.appendChild(firstClone);

// Actualizar el ancho del carrusel
carousel.style.width = `${(totalItems + 1) * 100}%`;

// Crear indicadores
items.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
});

const indicators = indicatorsContainer.querySelectorAll('.indicator');

function updateCarousel(transition = true) {
    if (transition) {
    carousel.style.transition = 'transform 0.5s ease-in-out';
    } else {
    carousel.style.transition = 'none';
    }
    carousel.style.transform = `translateX(-${currentIndex * 100 / (totalItems + 1)}%)`;
    indicators.forEach((ind, index) => {
    ind.classList.toggle('active', index === currentIndex % totalItems);
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

function nextSlide() {
    currentIndex++;
    updateCarousel();

    if (currentIndex === totalItems) {
    setTimeout(() => {
        currentIndex = 0;
        updateCarousel(false);
    }, 500);
    }
}

function prevSlide() {
    if (currentIndex === 0) {
    currentIndex = totalItems;
    updateCarousel(false);
    setTimeout(() => {
        currentIndex--;
        updateCarousel();
    }, 20);
    } else {
    currentIndex--;
    updateCarousel();
    }
}

controls.forEach(control => {
    control.addEventListener('click', () => {
    control.classList.contains('next') ? nextSlide() : prevSlide();
    });
});

// Cambio automático de diapositivas
setInterval(nextSlide, 5000);
});

//----------------acordeon---------------
const accordionButtons = document.querySelectorAll('.accordion-button');
    
accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const content = this.parentElement.nextElementSibling;
        
        // Cerrar todos los demás paneles
        accordionButtons.forEach(btn => {
            if (btn !== this) {
                btn.classList.remove('active');
                btn.parentElement.nextElementSibling.style.maxHeight = null;
            }
        });

        // Alternar el panel actual
        this.classList.toggle('active');
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

// -------------------footer-------------------
const footerLinks = document.querySelectorAll('.footer__link');
    
footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});
