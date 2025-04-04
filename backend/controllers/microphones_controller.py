# /controllers/microphones_controller.py

import os
from flask import request, jsonify
from models import Recorders, Microphones, Recordings
from models.database import db
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from
from pprint import pprint
from flask import jsonify


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
    try:
        # Extraer datos de la solicitud JSON
        data = request.get_json()

        # Validar los datos entrantes
        if 'model_microphone' not in data:
            return jsonify({"error": "model_microphone is required"}), 400

        # Si id_recorder es null, no asignarlo
        id_recorder = data.get('id_recorder', None)
        
        # Crear una nueva instancia de Microphones
        new_microphone = Microphones(
            model_microphone=data['model_microphone'],
            comment_microphone=data.get('comment_microphone')  # Este campo es opcional
        )

        # Si id_recorder no es null, asociarlo con el micrófono
        if id_recorder is not None:
            new_microphone.id_recorder = id_recorder

        # Agregar el nuevo micrófono a la base de datos
        db.session.add(new_microphone)
        db.session.commit()

        # Devolver una respuesta con los datos del nuevo micrófono
        return jsonify({
            "id_microphone": new_microphone.id_microphone,
            "model_microphone": new_microphone.model_microphone,
            "comment_microphone": new_microphone.comment_microphone,
            "id_recorder": new_microphone.id_recorder  # Incluimos id_recorder en la respuesta
        }), 201

    except Exception as e:
        print(f"Error inserting microphone: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500



@swag_from(get_swagger_path('microphones.yml'))
def query_microphones():
    """
    Query microphones from the database
    """
    response = (
        db.session.query(
            Microphones.id_microphone,
            Microphones.model_microphone,
            Microphones.comment_microphone,
            Recorders.id_recorder  # Agregamos el id_recorder
        )
        .join(Recorders, Recorders.id_microphone_recorder == Microphones.id_microphone)
        .all()
    )

    # Convertimos los resultados en una lista de diccionarios
    data = [
        {
            "id_microphone": mic.id_microphone,
            "model_microphone": mic.model_microphone,
            "comment_microphone": mic.comment_microphone,
            "id_recorder": mic.id_recorder,  # Ahora incluimos el id_recorder
        }
        for mic in response
    ]

    return jsonify(data), 200



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