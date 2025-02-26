# controllers/log_recorders_controller.py

import os
from flask import request, jsonify
from models import LogRecorders
from utils.crud_operations import insert_values_in_db
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('log_recorders.yml'))
def insert_status():
    """
    Insert new status of recorder in database
    """
    response = insert_values_in_db(request, LogRecorders)
    return jsonify(response), 200

