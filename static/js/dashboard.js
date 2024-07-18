document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarItems = sidebar.querySelectorAll('li:not(.sidebar-toggle)');

    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-expanded');
        mainContent.classList.toggle('main-content-expanded');
        const icon = sidebarToggle.querySelector('i');
        icon.classList.toggle('fa-angle-right');
        icon.classList.toggle('fa-angle-left');
    }

    function expandSidebar() {
        sidebar.classList.add('sidebar-expanded');
        mainContent.classList.add('main-content-expanded');
    }

    function collapseSidebar() {
        sidebar.classList.remove('sidebar-expanded');
        mainContent.classList.remove('main-content-expanded');
    }

    function handleItemHover() {
        if (window.innerWidth > 768) {
            expandSidebar();
        }
    }

    function handleSidebarLeave() {
        if (window.innerWidth > 768) {
            collapseSidebar();
        }
    }

    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            collapseSidebar();
            sidebarItems.forEach(item => {
                item.removeEventListener('mouseenter', handleItemHover);
            });
            sidebar.removeEventListener('mouseleave', handleSidebarLeave);
            sidebarToggle.addEventListener('click', toggleSidebar);
        } else {
            collapseSidebar();
            sidebarItems.forEach(item => {
                item.addEventListener('mouseenter', handleItemHover);
            });
            sidebar.addEventListener('mouseleave', handleSidebarLeave);
            sidebarToggle.removeEventListener('click', toggleSidebar);
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Llamar al inicio para configurar correctamente
});

        // Mostrar alerta al intentar cerrar sesión
