#/controllers/locations_controller.py

import os
from flask import request, jsonify
from models import Recorders, Locations, Recordings
from utils.crud_operations import insert_values_in_db, get_values_from_db, update_values_in_db, delete_values_in_db
from flasgger import swag_from
from models.database import db

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('locations.yml'), methods=['POST'])
def insert_new_location():
    """
    Insert a new location into the database
    """
    response = insert_values_in_db(request, Locations)
    return jsonify(response), 200

@swag_from(get_swagger_path('locations.yml'), methods=['GET'])
def query_locations():
    """
    Query locations from the database
    """
    response = get_values_from_db(request, Locations)
    return jsonify(response), 200

@swag_from(get_swagger_path('locations.yml'), methods=['PUT'])
def update_location(id_location):
    """
    Update a location entry in the database
    """
    response = update_values_in_db(request, id_location, Locations)
    return jsonify(response), 200

@swag_from(get_swagger_path('locations.yml'), methods=['DELETE'])
def delete_location(id_location):
    """
    Delete a location entry from the database
    """
    try:
        # Eliminar recordings asociados a los recorders de esta location
        db.session.query(Recordings).filter(
            Recordings.id_recorder_recordings.in_(
                db.session.query(Recorders.id_recorder).filter_by(id_location_recorder=id_location)
            )
        ).delete(synchronize_session=False)

        # Eliminar recorders asociados a esta location
        db.session.query(Recorders).filter_by(id_location_recorder=id_location).delete()

        # Ahora eliminar la location
        response = delete_values_in_db(id_location, Locations)
        db.session.commit()
        return jsonify(response), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400



def get_location_by_id(id_location):
    location = Locations.query.get(id_location)  # Cambié "Location" por "Locations"
    
    if location is None:
        return jsonify({"error": "Location not found"}), 404  # Devuelve 404 si no encuentra la ubicación
    
    return jsonify({
        "id_location": location.id_location,  # Ajusta los nombres de los atributos si es necesario
        "name_location": location.name_location,
        "latitude_location": location.latitude_location,
        "longitude_location": location.longitude_location,
        "habitat_location": location.habitat_location if location.habitat_location else "N/A"
    }), 200  # Devuelve un código de éxito 200
