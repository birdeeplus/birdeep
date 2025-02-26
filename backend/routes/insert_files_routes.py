# /routes/insert_files_routes.py

from flask import Blueprint
from controllers.insert_files_controller import insert_files

insert_files_bp = Blueprint('insert_files', __name__)

insert_files_bp.add_url_rule('/api/v1/insert_files', view_func=insert_files, methods=['POST'])
