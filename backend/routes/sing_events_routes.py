# /routes/sing_events_routes.py

from flask import Blueprint
from controllers.sing_events_controller import insert_new_sing_event, query_sing_events, update_sing_event, delete_sing_event

sing_events_bp = Blueprint('sing_events', __name__)

sing_events_bp.add_url_rule('/api/v1/sing_events', view_func=insert_new_sing_event, methods=['POST'])
sing_events_bp.add_url_rule('/api/v1/sing_events', view_func=query_sing_events, methods=['GET'])
sing_events_bp.add_url_rule('/api/v1/sing_events/<int:id_event>', view_func=update_sing_event, methods=['PUT'])
sing_events_bp.add_url_rule('/api/v1/sing_events/<int:id_event>', view_func=delete_sing_event, methods=['DELETE'])
