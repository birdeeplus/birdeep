#/controllers/species_controller.py

import os
from flask import request, jsonify
from models import Species
from utils.crud_operations import (
    insert_values_in_db, 
    get_values_from_db, 
    update_values_in_db, 
    delete_values_in_db
)

def insert_new_specie():
    """
    Insert a new species into the database.

    This function handles a POST request containing data for a new species.
    It delegates the insertion logic to a shared utility function and returns the result.
    """

    # Insert the species into the Species table
    response = insert_values_in_db(request, Species)

    # Return the result of the insertion as a JSON response
    return jsonify(response), 200

def query_species():
    """
    Query species from the database.

    This function handles a GET request to retrieve species records.
    It uses a utility function that supports filters and pagination.
    """

    # Retrieve species from the Species table
    response = get_values_from_db(request, Species)

    # Return the result as a JSON response
    return jsonify(response), 200

def update_specie(id_specie):
    """
    Update a species entry in the database, ensuring it exists.

    This function handles a PUT request to update the data of a species
    identified by its ID. It first checks whether the species exists,
    and if so, delegates the update operation to a utility function.
    """

    # Check if the species exists in the database
    specie = Species.query.get(id_specie)
    if not specie:
        # Return 404 if the species is not found
        return jsonify({"error": "Especie no encontrada"}), 404

    # Perform the update using the utility function
    response = update_values_in_db(request, id_specie, Species)

    # Handle and return response
    if isinstance(response, dict):
        # Update successful
        return jsonify(response), 200
    else:
        # Unexpected error format
        return jsonify({"error": "Error inesperado al actualizar"}), 500

def delete_specie(id_specie):
    """
    Delete a species entry from the database, ensuring it exists.

    This function handles a DELETE request to remove a species record
    identified by its ID. It verifies that the species exists before deletion.
    """

    # Check if the species exists
    specie = Species.query.get(id_specie)
    if not specie:
        # Return 404 if not found
        return jsonify({"error": "Especie no encontrada"}), 404

    # Perform deletion using the utility function
    response = delete_values_in_db(id_specie, Species)

    # Handle and return response
    if isinstance(response, dict):
        # Deletion successful
        return jsonify(response), 200
    else:
        # Unexpected error format
        return jsonify({"error": "Error inesperado al eliminar"}), 500
