#/controllers/sing_events_controller.py

import os
from flask import request, jsonify
from models import SingEvents, Diagnostics, Species
from utils.crud_operations import (
    insert_values_in_db, 
    get_values_from_db, 
    update_values_in_db, 
    delete_values_in_db
)
from models.database import db

def insert_new_sing_event():
    """
    Insert a new sing event into the database, ensuring the diagnostic exists.

    This function handles a POST request to insert a new sing event.
    It first validates that the referenced diagnostic (foreign key) exists in the database.
    If validation passes, it delegates the insertion to a utility function.
    """

    # Parse the incoming JSON data from the request body
    data = request.get_json()

    # Verify if the referenced diagnostic exists in the database
    diagnostic = db.session.get(Diagnostics, data.get("id_diagnostic_event"))
    if not diagnostic:
        # Return an error if the diagnostic ID is invalid or not found
        return jsonify({"error": "Diagnóstico no encontrado"}), 400

    # Insert the sing event into the SingEvents table
    response = insert_values_in_db(request, SingEvents)

    # Return the result of the insertion as a JSON response
    return jsonify(response), 200

def query_sing_events():
    """
    Query sing events from the database.

    This function retrieves sing event records from the SingEvents table.
    It supports optional filters or pagination via request parameters.
    """

    # Fetch sing events using the utility function
    response = get_values_from_db(request, SingEvents)

    # Return the retrieved data as a JSON response
    return jsonify(response), 200

def update_sing_event(id_event):
    """
    Update a sing event entry in the database.

    This function handles a PUT request with updated data for a specific sing event,
    identified by its ID. The update is performed using a utility function.
    """

    # Update the sing event record with the specified ID
    response = update_values_in_db(request, id_event, SingEvents)

    # Return the result of the update as a JSON response
    return jsonify(response), 200

def delete_sing_event(id_event):
    """
    Delete a sing event entry from the database.

    This function deletes a sing event based on its ID using a utility function,
    and returns the result in a JSON response.
    """

    # Delete the sing event with the given ID
    response = delete_values_in_db(id_event, SingEvents)

    # Return the result of the deletion as a JSON response
    return jsonify(response), 200

def upload_folder():
    """
    Insert new sing events into the database.

    This function handles the insertion of new sing events into the database. 
    It leverages a utility function `insert_in_singevent` to process the request data 
    and insert relevant records into the `SingEvents`, `Diagnostics`, and `Recordings` tables.

    The request is expected to contain the necessary data for inserting the sing event, 
    along with any associated diagnostics or recordings. The function returns a 
    JSON response with the result of the insertion operation.
    """

    # Call the utility function to insert the sing events along with diagnostics and recordings
    response = insert_in_singevent(request, SingEvents, Diagnostics, Recordings)

    # Return the result of the operation as a JSON response
    return jsonify(response), 200
