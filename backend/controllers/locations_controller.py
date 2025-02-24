#/controllers/locations_controller.py

import os
from flask import request, jsonify
from models import Locations
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('locations.yml'), methods=['POST'])
def insert_new_location():
    """
    Insert a new location into the database
    """
    response = insert_values_in_db(request, Locations)
    return jsonify(response), 200

@swag_from(get_swagger_path('locations.yml'), methods=['GET'])
def query_locations():
    """
    Query locations from the database
    """
    response = get_values_from_db(request, Locations)
    return jsonify(response), 200

@swag_from(get_swagger_path('locations.yml'), methods=['PUT'])
def update_location(id_location):
    """
    Update a location entry in the database
    """
    response = update_values_in_db(request, id_location, Locations)
    return jsonify(response), 200

@swag_from(get_swagger_path('locations.yml'), methods=['DELETE'])
def delete_location(id_location):
    """
    Delete a location entry from the database
    """
    response = delete_values_in_db(id_location, Locations)
    return jsonify(response), 200

