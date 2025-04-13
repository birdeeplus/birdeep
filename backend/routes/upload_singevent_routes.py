from flask import Blueprint
from controllers.upload_singevent_controller import upload_folder
from flasgger import swag_from

upload_singevent_bp = Blueprint('upload_singevent', __name__)

@upload_singevent_bp.route('/api/v1/upload_singevent', methods=['POST'])
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
