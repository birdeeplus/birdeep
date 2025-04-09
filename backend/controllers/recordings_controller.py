# /controllers/recordings_controller.py

import os
from flask import request, jsonify
from models import Recordings, Recorders
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db, get_values_from_db_paginacion
from models.database import db
from sqlalchemy import and_

def insert_new_recording():
    """
    Insert a new recording into the database, ensuring the recorder exists.

    This function receives a POST request with data for a new recording,
    checks if the associated recorder exists, and inserts the recording data into the database.
    If the recorder is not found, it returns an error response. 
    The response is returned with the result of the insertion.
    """

    data = request.get_json()

    # Verify if the recorder exists
    recorder_id = data.get("id_recorder_recordings")
    recorder = Recorders.query.get(recorder_id)
    
    if not recorder:
        return jsonify({"error": "Recorder no encontrado"}), 400

    # Insert the new recording into the Recordings table using the insert_values_in_db function
    response = insert_values_in_db(request, Recordings)
    
    # Return a JSON response with the result of the insertion
    return jsonify(response), 200

def query_recordings():
    """
    Query recordings from the database.

    This function retrieves all recordings from the database.
    It returns the result as a JSON response and updates the URIs for each recording to point to the correct Flask route.
    """

    response = get_values_from_db(request, Recordings)

    # Update the URIs for each recording to point to the correct Flask route
    for recording in response:
        recording["uri"] = f"http://localhost:8080/static{recording['uri']}"
    
    return jsonify(response), 200

def query_recordings_paginacion():
    """
    Query recordings from the database with pagination.

    This function retrieves recordings from the database in a paginated format.
    It uses the `page` and `per_page` query parameters to calculate the offset and limit for the pagination.
    The result is returned as a JSON response.
    """

    # Obtain the page and per_page parameters from the request
    page = int(request.args.get('page', 1))  # Default to page 1 if not provided
    per_page = int(request.args.get('per_page', 10))  # Number of items per page, default to 10 if not provided

    # Calculate the offset and limit for pagination
    offset = (page - 1) * per_page
    limit = per_page

    # Query the database for recordings with pagination
    response = get_values_from_db_paginacion(request, Recordings, offset=offset, limit=limit)

    # Update the URIs for each recording to point to the correct Flask route
    for recording in response:
        recording["uri"] = f"http://localhost:8080/static{recording['uri']}"

    return jsonify(response), 200

def query_recordings_paginacion_con_filtros():
    """
    Query recordings with filters and pagination.

    This function retrieves recordings from the database with both filters and pagination.
    The filters are applied based on various query parameters such as time range, filename, and location ID.
    The result is returned as a JSON response with total count and paginated results.
    """

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    offset = (page - 1) * per_page
    limit = per_page

    # Optinal filters
    hora_inicio = request.args.get("hora_inicio")
    hora_fin = request.args.get("hora_fin")
    fecha_inicio = request.args.get("fecha_inicio")
    fecha_fin = request.args.get("fecha_fin")
    id_location = request.args.get("id_location")
    filename = request.args.get("filename") 
    
    query = db.session.query(Recordings)

    # Aply filters
    filters = []

    if fecha_inicio:
        filters.append(Recordings.time_record >= f"{fecha_inicio} 00:00:00")
    if fecha_fin:
        filters.append(Recordings.time_record <= f"{fecha_fin} 23:59:59")
    if hora_inicio:
        filters.append(db.func.time(Recordings.time_record) >= hora_inicio)
    if hora_fin:
        filters.append(db.func.time(Recordings.time_record) <= hora_fin)
    if filename:
        filters.append(Recordings.filename.ilike(f"%{filename}%"))
    if id_location:
        recorder_ids = db.session.query(Recorders.id_recorder).filter(
            Recorders.id_location_recorder == id_location
        ).all()

        # Extract the recorder IDs from the list of tuples
        recorder_ids = [r[0] for r in recorder_ids]

        if not recorder_ids:
            # If no recorder IDs are found, return an empty result
            return jsonify({"results": [], "total": 0}), 200

        # Filter recordings by the recorder IDs
        filters.append(Recordings.id_recorder_recordings.in_(recorder_ids))

    # Apply filters to the query
    if filters:
        query = query.filter(and_(*filters))

    total_count = query.count()

    # Apply pagination
    results = query.order_by(Recordings.time_record.desc()).offset(offset).limit(limit).all()

    # Serialize the results
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


def update_recording(id_record):
    """
    Update a recording entry in the database, ensuring the recording and recorder exist.

    This function receives a PUT request with updated data for an existing recording,
    checks if the recording and the associated recorder exist, and updates the recording data.
    The response is returned with the result of the update.
    """

    data = request.get_json()

    # Verify if the recording exists
    recording = db.session.get(Recordings, id_record)
    if not recording:
        return jsonify({"error": "Recording no encontrado"}), 404

    # Verify if the asociated recorder exists
    recorder_id = data.get("id_recorder_recordings")
    recorder = db.session.get(Recorders, recorder_id)  
    if not recorder:
        return jsonify({"error": "Recorder no encontrado"}), 400

    # Update the recording using the update_values_in_db function
    response = update_values_in_db(request, id_record, Recordings)
    
    # Return a JSON response with the result of the update
    return jsonify(response), 200

def delete_recording(id_record):
    """
    Delete a recording entry from the database.

    This function deletes a recording entry from the database and returns a response with the result of the deletion.
    """

    # Delete the recording from the Recordings table using the delete_values_in_db function
    response = delete_values_in_db(id_record, Recordings)
    
    # Return a JSON response with the result of the deletion
    return jsonify(response), 200

def get_recording_by_id(id_record):
    """
    Get a recording entry from the database.

    This function retrieves a specific recording by its ID from the database.
    If the recording is found, it returns the details as a JSON response.
    If the recording is not found, it returns a 404 error response.
    """

    # Fetch the recording by its ID from the Recordings table
    recording = Recordings.query.get(id_record)  

    if recording is None:
        # If recording not found, return a 404 error
        return jsonify({"error": "Recording not found"}), 404 
    
    # Return the recording details as a JSON response
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
    }), 200 
