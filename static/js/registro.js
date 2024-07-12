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
const togglePassword1 = document.querySelector('#togglePassword1');
const password1 = document.querySelector('#exampleInputPassword1');

if (togglePassword1 && password1) {
    togglePassword1.addEventListener('click', function (e) {
        const type = password1.getAttribute('type') === 'password' ? 'text' : 'password';
        password1.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

const togglePassword2 = document.querySelector('#togglePassword2');
const password2 = document.querySelector('#exampleInputPassword2');

if (togglePassword2 && password2) {
    togglePassword2.addEventListener('click', function (e) {
        const type = password2.getAttribute('type') === 'password' ? 'text' : 'password';
        password2.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}