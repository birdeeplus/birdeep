# /controllers/species_controller.py

import os
from flask import request, jsonify
from models import Species
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('species.yml'))
def insert_new_specie():
    """
    Insert a new species into the database
    """
    response = insert_values_in_db(request, Species)
    return jsonify(response), 200

@swag_from(get_swagger_path('species.yml'))
def query_species():
    """
    Query species from the database
    """
    response = get_values_from_db(request, Species)
    return jsonify(response), 200

@swag_from(get_swagger_path('species.yml'))
def update_specie(id_specie):
    """
    Update a species entry in the database, ensuring it exists
    """
    specie = Species.query.get(id_specie)
    if not specie:
        return jsonify({"error": "Especie no encontrada"}), 404

    response = update_values_in_db(request, id_specie, Species)

    if isinstance(response, dict):  
        return jsonify(response), 200
    else:
        return jsonify({"error": "Error inesperado al actualizar"}), 500

@swag_from(get_swagger_path('species.yml'))
def delete_specie(id_specie):
    """
    Delete a species entry from the database, ensuring it exists
    """
    specie = Species.query.get(id_specie)
    if not specie:
        return jsonify({"error": "Especie no encontrada"}), 404

    response = delete_values_in_db(id_specie, Species)

    if isinstance(response, dict):  
        return jsonify(response), 200
    else:
        return jsonify({"error": "Error inesperado al eliminar"}), 500

