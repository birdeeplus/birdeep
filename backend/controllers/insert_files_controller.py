# /controllers/insert_files_controller.py

import os
import json
from flask import request, jsonify
from models import Recordings
from utils.crud_operations import save_files_in_storage
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('insert_files.yml'), methods=['POST'])
def insert_files():
    """
    Insert new files in the database and store them in internal storage
    """
    json_data = json.loads(request.form.get('json_data'))
    files = request.files
    db_object = Recordings
    
    response = save_files_in_storage(json_data, files, db_object)
    return jsonify(response), 200
