# /controllers/recordings_controller.py

import os
from flask import request, jsonify
from models import Recordings, Recorders
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db, get_values_from_db_paginacion
from flasgger import swag_from
from models.database import db
from sqlalchemy import and_

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

"""usando paginacion"""

def query_recordings_paginacion():
    """
    Query recordings from the database with pagination
    """
    # Obtener los parámetros de la consulta para la paginación
    page = int(request.args.get('page', 1))  # Página por defecto es 1
    per_page = int(request.args.get('per_page', 10))  # Número de elementos por página

    # Realizar la consulta con paginación
    offset = (page - 1) * per_page
    limit = per_page

    # Usamos un método que te permita paginar los resultados
    response = get_values_from_db_paginacion(request, Recordings, offset=offset, limit=limit)

    # Actualizamos las URIs para que apunten a la ruta que Flask sirve
    for recording in response:
        recording["uri"] = f"http://localhost:8080/static{recording['uri']}"

    return jsonify(response), 200


def query_recordings_paginacion_con_filtros():
    """
    Query recordings with filters and pagination
    """
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    offset = (page - 1) * per_page
    limit = per_page

    # Filtros opcionales
    hora_inicio = request.args.get("hora_inicio")
    hora_fin = request.args.get("hora_fin")
    fecha_inicio = request.args.get("fecha_inicio")
    fecha_fin = request.args.get("fecha_fin")
    id_location = request.args.get("id_location")

    query = db.session.query(Recordings)

    # Aplicar filtros
    filters = []

    if fecha_inicio:
        filters.append(Recordings.time_record >= f"{fecha_inicio} 00:00:00")
    if fecha_fin:
        filters.append(Recordings.time_record <= f"{fecha_fin} 23:59:59")
    if hora_inicio:
        filters.append(db.func.time(Recordings.time_record) >= hora_inicio)
    if hora_fin:
        filters.append(db.func.time(Recordings.time_record) <= hora_fin)
    if id_location:
        filters.append(Recordings.device == id_location)

    if filters:
        query = query.filter(and_(*filters))

    total_count = query.count()

    results = query.order_by(Recordings.time_record.desc()).offset(offset).limit(limit).all()

    # Serializar resultados
    data = []
    for recording in results:
        data.append({
            "id_record": recording.id_record,
            "id_recorder_recordings": recording.id_recorder_recordings,
            "time_record": recording.time_record,
            "filetype_record": recording.filetype_record,
            "bitrate_record": recording.bitrate_record,
            "sample_rate_record": recording.sample_rate_record,
            "gain_record": recording.gain_record,
            "duration_record": recording.duration_record,
            "uri": f"http://localhost:8080/static{recording.uri}",
            "device": recording.device,
            "filename": recording.filename
        })

    return jsonify({
        "results": data,
        "total": total_count
    }), 200


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
