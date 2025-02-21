# Monitoreo Hídrico - Tolima

## Descripción
Este proyecto es una aplicación web desarrollada con Django y Angular para el monitoreo del recurso hídrico en el departamento del Tolima. Permite la recolección, análisis y visualización de datos hídricos en tiempo real, utilizando una base de datos PostgreSQL para el almacenamiento eficiente de la información.

## Tecnologías Utilizadas
- **Backend:** Django (Python)
- **Frontend:** Angular (TypeScript)
- **Base de Datos:** PostgreSQL
- **Despliegue:** Docker (opcional), Nginx, Gunicorn

## Instalación y Configuración
### Requisitos Previos
Antes de ejecutar el proyecto, asegúrate de tener instalados:
- Python 3.9+
- Node.js 18+
- PostgreSQL
- Angular CLI
- Git

### Clonar el Repositorio
```sh
 git clone https://github.com/AndresYule1417/Monitoreo.git
 cd Monitoreo
```

### Configuración del Backend (Django)
1. Crear y activar un entorno virtual:
```sh
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```
2. Instalar las dependencias:
```sh
pip install -r requirements.txt
```
3. Configurar las variables de entorno en `.env`:
```ini
SECRET_KEY=tu_secreto
DEBUG=True
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/monitoreo_db
```
4. Aplicar migraciones y ejecutar el servidor:
```sh
python manage.py migrate
python manage.py runserver
```

### Configuración del Frontend (Angular)
1. Instalar las dependencias:
```sh
cd Monitoreo_V3/client_rendimiento_hidrico
npm install
```
2. Ejecutar la aplicación:
```sh
ng serve
```

## Uso
- Accede al frontend en `http://localhost:4200`
- La API de Django estará disponible en `http://localhost:8000/api/`

## Contribución
1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature-nueva`)
3. Realiza tus cambios y haz commit (`git commit -m 'Descripción'`)
4. Envía tus cambios (`git push origin feature-nueva`)
5. Crea un pull request

## Licencia
Este proyecto está bajo la licencia MIT.
