# /routes/diagnostics_routes.py

from flask import Blueprint
from controllers.diagnostics_controller import insert_new_diagnostic, query_diagnostics, update_diagnostic, delete_diagnostic

diagnostics_bp = Blueprint('diagnostics', __name__)

diagnostics_bp.add_url_rule('/api/v1/diagnostics', view_func=insert_new_diagnostic, methods=['POST'])
diagnostics_bp.add_url_rule('/api/v1/diagnostics', view_func=query_diagnostics, methods=['GET'])
diagnostics_bp.add_url_rule('/api/v1/diagnostics/<int:id_diagnostic>', view_func=update_diagnostic, methods=['PUT'])
diagnostics_bp.add_url_rule('/api/v1/diagnostics/<int:id_diagnostic>', view_func=delete_diagnostic, methods=['DELETE'])
