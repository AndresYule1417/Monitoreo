document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const header = document.querySelector('header');

    let prevScrollpos = window.pageYOffset;

    const handleNavigation = (links) => {
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                localStorage.setItem('activeLink', link.getAttribute('href'));
            });
        });
    };

    const restoreActiveLink = () => {
        const activeLink = localStorage.getItem('activeLink');
        if (activeLink) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === activeLink) {
                    link.classList.add('active');
                }
            });
        } else {
            if (navLinks.length > 0) {
                navLinks[0].classList.add('active');
            }
        }
    };

    const toggleNavOnScroll = () => {
        const currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos || currentScrollPos === 0) {
            header.style.opacity = "1";
            header.style.top = "0";
        } else {
            header.style.opacity = "0";
            header.style.top = `-${header.offsetHeight}px`;
        }
        prevScrollpos = currentScrollPos;
    };

    window.addEventListener('scroll', toggleNavOnScroll);

    handleNavigation(navLinks);
    restoreActiveLink();

    // Función para cargar y actualizar la gráfica de nivel de agua
    const updateWaterLevelChart = async () => {
        try {
            // Realizar una solicitud al servidor para obtener los datos de la gráfica
            const response = await fetch('/api/waterLevelData'); // Ruta del servidor que proporciona los datos
            const data = await response.json();

            // Actualizar la gráfica con los nuevos datos
            waterLevelChart.data.labels = data.labels;
            waterLevelChart.data.datasets[0].data = data.waterLevels;
            waterLevelChart.update();
        } catch (error) {
            console.error('Error al cargar los datos de la gráfica:', error);
        }
    };

    // Configurar y mostrar el gráfico de nivel de agua inicialmente
    const ctx = document.getElementById('waterLevelChart').getContext('2d');
    const waterLevelChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
            datasets: [{
                label: 'Nivel del Agua (%)',
                data: [75, 68, 80, 85, 70, 78, 90],
                borderColor: 'rgba(30, 144, 255, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Actualizar la gráfica de nivel de agua cada vez que se cargue la página
    updateWaterLevelChart();

});
