# /controllers/processors_controller.py

import os
from flask import request, jsonify
from models import Processors, Recorders, Recordings
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from models.database import db

def insert_new_processor():
    """
    Insert a new processor into the database.

    This function receives a POST request with data for a new processor.
    It calls a utility function to insert the processor data into the database and returns a response.
    """

    # Insert the new processor into the database using the insert_values_in_db function
    response = insert_values_in_db(request, Processors)

    # Return a JSON response with the result of the insertion
    return jsonify(response), 200

def query_processors():
    """
    Query processors from the database, including their associated recorder ID.

    This function queries the database for processors and joins the Recorders table to get the recorder ID.
    It returns the processor data along with the recorder ID in a JSON response.
    """

    response = (
        db.session.query(
            Processors.id_processor,
            Processors.model_processor,
            Processors.comment_processor,
            Recorders.id_recorder  # Include the recorder ID
        )
        .join(Recorders, Recorders.id_processor_recorder == Processors.id_processor)
        .all()
    )

    # Convert the query results into a list of dictionaries
    data = [
        {
            "id_processor": proc.id_processor,
            "model_processor": proc.model_processor,
            "comment_processor": proc.comment_processor,
            "id_recorder": proc.id_recorder,  # Include the recorder ID
        }
        for proc in response
    ]

    # Return the data in JSON format
    return jsonify(data), 200

def update_processor(id_processor):
    """
    Update a processor entry in the database.

    This function receives a PUT request with updated data for a processor.
    It calls a utility function to update the processor's details in the database and returns a response.
    """

    # Update the processor using the update_values_in_db function
    response = update_values_in_db(request, id_processor, Processors)

    # Return a JSON response with the result of the update
    return jsonify(response), 200

def delete_processor(id_processor):
    """
    Delete a processor entry from the database.

    This function deletes a processor, its associated recorders, and the recordings related to those recorders.
    It ensures that all related data is cleaned up before deleting the processor.
    """

    # Get all recorders associated with the processor
    recorders = db.session.query(Recorders).filter_by(id_processor_recorder=id_processor).all()

    # Delete all recordings associated with the recorders
    for recorder in recorders:
        db.session.query(Recordings).filter_by(id_recorder_recordings=recorder.id_recorder).delete()

    # Now delete the recorders associated with the processor
    db.session.query(Recorders).filter_by(id_processor_recorder=id_processor).delete()

    # Finally, delete the processor itself
    response = delete_values_in_db(id_processor, Processors)
    
    # Commit the transaction to apply changes to the database
    db.session.commit()

    # Return a JSON response with the result of the deletion
    return jsonify(response), 200

