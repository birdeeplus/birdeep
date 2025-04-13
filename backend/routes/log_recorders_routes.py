from flask import Blueprint
from controllers.log_recorders_controller import insert_status
from flasgger import swag_from

log_recorders_bp = Blueprint('log_recorders', __name__)

@log_recorders_bp.route('/insert_status', methods=['POST'])
@swag_from({
    'tags': ['Log Recorders'],
    'operationId': 'insert_status',
    'summary': 'Insert new recorder status into the database',
    'description': 'Inserts the status of a recorder into the database. Requires a JSON object with recorder status information.',
    'parameters': [
        {
            'name': 'json_data',
            'in': 'body',
            'type': 'object',
            'required': True,
            'description': 'JSON object containing the recorder status details',
            'schema': {
                'type': 'object',
                'properties': {
                    'recorder_id': {
                        'type': 'integer',
                        'description': 'ID of the recorder'
                    },
                    'status': {
                        'type': 'string',
                        'description': 'Current status of the recorder (e.g., "active", "inactive")'
                    },
                    'timestamp': {
                        'type': 'string',
                        'format': 'date-time',
                        'description': 'Timestamp when the status was recorded'
                    }
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Recorder status successfully inserted into the database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'status_id': {'type': 'integer'}
                }
            }
        },
        400: {
            'description': 'Bad request. Invalid data provided',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        500: {
            'description': 'Internal server error while processing the request',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def insert_status_route():
    return insert_status()
