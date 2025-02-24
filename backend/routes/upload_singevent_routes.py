# /routes/upload_singevent_routes.py

from flask import Blueprint
from controllers.upload_singevent_controller import upload_folder

upload_singevent_bp = Blueprint('upload_singevent', __name__)

upload_singevent_bp.add_url_rule('/api/v1/upload_singevent', view_func=upload_folder, methods=['POST'])
