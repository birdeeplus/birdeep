#/routes/recorders_routes.py

from flask import Blueprint
from controllers.recorders_controller import insert_new_recorder, query_recorders, update_recorder, delete_recorder

recorders_bp = Blueprint('recorders', __name__)

recorders_bp.add_url_rule('/api/v1/recorders', view_func=insert_new_recorder, methods=['POST'])
recorders_bp.add_url_rule('/api/v1/recorders', view_func=query_recorders, methods=['GET'])
recorders_bp.add_url_rule('/api/v1/recorders/<int:id_recorder>', view_func=update_recorder, methods=['PUT'])
recorders_bp.add_url_rule('/api/v1/recorders/<int:id_recorder>', view_func=delete_recorder, methods=['DELETE'])
recorders_bp.add_url_rule('/api/v1/recorders/<int:id_recorder>', view_func=query_recorders, methods=['GET'])
