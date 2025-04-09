from flask import Blueprint
from controllers.recorders_controller import insert_new_recorder, query_recorders, update_recorder, delete_recorder
from flasgger import swag_from

recorders_bp = Blueprint('recorders', __name__)


@recorders_bp.route('/api/v1/recorders', methods=['POST'])
@swag_from({
    'tags': ['Recorders operations'],
    'operationId': 'insert_new_recorder',
    'summary': 'Insert a new recorder',
    'description': 'Adds a new recorder to the database.',
    'parameters': [
        {
            'name': 'recorder_data',
            'in': 'body',
            'description': 'Recorder data to be inserted',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'recorder_name': {
                        'type': 'string',
                        'description': 'The name of the recorder'
                    },
                    'id_location_recorder': {
                        'type': 'integer',
                        'description': 'ID of the location for the recorder'
                    },
                    'id_microphone_recorder': {
                        'type': 'integer',
                        'description': 'ID of the microphone for the recorder (optional)',
                        'nullable': True
                    },
                    'id_processor_recorder': {
                        'type': 'integer',
                        'description': 'ID of the processor for the recorder (optional)',
                        'nullable': True
                    },
                    'installation_date': {
                        'type': 'string',
                        'format': 'date',
                        'description': 'The installation date of the recorder'
                    },
                    'status': {
                        'type': 'string',
                        'format': 'date',
                        'description': 'The status date of the recorder (optional)',
                        'nullable': True
                    },
                    'version': {
                        'type': 'string',
                        'description': 'The version of the recorder (optional)',
                        'nullable': True
                    }
                },
                'required': ['recorder_name', 'id_location_recorder', 'installation_date']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Recorder successfully created',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_recorder': {'type': 'integer'},
                    'recorder_name': {'type': 'string'},
                    'id_location_recorder': {'type': 'integer'},
                    'id_microphone_recorder': {'type': 'integer', 'nullable': True},
                    'id_processor_recorder': {'type': 'integer', 'nullable': True},
                    'installation_date': {'type': 'string', 'format': 'date'},
                    'status': {'type': 'string', 'format': 'date', 'nullable': True},
                    'version': {'type': 'string', 'nullable': True}
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
def insert_new_recorder_route():
    return insert_new_recorder()

@recorders_bp.route('/api/v1/recorders', methods=['GET'])
@swag_from({
    'tags': ['Recorders operations'],
    'operationId': 'query_recorders',
    'summary': 'Get all recorders',
    'description': 'Fetches all recorders from the database.',
    'responses': {
        200: {
            'description': 'Successful query of all recorders',
            'schema': {
                'type': 'object',
                'properties': {
                    'recorder_name': {
                        'type': 'string',
                        'description': 'The name of the recorder'
                    },
                    'id_location_recorder': {
                        'type': 'integer',
                        'description': 'ID of the location for the recorder'
                    },
                    'id_microphone_recorder': {
                        'type': 'integer',
                        'description': 'ID of the microphone for the recorder (optional)',
                        'nullable': True
                    },
                    'id_processor_recorder': {
                        'type': 'integer',
                        'description': 'ID of the processor for the recorder (optional)',
                        'nullable': True
                    },
                    'installation_date': {
                        'type': 'string',
                        'format': 'date',
                        'description': 'The installation date of the recorder'
                    },
                    'status': {
                        'type': 'string',
                        'format': 'date',
                        'description': 'The status date of the recorder (optional)',
                        'nullable': True
                    },
                    'version': {
                        'type': 'string',
                        'description': 'The version of the recorder (optional)',
                        'nullable': True
                    }
                },
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
def query_recorders_route():
    return query_recorders()

@recorders_bp.route('/api/v1/recorders/<int:id_recorder>', methods=['PUT'])
@swag_from({
    'tags': ['Recorders operations'],
    'operationId': 'update_recorder',
    'summary': 'Update an existing recorder',
    'description': 'Updates the details of an existing recorder based on the provided ID.',
    'parameters': [
        {
            'name': 'id_recorder',
            'in': 'path',
            'description': 'ID of the recorder to update',
            'required': True,
            'type': 'integer'
        },
        {
            'name': 'recorder_data',
            'in': 'body',
            'description': 'Updated recorder data',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'recorder_name': {
                        'type': 'string',
                        'description': 'The name of the recorder'
                    },
                    'id_location_recorder': {
                        'type': 'integer',
                        'description': 'ID of the location for the recorder'
                    },
                    'id_microphone_recorder': {
                        'type': 'integer',
                        'description': 'ID of the microphone for the recorder (optional)',
                        'nullable': True
                    },
                    'id_processor_recorder': {
                        'type': 'integer',
                        'description': 'ID of the processor for the recorder (optional)',
                        'nullable': True
                    },
                    'installation_date': {
                        'type': 'string',
                        'format': 'date',
                        'description': 'The installation date of the recorder'
                    },
                    'status': {
                        'type': 'string',
                        'format': 'date',
                        'description': 'The status date of the recorder (optional)',
                        'nullable': True
                    },
                    'version': {
                        'type': 'string',
                        'description': 'The version of the recorder (optional)',
                        'nullable': True
                    }
                },
                'required': ['recorder_name', 'id_location_recorder', 'installation_date']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Recorder successfully updated',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_recorder': {'type': 'integer'},
                    'recorder_name': {'type': 'string'},
                    'id_location_recorder': {'type': 'integer'},
                    'id_microphone_recorder': {'type': 'integer', 'nullable': True},
                    'id_processor_recorder': {'type': 'integer', 'nullable': True},
                    'installation_date': {'type': 'string', 'format': 'date'},
                    'status': {'type': 'string', 'format': 'date', 'nullable': True},
                    'version': {'type': 'string', 'nullable': True}
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
        404: {
            'description': 'Recorder not found',
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
def update_recorder_route(id_recorder):
    return update_recorder(id_recorder)

@recorders_bp.route('/api/v1/recorders/<int:id_recorder>', methods=['DELETE'])
@swag_from({
    'tags': ['Recorders operations'],
    'operationId': 'delete_recorder',
    'summary': 'Delete a recorder by ID',
    'description': 'Deletes a recorder from the database.',
    'parameters': [
        {
            'name': 'id_recorder',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'The ID of the recorder to delete'
        }
    ],
    'responses': {
        200: {
            'description': 'Recorder successfully deleted',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Recorder not found',
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
def delete_recorder_route(id_recorder):
    return delete_recorder(id_recorder)
