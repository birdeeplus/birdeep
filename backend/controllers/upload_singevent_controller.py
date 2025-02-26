# /controllers/upload_singevent_controller.py

import os
from flask import request, jsonify
from models import SingEvents, Diagnostics, Recordings
from utils.crud_operations import insert_in_singevent
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('upload_singevent.yml'))
def upload_folder():
    """
    Insert new sing events into the database
    """
    response = insert_in_singevent(request, SingEvents, Diagnostics, Recordings)
    return jsonify(response), 200
