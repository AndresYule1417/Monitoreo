import re

def validar_contrasena(password):
    if len(password) < 6:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[ !\"#$%&'()*+,-./[\\\]^_`{|}~]", password):
        return False
    return True
