#/routes/locations_routes.py

from flask import Blueprint
from controllers.locations_controller import insert_new_location, query_locations, update_location, delete_location

locations_bp = Blueprint('locations', __name__)

locations_bp.add_url_rule('/api/v1/locations', view_func=insert_new_location, methods=['POST'])
locations_bp.add_url_rule('/api/v1/locations', view_func=query_locations, methods=['GET'])
locations_bp.add_url_rule('/api/v1/locations/<int:id_location>', view_func=update_location, methods=['PUT'])
locations_bp.add_url_rule('/api/v1/locations/<int:id_location>', view_func=delete_location, methods=['DELETE'])
