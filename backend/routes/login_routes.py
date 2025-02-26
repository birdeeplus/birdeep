# routes/login_routes.py
from flask import Blueprint
from controllers.login_controller import login

auth_bp = Blueprint('auth', __name__)

auth_bp.add_url_rule('/api/v1/login', view_func=login, methods=['POST'])

