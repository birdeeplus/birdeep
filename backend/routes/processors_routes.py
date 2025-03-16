# /routes/processors_routes.py

from flask import Blueprint
from controllers.processors_controller import (insert_new_processor, query_processors, update_processor, delete_processor, query_processors_with_recorders)

processors_bp = Blueprint('processors', __name__)

processors_bp.add_url_rule('/api/v1/processors', view_func=insert_new_processor, methods=['POST'])
processors_bp.add_url_rule('/api/v1/processors', view_func=query_processors, methods=['GET'])
processors_bp.add_url_rule('/api/v1/processors/<int:id_processor>', view_func=update_processor, methods=['PUT'])
processors_bp.add_url_rule('/api/v1/processors/<int:id_processor>', view_func=delete_processor, methods=['DELETE'])

# Nueva ruta para obtener los procesadores con sus grabadoras
processors_bp.add_url_rule('/api/v1/processors-recorders', view_func=query_processors_with_recorders, methods=['GET'])
