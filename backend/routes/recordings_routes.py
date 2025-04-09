# /routes/recordings_routes.py

from flask import Blueprint
from controllers.recordings_controller import insert_new_recording, query_recordings, update_recording, delete_recording, get_recording_by_id, query_recordings_paginacion, query_recordings_paginacion_con_filtros
from flasgger import swag_from

recordings_bp = Blueprint('recordings', __name__)


@recordings_bp.route('/api/v1/recordings', methods=['POST'])
@swag_from({
    'tags': ['Recordings operations'],
    'operationId': 'insert_new_recording',
    'summary': 'Insert a new recording',
    'description': 'Insert a new recording into the database, ensuring that the associated recorder exists.',
    'parameters': [
        {
            'name': 'recorder_data',
            'in': 'body',
            'description': 'Recording data to insert',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_recorder_recordings': {
                        'type': 'integer',
                        'description': 'ID of the recorder for the recording'
                    },
                    'time_record': {
                        'type': 'string',
                        'format': 'date-time',
                        'description': 'Timestamp of the recording'
                    },
                    'filetype_record': {
                        'type': 'string',
                        'description': 'File type of the recording'
                    },
                    'bitrate_record': {
                        'type': 'integer',
                        'description': 'Bitrate of the recording'
                    },
                    'sample_rate_record': {
                        'type': 'integer',
                        'description': 'Sample rate of the recording'
                    },
                    'gain_record': {
                        'type': 'integer',
                        'description': 'Gain of the recording'
                    },
                    'duration_record': {
                        'type': 'integer',
                        'description': 'Duration of the recording in seconds'
                    },
                    'uri': {
                        'type': 'string',
                        'description': 'URI to access the recording file'
                    },
                    'device': {
                        'type': 'string',
                        'description': 'Device used for the recording'
                    },
                    'filename': {
                        'type': 'string',
                        'description': 'Filename of the recording'
                    }
                },
                'required': ['id_recorder_recordings', 'time_record']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Recording successfully inserted',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string',
                        'description': 'Success message'
                    }
                }
            }
        },
        400: {
            'description': 'Recorder not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string',
                        'description': 'Error message'
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
                        'description': 'Error message'
                    }
                }
            }
        }
    }
})
def insert_new_recording_route():
    return insert_new_recording()

@recordings_bp.route('/api/v1/recordings',methods=['GET'])
@swag_from({
    'tags': ['Recordings operations'],
    'operationId': 'query_recordings',
    'summary': 'Query all recordings',
    'description': 'Retrieve all recordings from the database.',
    'responses': {
        200: {
            'description': 'List of all recordings',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id_record': {'type': 'integer'},
                        'id_recorder_recordings': {'type': 'integer'},
                        'time_record': {'type': 'string', 'format': 'date-time'},
                        'filetype_record': {'type': 'string'},
                        'bitrate_record': {'type': 'integer'},
                        'sample_rate_record': {'type': 'integer'},
                        'gain_record': {'type': 'integer'},
                        'duration_record': {'type': 'integer'},
                        'uri': {'type': 'string'},
                        'device': {'type': 'string'},
                        'filename': {'type': 'string'}
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
def query_recordings_route():
    return query_recordings()

@recordings_bp.route('/api/v1/recordings/<int:id_record>', methods=['GET'])
@swag_from({
    'tags': ['Recordings operations'],
    'operationId': 'get_recording_by_id',
    'summary': 'Get recording by ID',
    'description': 'Retrieve a specific recording by its ID.',
    'parameters': [
        {
            'name': 'id_record',
            'in': 'path',
            'description': 'ID of the recording to retrieve',
            'required': True,
            'type': 'integer'
        }
    ],
    'responses': {
        200: {
            'description': 'Recording found',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_record': {'type': 'integer'},
                    'id_recorder_recordings': {'type': 'integer'},
                    'time_record': {'type': 'string', 'format': 'date-time'},
                    'filetype_record': {'type': 'string'},
                    'bitrate_record': {'type': 'integer'},
                    'sample_rate_record': {'type': 'integer'},
                    'gain_record': {'type': 'integer'},
                    'duration_record': {'type': 'integer'},
                    'uri': {'type': 'string'},
                    'device': {'type': 'string'},
                    'filename': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Recording not found',
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
def get_recording_by_id_route(id_record):
    return get_recording_by_id(id_record)

@recordings_bp.route('/api/v1/recordings/<int:id_record>',  methods=['PUT'])
@swag_from({
    'tags': ['Recordings operations'],
    'operationId': 'update_recording',
    'summary': 'Update recording',
    'description': 'Update a specific recording by its ID.',
    'parameters': [
        {
            'name': 'id_record',
            'in': 'path',
            'description': 'ID of the recording to update',
            'required': True,
            'type': 'integer'
        },
        {
            'name': 'body',
            'in': 'body',
            'description': 'Updated recording data',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_recorder_recordings': {'type': 'integer'},
                    'time_record': {'type': 'string', 'format': 'date-time'},
                    'filetype_record': {'type': 'string'},
                    'bitrate_record': {'type': 'integer'},
                    'sample_rate_record': {'type': 'integer'},
                    'gain_record': {'type': 'integer'},
                    'duration_record': {'type': 'integer'},
                    'uri': {'type': 'string'},
                    'device': {'type': 'string'},
                    'filename': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Recording updated successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Recording not found',
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
def update_recording_route(id_record):
    return update_recording(id_record)

@recordings_bp.route('/api/v1/recordings/<int:id_record>', methods=['DELETE'])
@swag_from({
    'tags': ['Recordings operations'],
    'operationId': 'delete_recording',
    'summary': 'Delete a recording',
    'description': 'Delete a specific recording by its ID.',
    'parameters': [
        {
            'name': 'id_record',
            'in': 'path',
            'description': 'ID of the recording to delete',
            'required': True,
            'type': 'integer'
        }
    ],
    'responses': {
        200: {
            'description': 'Recording deleted successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Recording not found',
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
def delete_recording_route(id_record):
    return delete_recording(id_record)

@recordings_bp.route('/api/v1/recordings_paginacion', methods=['GET'])
@swag_from({
    'tags': ['Recordings operations'],
    'operationId': 'query_recordings_paginacion',
    'summary': 'Query recordings with pagination',
    'description': 'Retrieve recordings from the database with pagination.',
    'parameters': [
        {
            'name': 'page',
            'in': 'query',
            'description': 'Page number for pagination (default is 1)',
            'required': False,
            'type': 'integer',
            'default': 1
        },
        {
            'name': 'per_page',
            'in': 'query',
            'description': 'Number of records per page (default is 10)',
            'required': False,
            'type': 'integer',
            'default': 10
        }
    ],
    'responses': {
        200: {
            'description': 'Paginated list of recordings',
            'schema': {
                'type': 'object',
                'properties': {
                    'results': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'id_record': {'type': 'integer'},
                                'id_recorder_recordings': {'type': 'integer'},
                                'time_record': {'type': 'string', 'format': 'date-time'},
                                'filetype_record': {'type': 'string'},
                                'bitrate_record': {'type': 'integer'},
                                'sample_rate_record': {'type': 'integer'},
                                'gain_record': {'type': 'integer'},
                                'duration_record': {'type': 'integer'},
                                'uri': {'type': 'string'},
                                'device': {'type': 'string'},
                                'filename': {'type': 'string'}
                            }
                        }
                    },
                    'total': {'type': 'integer'}
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
def query_recordings_paginacion_route():
    return query_recordings_paginacion()

@recordings_bp.route('/api/v1/recordings_filtradas', methods=['GET'])
@swag_from({
    'tags': ['Recordings operations'],
    'operationId': 'query_recordings_paginacion_con_filtros',
    'summary': 'Query recordings with filters and pagination',
    'description': 'Retrieve recordings from the database with filters and pagination.',
    'parameters': [
        {
            'name': 'page',
            'in': 'query',
            'description': 'Page number for pagination (default is 1)',
            'required': False,
            'type': 'integer',
            'default': 1
        },
        {
            'name': 'per_page',
            'in': 'query',
            'description': 'Number of records per page (default is 10)',
            'required': False,
            'type': 'integer',
            'default': 10
        },
        {
            'name': 'hora_inicio',
            'in': 'query',
            'description': 'Filter by start time of the recording',
            'required': False,
            'type': 'string',
            'format': 'time'
        },
        {
            'name': 'hora_fin',
            'in': 'query',
            'description': 'Filter by end time of the recording',
            'required': False,
            'type': 'string',
            'format': 'time'
        },
        {
            'name': 'fecha_inicio',
            'in': 'query',
            'description': 'Filter by start date of the recording',
            'required': False,
            'type': 'string',
            'format': 'date'
        },
        {
            'name': 'fecha_fin',
            'in': 'query',
            'description': 'Filter by end date of the recording',
            'required': False,
            'type': 'string',
            'format': 'date'
        },
        {
            'name': 'id_location',
            'in': 'query',
            'description': 'Filter by location ID of the recorder',
            'required': False,
            'type': 'integer'
        },
        {
            'name': 'filename',
            'in': 'query',
            'description': 'Filter by filename (case-insensitive)',
            'required': False,
            'type': 'string'
        }
    ],
    'responses': {
        200: {
            'description': 'Filtered and paginated list of recordings',
            'schema': {
                'type': 'object',
                'properties': {
                    'results': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'id_record': {'type': 'integer'},
                                'id_recorder_recordings': {'type': 'integer'},
                                'time_record': {'type': 'string', 'format': 'date-time'},
                                'filetype_record': {'type': 'string'},
                                'bitrate_record': {'type': 'integer'},
                                'sample_rate_record': {'type': 'integer'},
                                'gain_record': {'type': 'integer'},
                                'duration_record': {'type': 'integer'},
                                'uri': {'type': 'string'},
                                'device': {'type': 'string'},
                                'filename': {'type': 'string'}
                            }
                        }
                    },
                    'total': {'type': 'integer'}
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
def query_recordings_paginacion_con_filtros_route():
    return query_recordings_paginacion_con_filtros()