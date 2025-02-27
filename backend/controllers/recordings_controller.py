# /controllers/recordings_controller.py

import os
from flask import request, jsonify
from models import Recordings, Recorders
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from
from models.database import db

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('recordings.yml'))
def insert_new_recording():
    """
    Insert a new recording into the database, ensuring the recorder exists
    """
    data = request.get_json()

    # Verificar si el recorder existe
    recorder_id = data.get("id_recorder_recordings")
    recorder = Recorders.query.get(recorder_id)
    
    if not recorder:
        return jsonify({"error": "Recorder no encontrado"}), 400

    response = insert_values_in_db(request, Recordings)
    return jsonify(response), 200

@swag_from(get_swagger_path('recordings.yml'))
def query_recordings():
    """
    Query recordings from the database
    """
    response = get_values_from_db(request, Recordings)

    # Actualizamos las URIs para que apunten a la ruta que Flask sirve
    for recording in response:
        recording["uri"] = f"http://localhost:8080/static{recording['uri']}"
    
    return jsonify(response), 200

@swag_from(get_swagger_path('recordings.yml'))
def update_recording(id_record):
    """
    Update a recording entry in the database, ensuring the recording and recorder exist
    """
    data = request.get_json()

    # Verificar si la grabación existe
    recording = db.session.get(Recordings, id_record)
    if not recording:
        return jsonify({"error": "Recording no encontrado"}), 404

    # Verificar si el recorder asociado existe
    recorder_id = data.get("id_recorder_recordings")
    recorder = db.session.get(Recorders, recorder_id)  
    if not recorder:
        return jsonify({"error": "Recorder no encontrado"}), 400

    response = update_values_in_db(request, id_record, Recordings)
    return jsonify(response), 200

@swag_from(get_swagger_path('recordings.yml'))
def delete_recording(id_record):
    """
    Delete a recording entry from the database
    """
    response = delete_values_in_db(id_record, Recordings)
    return jsonify(response), 200

@swag_from(get_swagger_path('recordings.yml'))
def get_recording_by_id(id_record):
    """
    get a recording entry from the database
    """
    recording = Recordings.query.get(id_record)  

    if recording is None:
        return jsonify({"error": "Recording not found"}), 404 
    
    return jsonify({
        "id_record": recording.id_record,  
        "id_recorder_recordings": recording.id_recorder_recordings,
        "time_record": recording.time_record,
        "filetype_record": recording.filetype_record,
        "bitrate_record": recording.bitrate_record,
        "sample_rate_record": recording.sample_rate_record,
        "gain_record": recording.bitrate_record,
        "duration_record": recording.duration_record,
        "uri": recording.uri,
        "device": recording.device,
        "filename": recording.filename
    }), 200  # Devuelve un código de éxito 200
