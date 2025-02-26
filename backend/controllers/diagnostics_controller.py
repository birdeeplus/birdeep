# /controllers/diagnostics_controller.py

from flask import request, jsonify, current_app
from models import Diagnostics
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from
import os

# Obtener la ruta absoluta del archivo de documentación
SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger/diagnostics.yml'))

# Verificar si el archivo YAML existe antes de usarlo
def get_swagger_path():
    return SWAGGER_PATH if os.path.exists(SWAGGER_PATH) else None

@swag_from(get_swagger_path(), methods=['POST'])
def insert_new_diagnostic():
    """
    Insert new diagnostics into the database
    """
    response = insert_values_in_db(request, Diagnostics, current_app.config['TRANSLATION_DIAGNOSTIC_DICT'])
    return jsonify(response), 200

@swag_from(get_swagger_path(), methods=['GET'])
def query_diagnostics():
    """
    Query diagnostics from the database
    """
    response = get_values_from_db(request, Diagnostics)
    return jsonify(response), 200

@swag_from(get_swagger_path(), methods=['PUT'])
def update_diagnostic(id_diagnostic):
    """
    Update a diagnostic entry in the database
    """
    response = update_values_in_db(request, id_diagnostic, Diagnostics)
    return jsonify(response), 200

@swag_from(get_swagger_path(), methods=['DELETE'])
def delete_diagnostic(id_diagnostic):
    """
    Delete a diagnostic entry from the database
    """
    response = delete_values_in_db(id_diagnostic, Diagnostics)
    return jsonify(response), 200
