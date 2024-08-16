document.addEventListener('DOMContentLoaded', function() {
    // Animación de fade-in para los elementos de la página
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        element.style.opacity = '0';
        let delay = 100;
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease-in';
            element.style.opacity = '1';
        }, delay);
        delay += 100;
    });

    // Añadir interactividad a los elementos del proyecto
    const projectId = document.getElementById('projectId');
    const projectName = document.getElementById('projectName');
    const projectDate = document.getElementById('projectDate');

    if (projectId && projectName && projectDate) {
        [projectId, projectName, projectDate].forEach(element => {
            element.addEventListener('mouseover', function() {
                this.style.color = '#3498db';
                this.style.transition = 'color 0.3s ease';
            });

            element.addEventListener('mouseout', function() {
                this.style.color = '';
            });
        });
    }
});