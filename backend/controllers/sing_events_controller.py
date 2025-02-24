# /controllers/sing_events_controller.py

import os
from flask import request, jsonify
from models import SingEvents
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('sing_events.yml'))
def insert_new_sing_event():
    """
    Insert a new sing event into the database
    """
    response = insert_values_in_db(request, SingEvents)
    return jsonify(response), 200

@swag_from(get_swagger_path('sing_events.yml'))
def query_sing_events():
    """
    Query sing events from the database
    """
    response = get_values_from_db(request, SingEvents)
    return jsonify(response), 200

@swag_from(get_swagger_path('sing_events.yml'))
def update_sing_event(id_event):
    """
    Update a sing event entry in the database
    """
    response = update_values_in_db(request, id_event, SingEvents)
    return jsonify(response), 200

@swag_from(get_swagger_path('sing_events.yml'))
def delete_sing_event(id_event):
    """
    Delete a sing event entry from the database
    """
    response = delete_values_in_db(id_event, SingEvents)
    return jsonify(response), 200

