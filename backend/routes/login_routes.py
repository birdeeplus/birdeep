# routes/login_routes.py
from flask import Blueprint
from controllers.login_controller import login
from flasgger import swag_from

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/v1/login', methods=['POST'])
@swag_from({
    'tags': ['Admin login'],
    'operationId': 'login',
    'produces': ['application/json'],
    'consumes': ['application/json'],
    'summary': 'Login as an admin user',
    'description': 'Allows an admin user to log in and receive a JWT token for authentication.',
    'parameters': [
        {
            'name': 'login_credentials',
            'in': 'body',
            'description': 'Admin credentials (username and password)',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'username': {
                        'type': 'string',
                        'description': 'Admin username'
                    },
                    'password': {
                        'type': 'string',
                        'description': 'Admin password'
                    }
                },
                'required': ['username', 'password']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Successful login',
            'schema': {
                'type': 'object',
                'properties': {
                    'access_token': {
                        'type': 'string',
                        'description': 'JWT authentication token'
                    },
                    'is_admin': {
                        'type': 'boolean',
                        'description': 'True if the user is an admin'
                    }
                }
            }
        },
        400: {
            'description': 'Incorrect or missing parameters',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string',
                        'description': 'Error message detailing what went wrong'
                    }
                }
            }
        },
        401: {
            'description': 'Invalid credentials',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string',
                        'description': 'Error message indicating invalid login credentials'
                    }
                }
            }
        },
        500: {
            'description': 'Internal server error',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string',
                        'description': 'Error message indicating an internal server issue'
                    }
                }
            }
        }
    }
})
def login_route():
    return login()
