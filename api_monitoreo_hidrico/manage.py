import os
import sys

#Funcion principal para poder manejar desde la consola los comandos de:
#python manage.py migrate
#python manage.py makemigrations
#python manage.py runserver

def main():    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_monitoreo_hidrico.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
