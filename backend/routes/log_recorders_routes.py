# routes/log_recorders_routes.py

from flask import Blueprint
from controllers.log_recorders_controller import insert_status

log_recorders_bp = Blueprint('log_recorders', __name__)

log_recorders_bp.add_url_rule('/insert_status', view_func=insert_status, methods=['POST'])
