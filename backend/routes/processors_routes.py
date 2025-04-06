# /routes/processors_routes.py
from flask import Blueprint
from controllers.processors_controller import insert_new_processor, query_processors, update_processor, delete_processor
from flasgger import swag_from

processors_bp = Blueprint('processors', __name__)

@processors_bp.route('/api/v1/processors', methods=['POST'])
@swag_from({
    'tags': ['Operations related to processors in the BIRDeep database'],
    'operationId': 'insert_new_processor',
    'summary': 'Insert a new processor',
    'description': 'Adds a new processor to the database.',
    'parameters': [
        {
            'name': 'processor_data',
            'in': 'body',
            'description': 'Processor data to be inserted',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'model_processor': {
                        'type': 'string',
                        'description': 'The model of the processor'
                    },
                    'comment_processor': {
                        'type': 'string',
                        'description': 'Optional comments about the processor'
                    },
                    'id_recorder': {
                        'type': 'integer',
                        'description': 'Recorder ID to associate with the processor'
                    }
                },
                'required': ['model_processor', 'id_recorder']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Processor successfully created',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_processor': {'type': 'integer'},
                    'model_processor': {'type': 'string'},
                    'comment_processor': {'type': 'string'},
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
def insert_new_processor_route():
    return insert_new_processor()

@processors_bp.route('/api/v1/processors', methods=['GET'])
@swag_from({
    'tags': ['Operations related to processors in the BIRDeep database'],
    'operationId': 'query_processors',
    'summary': 'Get all processors',
    'description': 'Fetches all processors in the database, including associated recorders.',
    'responses': {
        200: {
            'description': 'Successful query of all processors',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id_processor': {'type': 'integer'},
                        'model_processor': {'type': 'string'},
                        'comment_processor': {'type': 'string'},
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
def query_processors_route():
    return query_processors()

@processors_bp.route('/api/v1/processors/<int:id_processor>', methods=['PUT'])
@swag_from({
    'tags': ['Operations related to processors in the BIRDeep database'],
    'operationId': 'update_processor',
    'summary': 'Update a processor by ID',
    'description': 'Updates the details of an existing processor by its ID.',
    'parameters': [
        {
            'name': 'id_processor',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'The ID of the processor to update'
        },
        {
            'name': 'processor_data',
            'in': 'body',
            'description': 'Updated processor data',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'model_processor': {'type': 'string'},
                    'comment_processor': {'type': 'string'},
                    'id_recorder': {'type': 'integer'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Processor successfully updated',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_processor': {'type': 'integer'},
                    'model_processor': {'type': 'string'},
                    'comment_processor': {'type': 'string'},
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
            'description': 'Processor not found',
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
def update_processor_route(id_processor):
    return update_processor(id_processor)

@processors_bp.route('/api/v1/processors/<int:id_processor>', methods=['DELETE'])
@swag_from({
    'tags': ['Operations related to processors in the BIRDeep database'],
    'operationId': 'delete_processor',
    'summary': 'Delete a processor by ID',
    'description': 'Deletes a processor from the database.',
    'parameters': [
        {
            'name': 'id_processor',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'The ID of the processor to delete'
        }
    ],
    'responses': {
        200: {
            'description': 'Processor successfully deleted',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Processor not found',
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
def delete_processor_route(id_processor):
    return delete_processor(id_processor)
