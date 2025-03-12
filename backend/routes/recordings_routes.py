# /routes/recordings_routes.py

from flask import Blueprint
from controllers.recordings_controller import insert_new_recording, query_recordings, update_recording, delete_recording, get_recording_by_id, query_recordings_paginacion  

recordings_bp = Blueprint('recordings', __name__)

recordings_bp.add_url_rule('/api/v1/recordings', view_func=insert_new_recording, methods=['POST'])
recordings_bp.add_url_rule('/api/v1/recordings', view_func=query_recordings, methods=['GET'])
recordings_bp.add_url_rule('/api/v1/recordings_paginacion', view_func=query_recordings_paginacion, methods=['GET'])
recordings_bp.add_url_rule('/api/v1/recordings/<int:id_record>', view_func=update_recording, methods=['PUT'])
recordings_bp.add_url_rule('/api/v1/recordings/<int:id_record>', view_func=delete_recording, methods=['DELETE'])
recordings_bp.add_url_rule('/api/v1/recordings/<int:id_record>', view_func=get_recording_by_id, methods=['GET']) 