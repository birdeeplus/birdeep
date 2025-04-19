# /controllers/microphones_controller.py

import os
from flask import request, jsonify
from models import Recorders, Microphones, Recordings
from models.database import db
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from pprint import pprint
from flask import jsonify


def insert_new_microphone():
    """
    Insert a new microphone into the database
    
    This endpoint allows the insertion of a new microphone into the database.
    It expects the microphone model to be provided in the request body.
    If provided, the microphone is saved into the database. If an optional recorder ID is provided,
    the microphone is associated with that recorder.
    
    Returns:
        JSON response containing the newly created microphone data.
    """

    try:
        # Extract data from the incoming JSON request
        data = request.get_json()

        # Validate the incoming data to ensure the 'model_microphone' is provided
        if 'model_microphone' not in data:
            return jsonify({"error": "model_microphone is required"}), 400

        # If 'id_recorder' is not provided, default it to None
        id_recorder = data.get('id_recorder', None)
        
        # Create a new instance of the Microphones model
        new_microphone = Microphones(
            model_microphone=data['model_microphone'],
            comment_microphone=data.get('comment_microphone')  # This field is optional
        )

        # If an 'id_recorder' is provided, associate it with the new microphone
        if id_recorder is not None:
            new_microphone.id_recorder = id_recorder

        # Add the new microphone to the database and commit the transaction
        db.session.add(new_microphone)
        db.session.commit()

        # Return a response with the details of the newly created microphone
        return jsonify({
            "id_microphone": new_microphone.id_microphone,
            "model_microphone": new_microphone.model_microphone,
            "comment_microphone": new_microphone.comment_microphone,
            "id_recorder": new_microphone.id_recorder  # Include the recorder ID in the response
        }), 201

    except Exception as e:
        # If an error occurs, print the exception and roll back the transaction
        print(f"Error inserting microphone: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


def query_microphones():
    """
    Fetch all microphones, including their associated recorder ID (if any).
    """

    response = (
        db.session.query(
            Microphones.id_microphone,
            Microphones.model_microphone,
            Microphones.comment_microphone,
            Recorders.id_recorder
        )
        .outerjoin(Recorders, Recorders.id_microphone_recorder == Microphones.id_microphone)
        .all()
    )

    data = [
        {
            "id_microphone": mic.id_microphone,
            "model_microphone": mic.model_microphone,
            "comment_microphone": mic.comment_microphone,
            "id_recorder": mic.id_recorder  # Puede ser None
        }
        for mic in response
    ]

    return jsonify(data), 200


def update_microphone(id_microphone):
    """
    Update a microphone entry in the database
    
    This endpoint allows updating an existing microphone based on its ID.
    It uses the helper function 'update_values_in_db' to handle the update operation.
    
    Args:
        id_microphone (int): The ID of the microphone to be updated.
    
    Returns:
        JSON response containing the updated microphone data.
    """

    try:
        data = request.get_json()

        # 1. Actualizar la tabla de micrófonos
        microphone = db.session.query(Microphones).filter_by(id_microphone=id_microphone).first()

        if not microphone:
            return jsonify({"error": "Microphone not found"}), 404

        if 'model_microphone' in data:
            microphone.model_microphone = data['model_microphone']

        if 'comment_microphone' in data:
            microphone.comment_microphone = data['comment_microphone']

        # 2. Si se envía un nuevo id_recorder, actualizamos la tabla recorders
        if 'id_recorder' in data:
            # Primero, eliminar la asignación anterior (si existe)
            current_recorder = db.session.query(Recorders).filter_by(id_microphone_recorder=id_microphone).first()
            if current_recorder:
                current_recorder.id_microphone_recorder = None

            # Asignar el micrófono al nuevo recorder
            if data['id_recorder'] is not None and data['id_recorder'] != "":
                new_recorder = db.session.query(Recorders).filter_by(id_recorder=data['id_recorder']).first()
                if new_recorder:
                    new_recorder.id_microphone_recorder = id_microphone
                else:
                    return jsonify({"error": "Recorder not found"}), 404

        db.session.commit()

        return jsonify({
            "id_microphone": microphone.id_microphone,
            "model_microphone": microphone.model_microphone,
            "comment_microphone": microphone.comment_microphone,
            "id_recorder": data.get('id_recorder', None)
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating microphone: {e}")
        return jsonify({"error": "Internal server error"}), 500


def delete_microphone(id_microphone):
    """
    Delete a microphone entry from the database
    
    This endpoint deletes a microphone from the database along with any associated recorders and recordings.
    It first removes the recordings associated with the recorder, then removes the recorder, and finally deletes the microphone.
    
    Args:
        id_microphone (int): The ID of the microphone to be deleted.
    
    Returns:
        JSON response confirming the deletion.
    """

    # Delete the recordings associated with the recorders that use this microphone
    recorders_to_delete = db.session.query(Recorders).filter_by(id_microphone_recorder=id_microphone).all()
    
    # Delete associated recordings for each recorder
    for recorder in recorders_to_delete:
        db.session.query(Recordings).filter_by(id_recorder_recordings=recorder.id_recorder).delete()
    
    db.session.commit() # Commit changes after deleting recordings

    # Delete the recorders associated with the microphone
    db.session.query(Recorders).filter_by(id_microphone_recorder=id_microphone).delete()
    db.session.commit()

    # Delete the microphone itself
    response = delete_values_in_db(id_microphone, Microphones)
    return jsonify(response), 200