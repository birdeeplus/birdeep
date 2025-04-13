from flask import Blueprint
from controllers.sing_events_controller import insert_new_sing_event, query_sing_events, update_sing_event, delete_sing_event
from flasgger import swag_from

sing_events_bp = Blueprint('sing_events', __name__)

@sing_events_bp.route('/api/v1/sing_events', methods=['POST'])
@swag_from({
    'tags': ['Sing Events'],
    'operationId': 'insert_new_sing_event',
    'summary': 'Insert a new sing event',
    'description': 'Adds a new sing event to the database. Requires valid diagnostic and species references.',
    'parameters': [
        {
            'name': 'sing_event_data',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_diagnostic_event': {'type': 'integer', 'description': 'ID of the diagnostic'},
                    'id_species_event': {'type': 'integer', 'description': 'ID of the species'},
                    'start_time': {'type': 'string', 'format': 'date-time', 'description': 'Start time of the event'},
                    'end_time': {'type': 'string', 'format': 'date-time', 'description': 'End time of the event'},
                    'note': {'type': 'string', 'description': 'Optional note'}
                },
                'required': ['id_diagnostic_event', 'id_species_event', 'start_time', 'end_time']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Sing event successfully inserted',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_event': {'type': 'integer'},
                    'message': {'type': 'string'}
                }
            }
        },
        400: {
            'description': 'Invalid input or diagnostic/species not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def insert_new_sing_event_route():
    return insert_new_sing_event()


@sing_events_bp.route('/api/v1/sing_events', methods=['GET'])
@swag_from({
    'tags': ['Sing Events'],
    'operationId': 'query_sing_events',
    'summary': 'Query sing events',
    'description': 'Retrieves all sing events from the database.',
    'responses': {
        200: {
            'description': 'List of sing events',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id_event': {'type': 'integer'},
                        'id_diagnostic_event': {'type': 'integer'},
                        'id_species_event': {'type': 'integer'},
                        'start_time': {'type': 'string', 'format': 'date-time'},
                        'end_time': {'type': 'string', 'format': 'date-time'},
                        'note': {'type': 'string'}
                    }
                }
            }
        }
    }
})
def query_sing_events_route():
    return query_sing_events()


@sing_events_bp.route('/api/v1/sing_events/<int:id_event>', methods=['PUT'])
@swag_from({
    'tags': ['Sing Events'],
    'operationId': 'update_sing_event',
    'summary': 'Update a sing event',
    'description': 'Updates a sing event by ID.',
    'parameters': [
        {
            'name': 'id_event',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the sing event to update'
        },
        {
            'name': 'sing_event_data',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_diagnostic_event': {'type': 'integer'},
                    'id_species_event': {'type': 'integer'},
                    'start_time': {'type': 'string', 'format': 'date-time'},
                    'end_time': {'type': 'string', 'format': 'date-time'},
                    'note': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Sing event successfully updated',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_event': {'type': 'integer'},
                    'message': {'type': 'string'}
                }
            }
        },
        400: {
            'description': 'Invalid input data',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Sing event not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def update_sing_event_route(id_event):
    return update_sing_event(id_event)


@sing_events_bp.route('/api/v1/sing_events/<int:id_event>', methods=['DELETE'])
@swag_from({
    'tags': ['Sing Events'],
    'operationId': 'delete_sing_event',
    'summary': 'Delete a sing event',
    'description': 'Deletes a sing event by ID.',
    'parameters': [
        {
            'name': 'id_event',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the sing event to delete'
        }
    ],
    'responses': {
        200: {
            'description': 'Sing event successfully deleted',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Sing event not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def delete_sing_event_route(id_event):
    return delete_sing_event(id_event)

@sing_events_bp.route('/api/v1/upload_singevent', methods=['POST'])
@swag_from({
    'tags': ['Upload Sing Events'],
    'operationId': 'upload_singevent',
    'summary': 'Upload new sing event data',
    'description': 'Uploads a folder containing files and event data to insert into the database.',
    'parameters': [
        {
            'name': 'files',
            'in': 'formData',
            'type': 'file',
            'required': True,
            'description': 'File or folder to upload'
        },
        {
            'name': 'json_data',
            'in': 'formData',
            'type': 'string',
            'required': True,
            'description': 'JSON string containing event metadata'
        }
    ],
    'responses': {
        200: {
            'description': 'Sing event data successfully uploaded and saved',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'event_id': {'type': 'integer'}
                }
            }
        },
        400: {
            'description': 'Bad request. Invalid file or metadata',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        500: {
            'description': 'Server error while processing the files',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def upload_singevent_route():
    return upload_folder()
