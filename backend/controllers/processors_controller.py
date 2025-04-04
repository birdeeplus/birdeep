# /controllers/processors_controller.py

import os
from flask import request, jsonify
from models import Processors, Recorders, Recordings
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from
from models.database import db

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('processors.yml'))
def insert_new_processor():
    """
    Insert a new processor into the database
    """
    response = insert_values_in_db(request, Processors)
    return jsonify(response), 200

@swag_from(get_swagger_path('processors.yml'))
def query_processors():
    """
    Query processors from the database, including their associated recorder ID.
    """
    response = (
        db.session.query(
            Processors.id_processor,
            Processors.model_processor,
            Processors.comment_processor,
            Recorders.id_recorder  # Agregamos el id_recorder
        )
        .join(Recorders, Recorders.id_processor_recorder == Processors.id_processor)
        .all()
    )

    # Convertimos los resultados en una lista de diccionarios
    data = [
        {
            "id_processor": proc.id_processor,
            "model_processor": proc.model_processor,
            "comment_processor": proc.comment_processor,
            "id_recorder": proc.id_recorder,  # Ahora incluimos el id_recorder
        }
        for proc in response
    ]

    return jsonify(data), 200


@swag_from(get_swagger_path('processors.yml'))
def update_processor(id_processor):
    """
    Update a processor entry in the database
    """
    response = update_values_in_db(request, id_processor, Processors)
    return jsonify(response), 200

@swag_from(get_swagger_path('processors.yml'))
def delete_processor(id_processor):
    """
    Delete a processor entry from the database.
    """

    # Eliminar las grabaciones asociadas a los recorders que dependen del processor
    recorders = db.session.query(Recorders).filter_by(id_processor_recorder=id_processor).all()

    for recorder in recorders:
        db.session.query(Recordings).filter_by(id_recorder_recordings=recorder.id_recorder).delete()

    # Ahora eliminamos los recorders asociados al processor
    db.session.query(Recorders).filter_by(id_processor_recorder=id_processor).delete()

    # Finalmente, eliminamos el processor
    response = delete_values_in_db(id_processor, Processors)
    
    db.session.commit()
    return jsonify(response), 200

