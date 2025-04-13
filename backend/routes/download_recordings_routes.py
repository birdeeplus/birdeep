from flask import Blueprint
from controllers.download_recordings_controller import (
    download_recording,
    download_all_recordings,
    spectrogram
)
from flasgger import swag_from

download_recordings_bp = Blueprint('download_recordings', __name__)

@download_recordings_bp.route('/api/v1/download_recording', methods=['GET'])
@swag_from({
    'tags': ['Download Recordings'],
    'operationId': 'download_recording',
    'summary': 'Download a single recording',
    'description': 'Downloads a single audio recording from the server based on the file path provided in the request body.',
    'consumes': ['text/plain'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'string',
                'example': '/path/to/audio.wav'
            },
            'description': 'The absolute path to the audio file you want to download.'
        }
    ],
    'responses': {
        200: {
            'description': 'Audio file successfully downloaded',
            'schema': {
                'type': 'file'
            }
        },
        404: {
            'description': 'Audio file not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def download_recording_route():
    return download_recording()


@download_recordings_bp.route('/api/v1/download_all_recordings', methods=['GET'])
@swag_from({
    'tags': ['Download Recordings'],
    'operationId': 'download_all_recordings',
    'summary': 'Download all recordings as ZIP',
    'description': 'Downloads all available audio recordings in a ZIP file.',
    'responses': {
        200: {
            'description': 'ZIP file successfully downloaded',
            'schema': {
                'type': 'file'
            }
        }
    }
})
def download_all_recordings_route():
    return download_all_recordings()


@download_recordings_bp.route('/api/v1/spectrogram', methods=['GET'])
@swag_from({
    'tags': ['Download Recordings'],
    'operationId': 'spectrogram',
    'summary': 'Generate spectrogram from audio',
    'description': 'Generates a spectrogram from an audio file using its URI path.',
    'parameters': [
        {
            'name': 'uri',
            'in': 'query',
            'type': 'string',
            'required': True,
            'description': 'The absolute path to the audio file.'
        }
    ],
    'responses': {
        200: {
            'description': 'Spectrogram generated successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'audio_url': {'type': 'string'},
                    'datos_csv': {'type': 'string'}
                }
            }
        },
        400: {
            'description': 'Missing or invalid URI',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def spectrogram_route():
    return spectrogram()
