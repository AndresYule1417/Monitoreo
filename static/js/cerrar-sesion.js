window.onbeforeunload = function() {
    // Verifica si el usuario está logueado (usando la variable de sesión correspondiente)
    var logged_in = "{{ session['logueado']|tojson }}";
    if (logged_in) {
        return "Estás saliendo de la página sin cerrar sesión. Asegúrate de cerrar sesión antes de salir.";
    }
};
