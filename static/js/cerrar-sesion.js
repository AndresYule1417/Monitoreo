window.addEventListener('beforeunload', function (e) {
    var logged_in = "{{ session['logueado']|tojson }}";
    if (logged_in) {
        var confirmationMessage = "Estás saliendo de la página sin cerrar sesión. Asegúrate de cerrar sesión antes de salir.";
        (e || window.event).returnValue = confirmationMessage; // Gecko + IE
        return confirmationMessage; // Webkit, Safari, Chrome etc.
    }
});
