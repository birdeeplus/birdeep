#/controllers/recorders_controller.py

import os
from flask import request, jsonify
from models import Recorders, Recordings
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from models.database import db

def insert_new_recorder():
    """
    Insert a new recorder into the database.

    This function receives a POST request with data for a new recorder,
    and it inserts the recorder data into the database using a utility function.
    The response is returned with the result of the insertion.
    """

    # Insert the new recorder into the Recorders table using the insert_values_in_db function
    response = insert_values_in_db(request, Recorders)
    
    # Return a JSON response with the result of the insertion
    return jsonify(response), 200

def query_recorders():
    """
    Query recorders from the database.

    This function retrieves all recorders from the database.
    It calls a utility function to fetch the data and returns the result as a JSON response.
    """

    # Get all recorders from the Recorders table using the get_values_from_db function
    response = get_values_from_db(request, Recorders)
    
    # Return the data as a JSON response
    return jsonify(response), 200

def update_recorder(id_recorder):
    """
    Update a recorder entry in the database.

    This function receives a PUT request with updated data for an existing recorder.
    It calls a utility function to update the recorder in the database and returns the result in a JSON response.
    """

    # Update the recorder using the update_values_in_db function
    response = update_values_in_db(request, id_recorder, Recorders)
    
    # Return a JSON response with the result of the update
    return jsonify(response), 200

def delete_recorder(id_recorder):
    """
    Delete a recorder entry from the database.

    This function deletes a recorder and any associated recordings.
    It ensures that all related data is cleaned up before deleting the recorder.
    """

    try:
        # Delete recordings associated with the recorder
        db.session.query(Recordings).filter_by(id_recorder_recordings=id_recorder).delete()

        # Delete the recorder itself
        response = delete_values_in_db(id_recorder, Recorders)
        
        # Commit the changes to the database
        db.session.commit()
        
        # Return a JSON response with the result of the deletion
        return jsonify(response), 200

    except Exception as e:
        # Rollback the session in case of an error
        db.session.rollback()
        # Return an error response with the exception message
        return jsonify({"error": str(e)}), 400