#*****CDBL-JB*****
import os
from pathlib import Path

import random
import string

BASE_DIR = Path(__file__).resolve().parent.parent #variable q almacena la base del directorio raiz
myPath = os.path.join(BASE_DIR, 'Monitoreo', 'media') #variable que almacena eldirectorio donde se guardan los archivos

def save_file(file, filename, folder):  #funcion para guardar archivos parametros: archivo, nombre del archivo, carpeta
    if not os.path.exists(myPath):  #si no existe el directorio, crea el directorio
        os.makedirs(myPath)
    
    path_folder = os.path.join(myPath, folder)  #variable con el nuevo directorio, si no exsite crea la carpeta
    if not os.path.exists(path_folder):
        os.makedirs(path_folder)

    path_file = path_folder + "/" + filename   #variable completa con el directorio y nombre del archivo
    if(os.path.exists(path_file)):  #si el archivo ya existe en la carpeta se crea una secuencia de letras aleatorias y la concatena con el nombre existente
        str = get_random_string(12) #llamada a funcion para crear secuencia de letras aleatorias
        filename = str + "_" + filename 
        path_file = path_folder + "/" + filename
        file.save(path_file) #guarda el archivo con el nombre nuevo
        return folder + "/" + filename #retorna el nombre del archivo
    else:    #si no existe guarda con el nombre que llega en la variable filename
        file.save(path_file)   
        return folder + "/" + filename  #retorna el nombre del archivo

def delete_file():
    pass

def get_random_string(length):  #funcion que quegenra secuencia de letras aleatorias
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str