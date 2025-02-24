# /routes/species_routes.py

from flask import Blueprint
from controllers.species_controller import insert_new_specie, query_species, update_specie, delete_specie

species_bp = Blueprint('species', __name__)

species_bp.add_url_rule('/api/v1/species', view_func=insert_new_specie, methods=['POST'])
species_bp.add_url_rule('/api/v1/species', view_func=query_species, methods=['GET'])
species_bp.add_url_rule('/api/v1/species/<int:id_specie>', view_func=update_specie, methods=['PUT'])
species_bp.add_url_rule('/api/v1/species/<int:id_specie>', view_func=delete_specie, methods=['DELETE'])
