from flask import Blueprint
from controllers.diagnostics_controller import insert_new_diagnostic, query_diagnostics, update_diagnostic, delete_diagnostic
from flasgger import swag_from

diagnostics_bp = Blueprint('diagnostics', __name__)

@diagnostics_bp.route('/api/v1/diagnostics', methods=['POST'])
@swag_from({
    'tags': ['Diagnostics operations'],
    'operationId': 'insert_new_diagnostic',
    'summary': 'Insert a new diagnostic',
    'description': 'Adds a new diagnostic record to the database.',
    'parameters': [
        {
            'name': 'diagnostic_data',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_diagnostic': {'type': 'string'},
                    'description': {'type': 'string'},
                    'severity': {'type': 'string', 'enum': ['low', 'medium', 'high']}
                },
                'required': ['name_diagnostic']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Diagnostic successfully inserted',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_diagnostic': {'type': 'integer'},
                    'name_diagnostic': {'type': 'string'},
                    'description': {'type': 'string'},
                    'severity': {'type': 'string'}
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
        }
    }
})
def insert_new_diagnostic_route():
    return insert_new_diagnostic()

@diagnostics_bp.route('/api/v1/diagnostics', methods=['GET'])
@swag_from({
    'tags': ['Diagnostics operations'],
    'operationId': 'query_diagnostics',
    'summary': 'Query diagnostics',
    'description': 'Retrieves all diagnostic records from the database.',
    'responses': {
        200: {
            'description': 'List of diagnostics',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id_diagnostic': {'type': 'integer'},
                        'name_diagnostic': {'type': 'string'},
                        'description': {'type': 'string'},
                        'severity': {'type': 'string'}
                    }
                }
            }
        }
    }
})
def query_diagnostics_route():
    return query_diagnostics()

@diagnostics_bp.route('/api/v1/diagnostics/<int:id_diagnostic>', methods=['PUT'])
@swag_from({
    'tags': ['Diagnostics operations'],
    'operationId': 'update_diagnostic',
    'summary': 'Update a diagnostic',
    'description': 'Updates a diagnostic record based on the provided ID.',
    'parameters': [
        {
            'name': 'id_diagnostic',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The ID of the diagnostic to update'
        },
        {
            'name': 'diagnostic_data',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_diagnostic': {'type': 'string'},
                    'description': {'type': 'string'},
                    'severity': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Diagnostic successfully updated',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_diagnostic': {'type': 'integer'},
                    'name_diagnostic': {'type': 'string'},
                    'description': {'type': 'string'},
                    'severity': {'type': 'string'}
                }
            }
        },
        400: {
            'description': 'Invalid input or data format',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Diagnostic not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def update_diagnostic_route(id_diagnostic):
    return update_diagnostic(id_diagnostic)

@diagnostics_bp.route('/api/v1/diagnostics/<int:id_diagnostic>', methods=['DELETE'])
@swag_from({
    'tags': ['Diagnostics operations'],
    'operationId': 'delete_diagnostic',
    'summary': 'Delete a diagnostic',
    'description': 'Deletes a diagnostic record based on the provided ID.',
    'parameters': [
        {
            'name': 'id_diagnostic',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The ID of the diagnostic to delete'
        }
    ],
    'responses': {
        200: {
            'description': 'Diagnostic successfully deleted',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Diagnostic not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def delete_diagnostic_route(id_diagnostic):
    return delete_diagnostic(id_diagnostic)
