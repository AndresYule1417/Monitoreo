document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidad para la barra lateral
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    sidebar.addEventListener('mouseenter', () => {
        sidebar.style.width = '250px';
        mainContent.style.marginLeft = '250px';
    });

    sidebar.addEventListener('mouseleave', () => {
        sidebar.style.width = '60px';
        mainContent.style.marginLeft = '60px';
    });

    // Ajuste para dispositivos móviles
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            sidebar.style.width = '0';
            mainContent.style.marginLeft = '0';
            
            sidebar.addEventListener('mouseenter', () => {
                sidebar.style.width = '200px';
                mainContent.style.marginLeft = '200px';
            });

            sidebar.addEventListener('mouseleave', () => {
                sidebar.style.width = '0';
                mainContent.style.marginLeft = '0';
            });
        } else {
            sidebar.style.width = '60px';
            mainContent.style.marginLeft = '60px';
            
            sidebar.addEventListener('mouseenter', () => {
                sidebar.style.width = '250px';
                mainContent.style.marginLeft = '250px';
            });

            sidebar.addEventListener('mouseleave', () => {
                sidebar.style.width = '60px';
                mainContent.style.marginLeft = '60px';
            });
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Llamar al inicio para configurar correctamente

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
});

// Función para buscar proyectos
function searchProject() {
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const projectName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        if (projectName.includes(searchQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Función para editar un proyecto
function editProject(id) {
    const form = document.getElementById(`editForm${id}`);
    const formData = new FormData(form);

    fetch(`/edit_project/${id}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Proyecto actualizado con éxito');
            location.reload();
        } else {
            alert('Error al actualizar el proyecto');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el proyecto');
    });

    return false;  // Previene el envío del formulario por defecto
}

// Función para eliminar un proyecto
function deleteProject(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        fetch(`/delete/${id}`, {  // Cambia aquí la ruta
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Proyecto eliminado con éxito');
                location.reload();
            } else {
                alert('Error al eliminar el proyecto');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar el proyecto');
        });
    }
}

