document.addEventListener('DOMContentLoaded', function() {

    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }
        document.getElementById(tabName).classList.add("active");
        evt.currentTarget.classList.add("active");
    }
    
    // Abre la pestaña de "Datos Personales" por defecto
    document.querySelector(".tablinks").click();
    
    // Resaltar la página activa en la barra lateral
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    
    function highlightActiveLink() {
        sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    highlightActiveLink();
    
        // Manejar el cambio de pestañas
        const tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].addEventListener("click", function(event) {
                openTab(event, this.textContent.toLowerCase());
            });
        }
    
        // Manejar el envío del formulario de datos personales
        const personalForm = document.getElementById("personal-form");
        personalForm.addEventListener("submit", function(event) {
            event.preventDefault();
            // Aquí iría la lógica para enviar los datos al servidor
            alert("Datos personales actualizados correctamente");
        });
    
        // Manejar el envío del formulario de seguridad
        const securityForm = document.getElementById("security-form");
        securityForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const newPassword = document.getElementById("new-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            if (newPassword !== confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }
            // Aquí iría la lógica para enviar los datos al servidor
            alert("Contraseña actualizada correctamente");
        });
    
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
    
    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
    