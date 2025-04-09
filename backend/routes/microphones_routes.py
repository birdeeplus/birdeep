# /routes/microphones_routes.py
from flask import Blueprint
from controllers.microphones_controller import insert_new_microphone, query_microphones, update_microphone, delete_microphone
from flasgger import swag_from

microphones_bp = Blueprint('microphones', __name__)

@microphones_bp.route('/api/v1/microphones', methods=['POST'])
@swag_from({
    'tags': ['Microphones operations'],
    'operationId': 'insert_new_microphone',
    'summary': 'Insert a new microphone',
    'description': 'Adds a new microphone to the database including association with a recorder.',
    'parameters': [
        {
            'name': 'microphone_data',
            'in': 'body',
            'description': 'Microphone data to be inserted',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'model_microphone': {
                        'type': 'string',
                        'description': 'The model of the microphone'
                    },
                    'comment_microphone': {
                        'type': 'string',
                        'description': 'Optional comments about the microphone'
                    },
                    'id_recorder': {
                        'type': 'integer',
                        'description': 'Recorder ID to associate with the microphone'
                    }
                },
                'required': ['model_microphone', 'id_recorder']
            }
        }
    ],
    'responses': {
        201: {
            'description': 'Microphone successfully created',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_microphone': {'type': 'integer'},
                    'model_microphone': {'type': 'string'},
                    'comment_microphone': {'type': 'string'},
                    'id_recorder': {'type': 'integer'}
                }
            }
        },
        400: {
            'description': 'Missing or invalid parameter',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        500: {
            'description': 'Internal server error',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def insert_new_microphone_route():
    return insert_new_microphone()

@microphones_bp.route('/api/v1/microphones', methods=['GET'])
@swag_from({
    'tags': ['Microphones operations'],
    'operationId': 'query_microphones',
    'summary': 'Get all microphones',
    'description': 'Fetches all microphones in the database, including associated recorders.',
    'responses': {
        200: {
            'description': 'Successful query of all microphones',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id_microphone': {'type': 'integer'},
                        'model_microphone': {'type': 'string'},
                        'comment_microphone': {'type': 'string'},
                        'id_recorder': {'type': 'integer'}
                    }
                }
            }
        },
        500: {
            'description': 'Internal server error',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def query_microphones_route():
    return query_microphones()

@microphones_bp.route('/api/v1/microphones/<int:id_microphone>', methods=['PUT'])
@swag_from({
    'tags': ['Microphones operations'],
    'operationId': 'update_microphone',
    'summary': 'Update a microphone by ID',
    'description': 'Updates the details of an existing microphone by its ID.',
    'parameters': [
        {
            'name': 'id_microphone',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'The ID of the microphone to update'
        },
        {
            'name': 'microphone_data',
            'in': 'body',
            'description': 'Updated microphone data',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'model_microphone': {'type': 'string'},
                    'comment_microphone': {'type': 'string'},
                    'id_recorder': {'type': 'integer'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Microphone successfully updated',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_microphone': {'type': 'integer'},
                    'model_microphone': {'type': 'string'},
                    'comment_microphone': {'type': 'string'},
                    'id_recorder': {'type': 'integer'}
                }
            }
        },
        400: {
            'description': 'Invalid input or missing data',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Microphone not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        500: {
            'description': 'Internal server error',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def update_microphone_route(id_microphone):
    return update_microphone(id_microphone)

@microphones_bp.route('/api/v1/microphones/<int:id_microphone>', methods=['DELETE'])
@swag_from({
    'tags': ['Microphones operations'],
    'operationId': 'delete_microphone',
    'summary': 'Delete a microphone by ID',
    'description': 'Deletes a microphone from the database.',
    'parameters': [
        {
            'name': 'id_microphone',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'The ID of the microphone to delete'
        }
    ],
    'responses': {
        200: {
            'description': 'Microphone successfully deleted',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Microphone not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        500: {
            'description': 'Internal server error',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def delete_microphone_route(id_microphone):
    return delete_microphone(id_microphone)
