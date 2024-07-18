document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const header = document.querySelector('header');
    const newsContainer = document.getElementById('news-container');
    const rssFeedUrl = 'https://news.google.com/rss/search?q=hidrología+forestal+medio+ambiente+Colombia&hl=es-419&gl=CO&ceid=CO:es-419'; // URL del feed RSS actualizado
    const proxyUrl = 'https://api.allorigins.win/get?url='; // URL del proxy

    let prevScrollpos = window.pageYOffset;

    const handleNavigation = (links) => {
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                localStorage.setItem('activeLink', link.getAttribute('href'));
            });
        });
    };

    const restoreActiveLink = () => {
        const activeLink = localStorage.getItem('activeLink');
        if (activeLink) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === activeLink) {
                    link.classList.add('active');
                }
            });
        } else {
            if (navLinks.length > 0) {
                navLinks[0].classList.add('active');
            }
        }
    };

    const toggleNavOnScroll = () => {
        const currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos || currentScrollPos === 0) {
            header.style.opacity = "1";
            header.style.top = "0";
        } else {
            header.style.opacity = "0";
            header.style.top = `-${header.offsetHeight}px`;
        }
        prevScrollpos = currentScrollPos;
    };

    window.addEventListener('scroll', toggleNavOnScroll);

    handleNavigation(navLinks);
    restoreActiveLink();

    // Función para obtener y actualizar las noticias desde el feed RSS
    const updateNews = async () => {
        try {
            const response = await fetch(`${proxyUrl}${encodeURIComponent(rssFeedUrl)}`);
            const data = await response.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, 'application/xml');
            const items = xml.querySelectorAll('item');

            // Limpiar el contenedor de noticias antes de cargar nuevas noticias
            newsContainer.innerHTML = '';

            // Agregar cada noticia al contenedor
            items.forEach(item => {
                const title = item.querySelector('title').textContent;
                const link = item.querySelector('link').textContent;
                const description = item.querySelector('description').textContent;
                const enclosure = item.querySelector('enclosure');
                const imageUrl = enclosure ? enclosure.getAttribute('url') : 'default-image.jpg';

                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');
                newsItem.innerHTML = `
                    <a href="${link}" target="_blank">
                        <img src="${imageUrl}" alt="${title}">
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </a>
                `;
                newsContainer.appendChild(newsItem);
            });
        } catch (error) {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = '<p>Error fetching news. Please check your network connection.</p>';
        }
    };

    // Cargar noticias al cargar la página
    updateNews();

    // Actualizar las noticias cada 30 minutos
    setInterval(updateNews, 1800000);
});


const newsContainer = document.getElementById('news-container');
const loadMoreButton = document.getElementById('load-more');
let page = 1;

function createNewsItem(news) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item fade-in';
    newsItem.innerHTML = `
        <h3>${news.title}</h3>
        <p>${news.description}</p>
        <a href="/noticia/${news.id}">Leer más</a>
    `;
    return newsItem;
}

function loadNews() {
    // Simula una llamada a la API. Reemplaza esto con tu lógica real de fetch
    fetch(`/api/noticias?page=${page}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(news => {
                const newsItem = createNewsItem(news);
                newsContainer.appendChild(newsItem);
            });
            page++;
            if (data.length < 10) { // Asumiendo que cargamos 10 noticias por página
                loadMoreButton.style.display = 'none';
            }
        })
        .catch(error => console.error('Error:', error));
}

loadMoreButton.addEventListener('click', loadNews);

// Carga inicial de noticias
loadNews();

// Animación de parallax
window.addEventListener('scroll', function() {
    const parallax = document.querySelector('.parallax');
    let scrollPosition = window.pageYOffset;
    parallax.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
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
