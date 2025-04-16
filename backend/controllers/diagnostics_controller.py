# /controllers/diagnostics_controller.py

from flask import request, jsonify, current_app
from models import Diagnostics
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
import os


def insert_new_diagnostic():
    """
    Insert new diagnostics into the database.

    This function handles a POST request with diagnostic data,
    and inserts it into the Diagnostics table using a utility function.
    It uses a custom translation dictionary from the app config for field mapping.
    """

    # Insert the diagnostic into the Diagnostics table
    response = insert_values_in_db(
        request, 
        Diagnostics, 
        current_app.config['TRANSLATION_DIAGNOSTIC_DICT']  # Field mapping if necessary
    )

    # Return the result as a JSON response
    return jsonify(response), 200

def query_diagnostics():
    """
    Query diagnostics from the database.

    This function retrieves diagnostics data from the Diagnostics table
    using a utility function. It handles filtering and pagination via request params.
    """

    # Fetch diagnostics from the database
    response = get_values_from_db(request, Diagnostics)

    # Return the diagnostics data as a JSON response
    return jsonify(response), 200

def update_diagnostic(id_diagnostic):
    """
    Update a diagnostic entry in the database.

    This function handles a PUT request with updated data for a specific diagnostic.
    It uses a utility function to perform the update using the diagnostic ID.
    """

    # Update the diagnostic with the provided ID
    response = update_values_in_db(request, id_diagnostic, Diagnostics)

    # Return the update result as a JSON response
    return jsonify(response), 200

def delete_diagnostic(id_diagnostic):
    """
    Delete a diagnostic entry from the database.

    This function deletes a diagnostic record identified by its ID.
    It uses a utility function and returns a success or error message.
    """

    # Delete the diagnostic with the given ID
    response = delete_values_in_db(id_diagnostic, Diagnostics)

    # Return the deletion result as a JSON response
    return jsonify(response), 200
