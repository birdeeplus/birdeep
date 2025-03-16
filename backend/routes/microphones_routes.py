# /routes/microphones_routes.py

from flask import Blueprint
from controllers.microphones_controller import (insert_new_microphone, query_microphones, update_microphone, delete_microphone, query_microphones_with_recorders)

microphones_bp = Blueprint('microphones', __name__)

microphones_bp.add_url_rule('/api/v1/microphones', view_func=insert_new_microphone, methods=['POST'])
microphones_bp.add_url_rule('/api/v1/microphones', view_func=query_microphones, methods=['GET'])
microphones_bp.add_url_rule('/api/v1/microphones/<int:id_microphone>', view_func=update_microphone, methods=['PUT'])
microphones_bp.add_url_rule('/api/v1/microphones/<int:id_microphone>', view_func=delete_microphone, methods=['DELETE'])

# Nueva ruta para obtener los micrófonos con sus grabadores
microphones_bp.add_url_rule('/api/v1/microphones-recorders', view_func=query_microphones_with_recorders, methods=['GET'])
