// Script para el menú hamburguesa
document.querySelector('.navbar-toggler').addEventListener('click', function() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const logo = document.querySelector('#navbar-logo');
    
    // Ocultar/Mostrar el logo
    logo.classList.toggle('hidden');
    
    // Desplegar el menú suavemente
    navbarCollapse.classList.toggle('active');
});

// Script para el botón de visibilidad de contraseña
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#exampleInputPassword1');

togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye icon
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

