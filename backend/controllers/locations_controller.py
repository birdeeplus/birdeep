#/controllers/locations_controller.py

import os
from flask import request, jsonify
from models import Recorders, Locations, Recordings
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from models.database import db

def insert_new_location():
    """
    Insert a new location into the database.

    This function receives a POST request with data for a new location,
    and it inserts the location data into the database using a utility function.
    The response is returned with the result of the insertion.
    """

    # Insert the new location into the Locations table using the insert_values_in_db function
    response = insert_values_in_db(request, Locations)
    
    # Return a JSON response with the result of the insertion
    return jsonify(response), 200

def query_locations():
    """
    Query locations from the database.

    This function retrieves all locations from the database.
    It calls a utility function to fetch the data and returns the result as a JSON response.
    """

    # Get all locations from the Locations table using the get_values_from_db function
    response = get_values_from_db(request, Locations)
    
    # Return the data as a JSON response
    return jsonify(response), 200

def update_location(id_location):
    """
    Update a location entry in the database.

    This function receives a PUT request with updated data for an existing location.
    It calls a utility function to update the location in the database and returns the result in a JSON response.
    """
    # Update the location using the update_values_in_db function
    response = update_values_in_db(request, id_location, Locations)
    
    # Return a JSON response with the result of the update
    return jsonify(response), 200

def delete_location(id_location):
    """
    Delete a location entry from the database.

    This function deletes a location and any associated recorders and recordings.
    It ensures that all related data is cleaned up before deleting the location.
    """

    try:
        # Delete recordings associated with recorders at the specified location
        db.session.query(Recordings).filter(
            Recordings.id_recorder_recordings.in_(
                db.session.query(Recorders.id_recorder).filter_by(id_location_recorder=id_location)
            )
        ).delete(synchronize_session=False)

        # Delete recorders associated with the location
        db.session.query(Recorders).filter_by(id_location_recorder=id_location).delete()

        # Finally, delete the location itself
        response = delete_values_in_db(id_location, Locations)
        
        # Commit the changes to the database
        db.session.commit()
        
        # Return a JSON response with the result of the deletion
        return jsonify(response), 200

    except Exception as e:
        # Rollback the session in case of an error
        db.session.rollback()
        # Return an error response with the exception message
        return jsonify({"error": str(e)}), 400

def get_location_by_id(id_location):
    """
    Get a specific location by its ID.

    This function retrieves a single location by its ID from the database.
    If the location is found, it returns the details as a JSON response.
    If the location is not found, it returns a 404 error response.
    """

    # Fetch the location by its ID from the Locations table
    location = Locations.query.get(id_location)
    
    if location is None:
        # If location not found, return a 404 error
        return jsonify({"error": "Location not found"}), 404
    
    # Return the location details as a JSON response
    return jsonify({
        "id_location": location.id_location,
        "name_location": location.name_location,
        "latitude_location": location.latitude_location,
        "longitude_location": location.longitude_location,
        "habitat_location": location.habitat_location if location.habitat_location else "N/A"
    }), 200

def get_recorders_by_location(id_location):
    """
    Get all recorders associated with a specific location.

    This function retrieves all recorders linked to a particular location by its ID.
    It returns a list of recorders and their details as a JSON response.
    If no recorders are found for the location, it returns a 404 error response.
    """
    
    try:
        # Get all recorders associated with the location
        recorders = db.session.query(Recorders).filter_by(id_location_recorder=id_location).all()

        if not recorders:
            # If no recorders are found, return a 404 error message
            return jsonify({"message": "No recorders found for this location"}), 404

        # Serialize the recorders data into a list of dictionaries
        recorders_data = [
            {
                "id_recorder": recorder.id_recorder,
                "recorder_name": recorder.recorder_name,
                "installation_date": recorder.installation_date,
                "status": recorder.status
            }
            for recorder in recorders
        ]

        # Return the recorders data as a JSON response
        return jsonify(recorders_data), 200

    except Exception as e:
        # If an error occurs, return a 500 error response with the exception message
        return jsonify({"error": str(e)}), 500
