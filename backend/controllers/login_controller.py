# controllers/login_controller.py

import os
from flask import request, jsonify, current_app
from flask_jwt_extended import create_access_token
from utils.autentication import jwt_token_creation  
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('login.yml'))
def login():
    """
    User login endpoint - Generates JWT Token
    """
    valid_user = current_app.config['JWT_USER']
    valid_password = current_app.config['JWT_PASSWORD']
    
    token = jwt_token_creation(request, valid_user, valid_password)
    
    if token['code'] == 200:
        # Aquí estamos agregando la lógica para verificar si el usuario es admin.
        # En este caso, lo estamos configurando estáticamente (puedes cambiar esto según tu lógica).
        is_admin = True if valid_user == "BirdeepAdmin" else False  # Cambiar según tu lógica
        
        # Responder con el token y la información sobre el rol (si es admin o no)
        return jsonify(access_token=token['token'], is_admin=is_admin), 200
    else:
        return jsonify(message=token['message']), token['code']
