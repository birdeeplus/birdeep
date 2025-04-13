from flask import Blueprint
from controllers.insert_files_controller import insert_files
from flasgger import swag_from

insert_files_bp = Blueprint('insert_files', __name__)

@insert_files_bp.route('/api/v1/insert_files', methods=['POST'])
@swag_from({
    'tags': ['Insert Files'],
    'operationId': 'insert_files',
    'summary': 'Insert new files',
    'description': 'Uploads one or more audio files along with associated metadata (JSON) and stores them in internal storage.',
    'consumes': ['multipart/form-data'],
    'parameters': [
        {
            'name': 'json_data',
            'in': 'formData',
            'required': True,
            'type': 'string',
            'description': 'JSON string with metadata associated with the uploaded files',
            'example': '{"id_location": 1, "installation_date": "2023-12-01", "status": "active"}'
        },
        {
            'name': 'files',
            'in': 'formData',
            'required': True,
            'type': 'file',
            'description': 'One or more audio files to upload',
            'collectionFormat': 'multi'
        }
    ],
    'responses': {
        200: {
            'description': 'Files successfully uploaded and registered',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'uploaded_files': {
                        'type': 'array',
                        'items': {'type': 'string'}
                    }
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
def insert_files_route():
    return insert_files()
