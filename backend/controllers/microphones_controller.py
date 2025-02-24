# /controllers/microphones_controller.py

import os
from flask import request, jsonify
from models import Recorders, Microphones, Recordings
from models.database import db
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('microphones.yml'))
def insert_new_microphone():
    """
    Insert a new microphone into the database
    """
    response = insert_values_in_db(request, Microphones)
    return jsonify(response), 200

@swag_from(get_swagger_path('microphones.yml'))
def query_microphones():
    """
    Query microphones from the database
    """
    response = get_values_from_db(request, Microphones)
    return jsonify(response), 200

@swag_from(get_swagger_path('microphones.yml'))
def update_microphone(id_microphone):
    """
    Update a microphone entry in the database
    """
    response = update_values_in_db(request, id_microphone, Microphones)
    return jsonify(response), 200

@swag_from(get_swagger_path('microphones.yml'))
def delete_microphone(id_microphone):
    """
    Delete a microphone entry from the database
    """

    # Eliminar grabaciones asociadas a los grabadores que usan el micrófono
    recorders_to_delete = db.session.query(Recorders).filter_by(id_microphone_recorder=id_microphone).all()
    
    for recorder in recorders_to_delete:
        db.session.query(Recordings).filter_by(id_recorder_recordings=recorder.id_recorder).delete()
    
    db.session.commit()

    # Eliminar grabadores asociados al micrófono
    db.session.query(Recorders).filter_by(id_microphone_recorder=id_microphone).delete()
    db.session.commit()

    # Eliminar el micrófono
    response = delete_values_in_db(id_microphone, Microphones)
    return jsonify(response), 200
