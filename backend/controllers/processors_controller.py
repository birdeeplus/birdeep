# /controllers/processors_controller.py

import os
from flask import request, jsonify
from models import Recorders, Processors, Recordings
from models.database import db
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from pprint import pprint
from flask import jsonify


def insert_new_processor():
    """
    Insert a new processor into the database
    
    This endpoint allows the insertion of a new processor into the database.
    It expects the processor model to be provided in the request body.
    If provided, the processor is saved into the database. If an optional recorder ID is provided,
    the processor is associated with that recorder.
    
    Returns:
        JSON response containing the newly created processor data.
    """

    try:
        # Extract data from the incoming JSON request
        data = request.get_json()

        # Validate the incoming data to ensure the 'model_processor' is provided
        if 'model_processor' not in data:
            return jsonify({"error": "model_processor is required"}), 400

        # If 'id_recorder' is not provided, default it to None
        id_recorder = data.get('id_recorder', None)
        
        # Create a new instance of the Processors model
        new_processor = Processors(
            model_processor=data['model_processor'],
            comment_processor=data.get('comment_processor')  # This field is optional
        )

        # If an 'id_recorder' is provided, associate it with the new processor
        if id_recorder is not None:
            new_processor.id_recorder = id_recorder

        # Add the new processor to the database and commit the transaction
        db.session.add(new_processor)
        db.session.commit()

        # Return a response with the details of the newly created processor
        return jsonify({
            "id_processor": new_processor.id_processor,
            "model_processor": new_processor.model_processor,
            "comment_processor": new_processor.comment_processor,
            "id_recorder": new_processor.id_recorder  # Include the recorder ID in the response
        }), 201

    except Exception as e:
        # If an error occurs, print the exception and roll back the transaction
        print(f"Error inserting processor: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


def query_processors():
    """
    Fetch all processors, including their associated recorder ID (if any).
    """

    response = (
        db.session.query(
            Processors.id_processor,
            Processors.model_processor,
            Processors.comment_processor,
            Recorders.id_recorder
        )
        .outerjoin(Recorders, Recorders.id_processor_recorder == Processors.id_processor)
        .all()
    )

    data = [
        {
            "id_processor": proc.id_processor,
            "model_processor": proc.model_processor,
            "comment_processor": proc.comment_processor,
            "id_recorder": proc.id_recorder  # Puede ser None
        }
        for proc in response
    ]

    return jsonify(data), 200



def update_processor(id_processor):
    """
    Update a processor entry in the database
    
    This endpoint allows updating an existing processor based on its ID.
    It uses the helper function 'update_values_in_db' to handle the update operation.
    
    Args:
        id_processor (int): The ID of the processor to be updated.
    
    Returns:
        JSON response containing the updated processor data.
    """

    try:
        data = request.get_json()

        # 1. Actualizar la tabla de micrófonos
        processor = db.session.query(Processors).filter_by(id_processor=id_processor).first()

        if not processor:
            return jsonify({"error": "Processor not found"}), 404

        if 'model_processor' in data:
            processor.model_processor = data['model_processor']

        if 'comment_processor' in data:
            processor.comment_processor = data['comment_processor']

        # 2. Si se envía un nuevo id_recorder, actualizamos la tabla recorders
        if 'id_recorder' in data:
            # Primero, eliminar la asignación anterior (si existe)
            current_recorder = db.session.query(Recorders).filter_by(id_processor_recorder=id_processor).first()
            if current_recorder:
                current_recorder.id_processor_recorder = None

            # Asignar el procesador al nuevo recorder
            if data['id_recorder'] is not None and data['id_recorder'] != "":
                new_recorder = db.session.query(Recorders).filter_by(id_recorder=data['id_recorder']).first()
                if new_recorder:
                    new_recorder.id_processor_recorder = id_processor
                else:
                    return jsonify({"error": "Recorder not found"}), 404

        db.session.commit()

        return jsonify({
            "id_processor": processor.id_processor,
            "model_processor": processor.model_processor,
            "comment_processor": processor.comment_processor,
            "id_recorder": data.get('id_recorder', None)
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating processor: {e}")
        return jsonify({"error": "Internal server error"}), 500
    

def delete_processor(id_processor):
    """
    Delete a processor entry from the database
    
    This endpoint deletes a processor from the database along with any associated recorders and recordings.
    It first removes the recordings associated with the recorder, then removes the recorder, and finally deletes the processor.
    
    Args:
        id_processor (int): The ID of the processor to be deleted.
    
    Returns:
        JSON response confirming the deletion.
    """

    # Delete the recordings associated with the recorders that use this processor
    recorders_to_delete = db.session.query(Recorders).filter_by(id_processor_recorder=id_processor).all()
    
    # Delete associated recordings for each recorder
    for recorder in recorders_to_delete:
        db.session.query(Recordings).filter_by(id_recorder_recordings=recorder.id_recorder).delete()
    
    db.session.commit() # Commit changes after deleting recordings

    # Delete the recorders associated with the processor
    db.session.query(Recorders).filter_by(id_processor_recorder=id_processor).delete()
    db.session.commit()

    # Delete the processor itself
    response = delete_values_in_db(id_processor, Processors)
    return jsonify(response), 200