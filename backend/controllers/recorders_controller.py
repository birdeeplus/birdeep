#/controllers/recorders_controller.py

import os
from flask import request, jsonify
from models import Recorders
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('recorders.yml'))
def insert_new_recorder():
    """
    Insert a new recorder into the database
    """
    response = insert_values_in_db(request, Recorders)
    return jsonify(response), 200

@swag_from(get_swagger_path('recorders.yml'))
def query_recorders():
    """
    Query recorders from the database
    """
    response = get_values_from_db(request, Recorders)
    return jsonify(response), 200

@swag_from(get_swagger_path('recorders.yml'))
def update_recorder(id_recorder):
    """
    Update a recorder entry in the database
    """
    response = update_values_in_db(request, id_recorder, Recorders)
    return jsonify(response), 200

@swag_from(get_swagger_path('recorders.yml'))
def delete_recorder(id_recorder):
    """
    Delete a recorder entry from the database
    """
    response = delete_values_in_db(id_recorder, Recorders)
    return jsonify(response), 200
