window.addEventListener('beforeunload', function(event) {
    // Enviar una solicitud AJAX para cerrar la sesión del usuario
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '{{ url_for("logout") }}', false);
    xhr.send();

    // Mostrar el mensaje de cierre de sesión
    document.getElementById('logout-message').classList.remove('hidden');

    // Mensaje personalizado para el diálogo onbeforeunload
    var confirmationMessage = "Estás saliendo de la página sin cerrar sesión. Asegúrate de cerrar sesión antes de salir.";
    event.returnValue = confirmationMessage;
    return confirmationMessage;
});
