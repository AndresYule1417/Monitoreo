document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar datos del resumen
    function loadOverviewData() {
        // Simula una llamada a la API. Reemplaza esto con tu lógica real de fetch
        setTimeout(() => {
            document.getElementById('waterLevel').textContent = 'Nivel del Agua: 75%';
            document.getElementById('waterQuality').textContent = 'Estado: Buena';
            document.getElementById('dailyConsumption').textContent = 'Consumo Diario: 1200 m³';
        }, 1000);
    }

    // Función para crear el gráfico de nivel de agua
    function createWaterLevelChart() {
        const ctx = document.getElementById('waterLevelChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'Nivel de Agua (m)',
                    data: [65, 59, 80, 81, 56, 55],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Nivel de Agua en los Últimos 6 Meses'
                    }
                }
            }
        });
    }

    // Función para cargar alertas
    function loadAlerts() {
        const alertsContainer = document.getElementById('alertsContainer');
        // Simula una llamada a la API. Reemplaza esto con tu lógica real de fetch
        const alerts = [
            'Nivel del agua bajo en el Río Sumapaz.',
            'Posible contaminación detectada en el Río Magdalena.'
        ];

        alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = 'alert fade-in';
            alertElement.textContent = alert;
            alertsContainer.appendChild(alertElement);
        });
    }

    // Cargar datos y crear gráficos
    loadOverviewData();
    createWaterLevelChart();
    loadAlerts();

    // Animación de parallax
    window.addEventListener('scroll', function() {
        const parallax = document.querySelector('.parallax');
        let scrollPosition = window.pageYOffset;
        parallax.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
});