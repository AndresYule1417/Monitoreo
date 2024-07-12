from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_mail import Mail, Message
import os
import database as db
from datetime import datetime, timedelta
import secrets
import psycopg2
import psycopg2.extras
import random
import re
import string

app = Flask(__name__, template_folder='templates')


# Configuración de la base de datos PostgreSQL
app.config['POSTGRESQL_HOST'] = 'localhost'
app.config['POSTGRESQL_USER'] = 'postgres'
app.config['POSTGRESQL_PASSWORD'] = '12345'
app.config['POSTGRESQL_DB'] = 'login'
app.config['POSTGRESQL_PORT'] = 5432

# Configuración de la clave secreta
app.secret_key = "tu_clave_secreta"

# Configuración del envío de correo electrónico con Gmail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'afelipey1417@gmail.com'
app.config['MAIL_PASSWORD'] = 'rjwq okzb unip aqdz'
app.config['MAIL_DEFAULT_SENDER'] = 'afelipey1417@gmail.com'
mail = Mail(app)

def get_db_connection():
    """Función para obtener la conexión a la base de datos."""
    conn = psycopg2.connect(
        host=app.config['POSTGRESQL_HOST'],
        database=app.config['POSTGRESQL_DB'],
        user=app.config['POSTGRESQL_USER'],
        password=app.config['POSTGRESQL_PASSWORD'],
        port=app.config['POSTGRESQL_PORT']
    )
    return conn

def generate_token():
    """Función para generar un token seguro."""
    return secrets.token_urlsafe(16)

def generar_contrasena_aleatoria():
    return "random_password"

@app.route('/olvidaste-contrasena', methods=['GET', 'POST'])
def olvidaste_contrasena():
    if request.method == 'POST':
        correo = request.form['correo']
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
        usuario = cur.fetchone()
        
        if usuario:
            # Generar token seguro para el restablecimiento de contraseña
            token = ''.join(random.choices(string.ascii_letters + string.digits, k=20))
            
            # Guardar el token en la base de datos con fecha de expiración
            fecha_expiracion = datetime.now() + timedelta(hours=1)
            cur.execute("INSERT INTO tokens (token, correo, fecha_expiracion) VALUES (%s, %s, %s)", (token, correo, fecha_expiracion))
            conn.commit()
            
            cur.close()
            conn.close()
            
            # Envío del correo electrónico con el enlace de restablecimiento
            reset_url = url_for('reset_password', token=token, _external=True)
            msg = Message('Restablecer Contraseña', recipients=[correo])
            msg.body = f'Haz clic en el siguiente enlace para restablecer tu contraseña:\n\n{reset_url}\n\nEste enlace expirará en 1 hora.'
            mail.send(msg)
            
            flash('Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.', 'success')
            return redirect(url_for('login'))
        else:
            flash('No se encontró ninguna cuenta asociada a este correo electrónico.', 'danger')
            cur.close()
            conn.close()
    
    return render_template('olvidaste_contrasena.html')

# Función para validar la contraseña según criterios específicos
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

@app.route('/restablecer-contrasena/<token>', methods=['GET', 'POST'])
def reset_password(token):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM tokens WHERE token = %s AND fecha_expiracion > NOW()", (token,))
    token_data = cur.fetchone()

    if not token_data:
        cur.close()
        conn.close()
        flash('El enlace de restablecimiento de contraseña no es válido o ha expirado.', 'danger')
        return redirect(url_for('olvidaste_contrasena'))
    
    if request.method == 'POST':
        nueva_contrasena = request.form['nueva_contrasena']
        confirmar_contrasena = request.form['confirmar_contrasena']
        
        if nueva_contrasena != confirmar_contrasena:
            flash('Las contraseñas no coinciden.', 'danger')
            return redirect(url_for('reset_password', token=token))
        
        if not validar_contrasena(nueva_contrasena):
            flash('La contraseña debe tener mínimo 6 caracteres incluyendo al menos una mayúscula, una minúscula, un número y un símbolo.', 'danger')
            return redirect(url_for('reset_password', token=token))
        
        # Actualizar la contraseña sin encriptar
        cur.execute("UPDATE usuarios SET password = %s WHERE correo = %s", (nueva_contrasena, token_data['correo']))
        conn.commit()
        
        cur.execute("DELETE FROM tokens WHERE token = %s", (token,))
        conn.commit()
        
        cur.close()
        conn.close()
        
        flash('Tu contraseña ha sido restablecida correctamente.', 'success')
        return redirect(url_for('login'))
    
    cur.close()
    conn.close()
    return render_template('reset_password.html')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/acceso-login', methods=["GET", "POST"])
def login():
    if request.method == 'POST' and 'txtCorreo' in request.form and 'txtPassword' in request.form:
        _correo = request.form['txtCorreo']
        _password = request.form['txtPassword']

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute('SELECT * FROM usuarios WHERE correo = %s', (_correo,))
        account = cur.fetchone()
        cur.close()
        conn.close()
    
        if account and account['password'] == _password:  # Comparar contraseñas en texto plano
            session['logueado'] = True
            session['id'] = account['id']
            session['id_rol'] = account['id_rol']
            
            if session['id_rol'] == 1:
                return render_template("admin.html")
            elif session['id_rol'] == 2:
                return render_template("usuario.html")
        else:
            flash('Usuario o Contraseña Incorrectas', 'danger')
    
    return render_template('ingresar.html')

@app.route('/registro')
def registro():
    return render_template('registro.html')

@app.route('/crear-registro', methods=["POST"])
def crear_registro():
    correo = request.form.get('txtCorreo')
    password = request.form.get('txtPassword')
    nombre_usuario = request.form.get('txtNombreUsuario')
    confirmacion_contrasena = request.form.get('txtConfirmPassword')
    rol = request.form.get('tipoUsuario')
    
    if not (correo and password and nombre_usuario and confirmacion_contrasena and rol):
        flash('Por favor, complete todos los campos.', 'danger')
        return redirect(url_for('registro'))
    
    if password != confirmacion_contrasena:
        flash('Las contraseñas no coinciden.', 'danger')
        return redirect(url_for('registro'))
    
    if not validar_contrasena(password):
        flash('La contraseña debe tener mínimo 6 caracteres incluyendo al menos una mayúscula, una minúscula, un número y un símbolo.', 'danger')
        return redirect(url_for('registro'))
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Verificar si el correo ya está en uso
    cur.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
    if cur.fetchone():
        flash('Este correo coincide con el de otro usuario. Por favor ingrese otro correo válido.', 'danger')
        cur.close()
        conn.close()
        return redirect(url_for('registro'))
    
    # Insertar nuevo usuario sin hashear la contraseña
    cur.execute("INSERT INTO usuarios (correo, password, nombre_usuario, id_rol) VALUES (%s, %s, %s, %s)", (correo, password, nombre_usuario, rol))
    conn.commit()
    
    cur.close()
    conn.close()
    
    flash('Usuario registrado exitosamente.', 'success')
    return redirect(url_for('login'))

@app.route('/mantenimiento.html')
def mantenimiento():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM usuarios")
    usuarios = cur.fetchall()
    cur.close()
    conn.close()
    return render_template("mantenimiento.html", usuarios=usuarios)

@app.route('/cerrar-sesion.html')
def logout():
    session.pop('logueado', None)
    session.pop('id', None)
    session.pop('id_rol', None)
    flash('Has cerrado sesión correctamente.', 'info')
    return redirect(url_for('login'))

@app.route('/crud')
def crud():
    cursor = db.database.cursor()
    cursor.execute("SELECT * FROM users")
    myresult = cursor.fetchall()
    insertObject = []
    columnNames = [column[0] for column in cursor.description]
    for record in myresult:
        insertObject.append(dict(zip(columnNames, record)))
    cursor.close()
    return render_template('crud.html', data=insertObject)

@app.route('/proyecto/<int:id>')
def proyecto_detail(id):
    cursor = db.database.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
    proyecto = cursor.fetchone()
    if proyecto:
        proyecto_dict = dict(zip([column[0] for column in cursor.description], proyecto))
    else:
        proyecto_dict = None
    cursor.close()
    return render_template('proyecto_detail.html', proyecto=proyecto_dict)

@app.route('/user', methods=['POST'])
def addUser():
    name = request.form['name']
    creation_date = request.form['creation_date']
    if name and creation_date:
        cursor = db.database.cursor()
        sql = "INSERT INTO users (name, creation_date) VALUES (%s, %s)"
        data = (name, creation_date)
        cursor.execute(sql, data)
        db.database.commit()
    return redirect(url_for('crud'))

@app.route('/delete/<string:id>')
def delete(id):
    cursor = db.database.cursor()
    sql = "DELETE FROM users WHERE id=%s"
    data = (id,)
    cursor.execute(sql, data)
    db.database.commit()
    return redirect(url_for('crud'))

@app.route('/edit/<string:id>', methods=['POST'])
def edit(id):
    name = request.form['name']
    creation_date = request.form['creation_date']
    if name and creation_date:
        cursor = db.database.cursor()
        sql = "UPDATE users SET name = %s, creation_date = %s WHERE id = %s"
        data = (name, creation_date, id)
        cursor.execute(sql, data)
        db.database.commit()
    return redirect(url_for('crud'))

@app.route('/search_projects', methods=['GET'])
def search_projects():
    query = request.args.get('query')
    cursor = db.database.cursor()
    cursor.execute("SELECT * FROM users WHERE name ILIKE %s", ('%' + query + '%',))
    myresult = cursor.fetchall()
    insertObject = []
    columnNames = [column[0] for column in cursor.description]
    for record in myresult:
        insertObject.append(dict(zip(columnNames, record)))
    cursor.close()
    return render_template('crud.html', data=insertObject)

if __name__ == '__main__':
    app.run(debug=True)
