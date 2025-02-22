# app.py

import zipfile
import librosa
from flask import Flask, request, send_file, url_for
from flasgger import Swagger, swag_from
# Imports from our modules
from crud_operations import *
from autentication import *
from error_handlers import *
from models import (db, Diagnostics, Species, SingEvents, Recordings, Recorders,
                    Microphones, Processors, Locations, LogRecorders)
from config import config
from flask_cors import CORS, cross_origin
import json
import numpy as np


def create_swagger_template():
    template = {
        "swagger": "2.0",
        "info": {
            "title": "BIRDeep API",
            "description": "API for Doñana BIRDeep project",
            "contact": {
                "responsibleOrganization": "Biological Station of Doñana (EBD)",
                "responsibleDeveloper": "Me",
                "email": "me@me.com",
                "url": "www.me.com",
            },
            "termsOfService": "https://me.com/terms",
            "version": "0.1"
        },
        # "host": "mysite.com",  # overrides localhost:500
        # "basePath": "/api",  # base bash for blueprint registration
        "schemes": [
            "http",
            "https"
        ],
        "operationId": "getmyData"
    }

    return template


def create_app(environment_fn):
    """
    Funcion para crear la app Flask, en este caso la API
    :param environment_fn: Objeto generado en el archivo de configuracion y que llamamos a la configuracion
    :return:
    """

    app_fn = Flask(__name__)

    # Definimos aquí que tome la configuracion del archivo de configuracion
    app_fn.config.from_object(environment_fn)
    swagger_template = create_swagger_template()
    Swagger(app_fn, template=swagger_template)
    jwt = JWTManager(app_fn)
    CORS(app_fn, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Asociamos la base de datos con el la aplicacion flask
    with app_fn.app_context():
        db.init_app(app_fn)
        db.create_all()

    return app_fn


environment = config['development']
app = create_app(environment)


# --------------- API ROUTES ---------------
# --------------- LOGIN ---------------
@app.route('/api/v1/login', methods=['POST'])
@swag_from({
    'tags': ['Login and Security'],
    'methods': ['POST'],
    'parameters': [{
        'name': 'body',
        'in': 'body',
        'required': True,
        'schema': {
            'type': 'object',
            'properties': {
                'username': {
                    'type': 'string'
                },
                'password': {
                    'type': 'string'
                }
            }
        }
    }],
    'responses': {
        200: {
            'description': 'JWT token returned'
        }
    }
})
def login():
    valid_user = app.config['JWT_USER']
    valid_password = app.config['JWT_PASSWORD']
    token = jwt_token_creation(request, valid_user, valid_password)
    if token['code'] == 200:
        return jsonify(acces_token=token['token']), token['code']
    else:
        return jsonify(message=token['message']), token['code']


# --------------- LOG RECORDERS -------------
@cross_origin()
@app.route('/insert_status', methods=['POST'])
@swag_from({
    'tags': ['Log_Recorder'],
    'methods': ['POST'],
    'summary': 'Insert new status of recorder in database',
    'description': 'This functions creates a new record in table log_recorder from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_recorder': {
                        'type': 'integer'
                    },
                    'time_log': {
                        'type': 'string (ISO 8601 format)'
                    },
                    'temperature_log': {
                        'type': 'integer'
                    }
                },
                'example': {
                    'id_recorder': 1,
                    'time_log': '2000-12-01 00:00:00',
                    'temperature_log': 30,
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Log created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_status():
    response = insert_values_in_db(request, LogRecorders)
    return jsonify(response), 200


# --------------- DIAGNOSTICS ---------------
# Insert new records
@cross_origin()
@app.route('/api/v1/diagnostics', methods=['POST'])
@swag_from({
    'tags': ['Diagnostics'],
    'methods': ['POST'],
    'summary': 'Insert new diagnostics in database',
    'description': 'This functions creates a new record in table diagnostics from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_record': {
                        'type': 'integer'
                    },
                    'time_executed': {
                        'type': 'string (ISO 8601 format)'
                    },
                    'used_model': {
                        'type': 'string'
                    },
                    'model_version': {
                        'type': 'string'
                    },
                    'pretreatment': {
                        'type': 'string'
                    },
                    'created_by': {
                        'type': 'string'
                    }
                },
                'example': {
                    'id_record': 1,
                    'time_executed': '2000-12-01 00:00:00',
                    'used_model': 'prueba',
                    'model_version': '0.0',
                    'pretreatment': 'prueba_pretreatment',
                    'created_by': 'usuario'
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Diagnostic created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_new_diagnostic():
    response = insert_values_in_db(request, Diagnostics, app.config['TRANSLATION_DIAGNOSTIC_DICT'])
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/diagnostics', methods=['GET'])
@swag_from({
    'tags': ['Diagnostics'],
    'methods': ['GET'],
    'summary': 'Query diagnostics in database',
    'description': 'This functions query records in table diagnostics from BIRDeep database',
    'parameters': [
        {'name': 'id_diagnostic', 'in': 'query', 'type': 'integer'},
        {'name': 'id_record_diagnostic', 'in': 'query', 'type': 'integer'},
        {'name': 'time_executed', 'in': 'query', 'type': 'string (ISO 8601 format)'},
        {'name': 'used_model', 'in': 'query', 'type': 'string'},
        {'name': 'model_version', 'in': 'query', 'type': 'string'},
        {'name': 'pretreatment', 'in ': 'query', 'type': 'string'},
        {'name': 'created_by', 'in': 'query', 'type': 'string'}
    ],
    'responses': {
        200: {
            'description': 'Array of diagnostics in query',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def query_diagnostics():
    response = get_values_from_db(request, Diagnostics)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/diagnostics/<int:id_diagnostic>', methods=['PUT'])
@swag_from({
    'tags': ['Diagnostics'],
    'methods': ['PUT'],
    'summary': 'Update info for a diagnostic stored in database',
    'description': 'This functions updates values in table diagnostics from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_diagnostic',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_record_diagnostic': {
                        'type': 'integer'
                    },
                    'time_executed': {
                        'type': 'string (ISO 8601 format)'
                    },
                    'used_model': {
                        'type': 'string'
                    },
                    'model_version': {
                        'type': 'string'
                    },
                    'pretreatment': {
                        'type': 'string'
                    },
                    'created_by': {
                        'type': 'string'
                    }
                },
                'example': {
                    'id_record_diagnostic': 1,
                    'time_executed': '2112-12-01 23:59:59',
                    'used_model': 'prueba_upd',
                    'model_version': '0.5',
                    'pretreatment': 'prueba_pre_upd',
                    'created_by': 'upd_user'
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'diagnostic information updated in database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def update_diagnostic(id_diagnostic):
    response = update_values_in_db(request, id_diagnostic, Diagnostics)
    return jsonify(response), 200

@cross_origin()
@app.route('/api/v1/diagnostics/<int:id_diagnostic>', methods=['DELETE'])
@swag_from({
    'tags': ['Diagnostics'],
    'methods': ['DELETE'],
    'summary': 'DELETE record for a diagnostic stored in database according their ID',
    'description': 'This functions updates values in table diagnostics from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_diagnostic',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
    ],
    'responses': {
        200: {
            'description': 'diagnostic information deleted from database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def delete_diagnostic(id_diagnostic):
    response = delete_values_in_db(id_diagnostic, Diagnostics)
    return jsonify(response), 200


# --------------- SPECIES ---------------
# Insert New Specie in Database
@cross_origin()
@app.route('/api/v1/species', methods=['POST'])
@swag_from({
    'tags': ['Species'],
    'methods': ['POST'],
    'summary': 'Insert new specie in database',
    'description': 'This functions creates a new record in table species from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'scientific_name': {
                        'type': 'string'
                    },
                    'spanish_name': {
                        'type': 'string'
                    },
                    'english_name': {
                        'type': 'string'
                    },
                    'short_name': {
                        'type': 'string'
                    },
                    'family': {
                        'type': 'string'
                    }
                },
                'example': {
                    'scientific_name': 'Phoenicopterus roseus',
                    'spanish_name': 'Flamenco común',
                    'english_name': 'Greater Flamingo',
                    'short_name': 'flamenco rosa',
                    'family': 'Phoenicopteridae',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Specie created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_new_specie():
    response = insert_values_in_db(request, Species)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/species', methods=['GET'])
@swag_from({
    'tags': ['Species'],
    'methods': ['GET'],
    'summary': 'Query diagnostics in database',
    'description': 'This functions query records in table species from BIRDeep database',
    'parameters': [
        {'name': 'scientific_name', 'in': 'query', 'type': 'string'},
        {'name': 'spanish_name', 'in': 'query', 'type': 'string'},
        {'name': 'english_name', 'in ': 'query', 'type': 'string'},
        {'name': 'short_name', 'in': 'query', 'type': 'string'},
        {'name': 'family', 'in': 'query', 'type': 'string'},
    ],
    'responses': {
        200: {
            'description': 'Array of species in query',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def query_species():
    response = get_values_from_db(request, Species)
    return jsonify(response), 200


# Update an existing specie
@cross_origin()
@app.route('/api/v1/species/<int:id_specie>', methods=['PUT'])
@swag_from({
    'tags': ['Species'],
    'methods': ['PUT'],
    'summary': 'Update an specie record stored in database',
    'description': 'This functions updates values in table species from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'scientific_name',
            'in': 'path',
            'type': 'string',
            'required': True,
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'spanish_name': {
                        'type': 'string'
                    },
                    'english_name': {
                        'type': 'string'
                    },
                    'short_name': {
                        'type': 'string'
                    },
                    'family': {
                        'type': 'string'
                    }
                },
                'example': {
                    'scientific_name': 'Hirundo Lucida',
                    'spanish_name': 'Golondrina Africana',
                    'english_name': 'Lesser Striped Swallow',
                    'short_name': 'Golondrina Rayada',
                    'family':'Hirundinidae',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Specie created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def update_specie(id_specie):
    response = update_values_in_db(request, id_specie, Species)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/species/<int:id_specie>', methods=['DELETE'])
@swag_from({
    'tags': ['Species'],
    'methods': ['DELETE'],
    'summary': 'DELETE record for a specie stored in database according their ID',
    'description': 'This functions updates values in table species from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'scientific_name',
            'in': 'path',
            'type': 'string',
            'required': True,
        },
    ],
    'responses': {
        200: {
            'description': 'specie information deleted from database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def delete_specie(id_specie):
    response = delete_values_in_db(id_specie, Species)
    return jsonify(response), 200


# --------------- SING EVENTS ---------------
@cross_origin()
@app.route('/api/v1/sing_events', methods=['POST'])
@swag_from({
    'tags': ['Sing Events'],
    'methods': ['POST'],
    'summary': 'Insert new sing event in database',
    'description': 'This functions creates a new record in table sing_events from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_diagnostic': {'type': 'integer'},
                    'scientific_name_specie': {'type': 'string'},
                    'time': {'type': 'string (ISO 8601 format)'},
                    'start': {'type': 'integer'},
                    'end': {'type': 'integer'},
                    'overlap': {'type': 'boolean'},
                    'confidence': {'type': 'float'},
                    'sensitivity': {'type': 'float'},
                    'quality_score': {'type': 'float'},
                    'comment': {'type': 'string'}
                },
                'example': {
                    'id_diagnostic': 1,
                    'scientific_name_specie': 'specie',
                    'time': '2000-12-1 00:00:00',
                    'start': 12,
                    'end': 24,
                    'overlap': True,
                    'confidence': 0.5,
                    'sensitivity': 0.5,
                    'quality_score': 0.5,
                    'comment':'comentario',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Sing Event created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_new_sing_event():
    response = insert_values_in_db(request, SingEvents, app.config['TRANSLATION_SINGEVENTS_DICT'])
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/sing_events', methods=['GET'])
@swag_from({
    'tags': ['Sing Events'],
    'methods': ['GET'],
    'summary': 'Query sing events in database',
    'description': 'This functions query records in table sing_events from BIRDeep database',
    'parameters': [
        {'name': 'id_event', 'in': 'query', 'type': 'integer'},
        {'name': 'id_diagnostic_event', 'in': 'query', 'type': 'integer'},
        {'name': 'scientific_name_specie', 'in': 'query', 'type': 'string'},
        {'name': 'time_event', 'in': 'query', 'type': 'text (ISO 8601 format)'},
        {'name': 'start_event', 'in': 'query', 'type': 'integer'},
        {'name': 'end_event', 'in': 'query', 'type': 'integer'},
        {'name': 'overlap_event', 'in': 'query', 'type': 'boolean'},
        {'name': 'confidence_event', 'in': 'query', 'type': 'float'},
        {'name': 'sensitivity_event', 'in': 'query', 'type': 'float'},
        {'name': 'quality_score_manual_event', 'in': 'query', 'type': 'float'},
        {'name': 'comment', 'in': 'query', 'type': 'text'},
    ],
    'responses': {
        200: {
            'description': 'Array of sing_events in query',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def query_sing_events():
    response = get_values_from_db(request, SingEvents)
    return jsonify(response), 200

@cross_origin()
@app.route('/api/v1/sing_events/<int:id_event>', methods=['PUT'])
@swag_from({
    'tags': ['Sing Events'],
    'methods': ['PUT'],
    'summary': 'Update info for a sing_event stored in database',
    'description': 'This functions updates values in table sing_events from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_event',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_diagnostic': {'type': 'integer'},
                    'scientific_name_specie': {'type': 'string'},
                    'time': {'type': 'string (ISO 8601 format)'},
                    'start': {'type': 'integer'},
                    'end': {'type': 'integer'},
                    'overlap': {'type': 'boolean'},
                    'confidence': {'type': 'float'},
                    'sensitivity': {'type': 'float'},
                    'quality_score': {'type': 'float'},
                    'comment': {'type': 'string'}
                },
                'example': {
                    'id_diagnostic': 2,
                    'scientific_name_specie': 'specie 2',
                    'time': '2000-12-2 12:00:00',
                    'start': 13,
                    'end': 22,
                    'overlap': False,
                    'confidence': 0.3,
                    'sensitivity': 0.3,
                    'quality_score': 0.3,
                    'comment': 'nuevo comentario',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'sing_event information updated in database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def update_sing_event(id_event):
    response = update_values_in_db(request, id_event, SingEvents, app.config['TRANSLATION_SINGEVENTS_DICT'])
    return jsonify(response), 200

@cross_origin()
@app.route('/api/v1/sing_events/<int:id_event>', methods=['DELETE'])
@swag_from({
    'tags': ['Sing Events'],
    'methods': ['DELETE'],
    'summary': 'DELETE record for a sing_event stored in database according their ID',
    'description': 'This functions updates values in table sing_events from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_event',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
    ],
    'responses': {
        200: {
            'description': 'sing_event information deleted from database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def delete_sing_event(id_event):
    response = delete_values_in_db(id_event, SingEvents)
    return jsonify(response), 200


# --------------- RECORDINGS ---------------
@cross_origin()
@app.route('/api/v1/recordings', methods=['POST'])
@swag_from({
    'tags': ['Recordings'],
    'methods': ['POST'],
    'summary': 'Insert new recordings in database',
    'description': 'This functions creates a new record in table recordings from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_recorder': {'type': 'integer'},
                    'time': {'type': 'string (ISO 8601 format)'},
                    'filetype': {'type': 'string'},
                    'bitrate': {'type': 'integer'},
                    'sample_rate': {'type': 'string'},
                    'gain': {'type': 'float'},
                    'duration': {'type': 'integer'},
                    'uri': {'type': 'string'},
                    'device': {'type': 'string'},
                },
                'example': {
                    'id_recorder': 1,
                    'time': '2000-12-1 00:00:00',
                    'filetype': 'mp4',
                    'bitrate': 192,
                    'sample_rate': '1.5',
                    'gain': 0.5,
                    'duration': 2,
                    'uri': 'URI_FALSA',
                    'device': 'TEST',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'recording created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_new_recording():

    response = insert_values_in_db(request, Recordings, app.config['TRANSLATION_RECORDINGS_DICT'])
    return jsonify(response), 200

@cross_origin()
@app.route('/api/v1/recordings', methods=['GET'])
@swag_from({
    'tags': ['Recordings'],
    'methods': ['GET'],
    'summary': 'Query recordings in database',
    'description': 'This functions query records in table recordings from BIRDeep database',
    'parameters': [
        {'name': 'id_record', 'in': 'query', 'type': 'integer'},
        {'name': 'id_recorder_recordings', 'in': 'query', 'type': 'integer'},
        {'name': 'time_record', 'in': 'query', 'type': 'string (ISO 8601 format)'},
        {'name': 'filetype_record', 'in': 'query', 'type': 'string'},
        {'name': 'bitrate_record', 'in': 'query', 'type': 'integer'},
        {'name': 'sample_rate_record', 'in': 'query', 'type': 'string'},
        {'name': 'gain_record', 'in': 'query', 'type': 'float'},
        {'name': 'duration_record', 'in': 'query', 'type': 'integer'},
        {'name': 'uri', 'in': 'query', 'type': 'string'},
        {'name': 'device', 'in': 'query', 'type': 'string'},
    ],
    'responses': {
        200: {
            'description': 'Array of recordings in query',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def query_recordings():
    response = get_values_from_db(request, Recordings)
    return jsonify(response), 200

@cross_origin()
@app.route('/api/v1/recordings/<int:id_record>', methods=['PUT'])
@swag_from({
    'tags': ['Recordings'],
    'methods': ['PUT'],
    'summary': 'Update info for a recording stored in database',
    'description': 'This functions updates values in table recordings from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_record',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_recorder': {'type': 'integer'},
                    'time': {'type': 'string (ISO 8601 format)'},
                    'filetype': {'type': 'string'},
                    'bitrate': {'type': 'integer'},
                    'sample_rate': {'type': 'string'},
                    'gain': {'type': 'float'},
                    'duration': {'type': 'integer'},
                    'uri': {'type': 'string'},
                    'device': {'type': 'string'},
                },
                'example': {
                    'id_recorder': 1,
                    'time': '2000-12-1 00:00:00',
                    'filetype': 'mp4',
                    'bitrate': 192,
                    'sample_rate': '1.5',
                    'gain': 0.5,
                    'duration': 2,
                    'uri': 'uri_actualizada',
                    'device': 'dispositivo_actualizado',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'recording information updated in database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def update_recording(id_record):

    response = update_values_in_db(request, id_record, Recordings, app.config['TRANSLATION_RECORDINGS_DICT'])
    return jsonify(response), 200

@cross_origin()
@app.route('/api/v1/recordings/<int:id_record>', methods=['DELETE'])
@swag_from({
    'tags': ['Recordings'],
    'methods': ['DELETE'],
    'summary': 'DELETE record for a recording stored in database according their ID',
    'description': 'This functions updates values in table recordings from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_record',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
    ],
    'responses': {
        200: {
            'description': 'recording information deleted from database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def delete_recording(id_record):
    response = delete_values_in_db(id_record, Recordings)
    return jsonify(response), 200


# --------------- RECORDERS ---------------
@cross_origin()
@app.route('/api/v1/recorders', methods=['POST'])
@swag_from({
    'tags': ['Recorders'],
    'methods': ['POST'],
    'summary': 'Insert new recorders in database',
    'description': 'This functions creates a new record in table recorders from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_location_recorder': {
                        'type': 'integer'
                    },
                    'id_microphone_recorder': {
                        'type': 'integer'
                    },
                    'id_processor_recorder': {
                        'type': 'integer'
                    },
                    'status': {
                        'type': 'string (ISO 8601 format)'
                    },
                    'recorder_name': {
                        'type': 'string'
                    },
                    'installation_date': {
                        'type': 'string (ISO 8601 format)'
                    }
                },
                'example': {
                    'id_location_recorder': 1,
                    'id_microphone_recorder': 1,
                    'id_processor_recorder': 1,
                    'status': '2000-12-1 00:00:00',
                    'recorder_name': 'name',
                    'installation_date':'2000-12-1 00:00:00',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'recorder created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_new_recorder():
    response = insert_values_in_db(request, Recorders, app.config['TRANSLATION_RECORDERS_DICT'])
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/recorders', methods=['GET'])
@swag_from({
    'tags': ['Recorders'],
    'methods': ['GET'],
    'summary': 'Query recorders in database',
    'description': 'This functions query records in table recorders from BIRDeep database',
    'parameters': [
        {'name': 'id_recorder', 'in': 'query', 'type': 'integer'},
        {'name': 'id_location_recorder', 'in': 'query', 'type': 'integer'},
        {'name': 'id_microphone_recorder', 'in': 'query', 'type': 'integer'},
        {'name': 'id_processor_recorder', 'in ': 'query', 'type': 'integer'},
        {'name': 'status', 'in': 'query', 'type': 'string (ISO 8601 format)'},
        {'name': 'recorder_name', 'in': 'query', 'type': 'string'},
        {'name': 'installation_date', 'in': 'query', 'type': 'string (ISO 8601 format)'}
    ],
    'responses': {
        200: {
            'description': 'Array of recorders in query',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def query_recorders():
    response = get_values_from_db(request, Recorders)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/recorders/<int:id_recorder>', methods=['PUT'])
@swag_from({
    'tags': ['Recorders'],
    'methods': ['PUT'],
    'summary': 'Update info for a recorder stored in database',
    'description': 'This functions updates values in table recorders from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_recorder',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id_location_recorder': {
                        'type': 'integer'
                    },
                    'id_microphone_recorder': {
                        'type': 'integer'
                    },
                    'id_processor_recorder': {
                        'type': 'integer'
                    },
                    'status': {
                        'type': 'string (ISO 8601 format)'
                    },
                    'recorder_name': {
                        'type': 'string'
                    },
                    'installation_date': {
                        'type': 'string (ISO 8601 format)'
                    },
                },
                'example': {
                    'id_location_recorder': 2,
                    'id_microphone_recorder': 2,
                    'id_processor_recorder': 2,
                    'status': '2000-12-1 00:00:00',
                    'recorder_name':'name1',
                    'installation_date':'2000-12-1 00:00:00',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Recorder information updated in database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def update_recorder(id_recorder):
    response = update_values_in_db(request, id_recorder, Recorders)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/recorders/<int:id_recorder>', methods=['DELETE'])
@swag_from({
    'tags': ['Recorders'],
    'methods': ['DELETE'],
    'summary': 'DELETE record for a recorder stored in database according their ID',
    'description': 'This functions updates values in table recorders from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_recorder',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
    ],
    'responses': {
        200: {
            'description': 'recorder information deleted from database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def delete_recorder(id_recorder):
    response = delete_values_in_db(id_recorder, Recorders)
    return jsonify(response), 200


# --------------- MICROPHONES ---------------
@cross_origin()
@app.route('/api/v1/microphones', methods=['POST'])
@swag_from({
    'tags': ['Microphones'],
    'methods': ['POST'],
    'summary': 'Insert new microphones in database',
    'description': 'This functions creates a new record in table microphones from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_microphone': {
                        'type': 'string'
                    },
                    'model_microphone': {
                        'type': 'string'
                    },
                    'comment_microphone': {
                        'type': 'string'
                    },
                },
                'example': {
                    'name_microphone': 'Name microphone',
                    'model_microphone': 'Rode',
                    'comment_microphone': 'Esto es una prueba de creacion',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Microphone created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_new_microphone():
    response = insert_values_in_db(request, Microphones)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/microphones', methods=['GET'])
@swag_from({
    'tags': ['Microphones'],
    'methods': ['GET'],
    'summary': 'Query microphones in database',
    'description': 'This functions query records in table microphones from BIRDeep database',
    'parameters': [
        {'name': 'id_microphone', 'in': 'query', 'type': 'integer'},
        {'name': 'name_microphone', 'in': 'query', 'type': 'string'},
        {'name': 'model_microphone', 'in': 'query', 'type': 'string'},
        {'name': 'comment_microphone', 'in': 'query', 'type': 'string'},
    ],
    'responses': {
        200: {
            'description': 'Array of microphones in query',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def query_microphones():
    response = get_values_from_db(request, Microphones)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/microphones/<int:id_microphone>', methods=['PUT'])
@swag_from({
    'tags': ['Microphones'],
    'methods': ['PUT'],
    'summary': 'Update info for a microphone stored in database',
    'description': 'This functions updates values in table microphones from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_microphone',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_microphone': {
                        'type': 'string'
                    },
                    'model_microphone': {
                        'type': 'string'
                    },
                    'comment_microphone': {
                        'type': 'string'
                    },
                },
                'example': {
                    'name_microphone': 'Other name',
                    'model_microphone': 'Senheisser',
                    'comment_microphone': 'Esto es una prueba de actualizacion',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Microphone information updated in database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def update_microphone(id_microphone):
    response = update_values_in_db(request, id_microphone, Microphones)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/microphones/<int:id_microphone>', methods=['DELETE'])
@swag_from({
    'tags': ['Microphones'],
    'methods': ['DELETE'],
    'summary': 'DELETE record for a microphone stored in database according their ID',
    'description': 'This functions updates values in table microphones from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_microphone',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
    ],
    'responses': {
        200: {
            'description': 'microphone information deleted from database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def delete_microphone(id_microphone):
    response = delete_values_in_db(id_microphone, Microphones)
    return jsonify(response), 200


# --------------- PROCESSORS ---------------
@cross_origin()
@app.route('/api/v1/processors', methods=['POST'])
@swag_from({
    'tags': ['Processors'],
    'methods': ['POST'],
    'summary': 'Insert new processors in database',
    'description': 'This functions creates a new record in table processors from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_processor': {
                        'type': 'string'
                    },
                    'model_processor': {
                        'type': 'string'
                    },
                    'comment_processor': {
                        'type': 'string'
                    },
                },
                'example': {
                    'name_processor': 'Name processor',
                    'model_processor': 'Raspberry Zero',
                    'comment_processor': 'Esto es una prueba',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'processor created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_new_processor():

    response = insert_values_in_db(request, Processors)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/processors', methods=['GET'])
@swag_from({
    'tags': ['Processors'],
    'methods': ['GET'],
    'summary': 'Query processors in database',
    'description': 'This functions query records in table processors from BIRDeep database',
    'parameters': [
        {'name': 'id_processor', 'in': 'query', 'type': 'integer'},
        {'name': 'name_processor', 'in': 'query', 'type': 'string'},
        {'name': 'model_processor', 'in': 'query', 'type': 'string'},
        {'name': 'comment_processor', 'in': 'query', 'type': 'string'},
    ],
    'responses': {
        200: {
            'description': 'Array of processors in query',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def query_processors():
    response = get_values_from_db(request, Processors)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/processors/<int:id_processor>', methods=['PUT'])
@swag_from({
    'tags': ['Processors'],
    'methods': ['PUT'],
    'summary': 'Update info for a processor stored in database',
    'description': 'This functions updates values in table processors from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_processor',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_processor': {
                        'type': 'string'
                    },
                    'model_processor': {
                        'type': 'string'
                    },
                    'comment_processor': {
                        'type': 'string'
                    },
                },
                'example': {
                    'name_processor': 'Name processor',
                    'model_processor': 'Orange Pi',
                    'comment_processor': 'Esto es una prueba de actualizacion del procesador',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'processor information updated in database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def update_processor(id_processor):
    response = update_values_in_db(request, id_processor, Processors)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/processors/<int:id_processor>', methods=['DELETE'])
@swag_from({
    'tags': ['Processors'],
    'methods': ['DELETE'],
    'summary': 'DELETE record for a processor stored in database according their ID',
    'description': 'This functions updates values in table processors from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_processor',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
    ],
    'responses': {
        200: {
            'description': 'processor information deleted from database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def delete_processor(id_processor):
    response = delete_values_in_db(id_processor, Processors)
    return jsonify(response), 200


# --------------- LOCATIONS ---------------
@cross_origin()
@app.route('/api/v1/locations', methods=['POST'])
@swag_from({
    'tags': ['Locations'],
    'methods': ['POST'],
    'summary': 'Insert new locations in database',
    'description': 'This functions creates a new record in table locations from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_location': {
                        'type': 'string'
                    },
                    'latitude_location': {
                        'type': 'float'
                    },
                    'longitude_location': {
                        'type': 'float'
                    },
                    'habitat_location': {
                        'type': 'string'
                    },
                },
                'example': {
                    'name_location': 'Laguna Prueba',
                    'latitude_location': 0.5,
                    'longitude_location': 0.5,
                    'habitat_location': 'Tundra',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'location created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_new_location():

    response = insert_values_in_db(request, Locations)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/locations', methods=['GET'])
@swag_from({
    'tags': ['Locations'],
    'methods': ['GET'],
    'summary': 'Query locations in database',
    'description': 'This functions query records in table locations from BIRDeep database',
    'parameters': [
        {'name': 'name_location', 'in ': 'query', 'type': 'string'},
        {'name': 'id_location', 'in': 'query', 'type': 'integer'},
        {'name': 'latitude_location', 'in': 'query', 'type': 'float'},
        {'name': 'longitude_location', 'in': 'query', 'type': 'float'},
        {'name': 'habitat_location', 'in': 'query', 'type': 'string'}
    ],
    'responses': {
        200: {
            'description': 'Array of locations in query',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def query_locations():
    response = get_values_from_db(request, Locations)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/locations/<int:id_location>', methods=['PUT'])
@swag_from({
    'tags': ['Locations'],
    'methods': ['PUT'],
    'summary': 'Update info for a location stored in database',
    'description': 'This functions updates values in table locations from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_location',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_location': {
                        'type': 'string'
                    },
                    'latitude_location': {
                        'type': 'float'
                    },
                    'longitude_location': {
                        'type': 'float'
                    },
                    'habitat_location': {
                        'type': 'string'
                    },
                },
                'example': {
                    'name_location': 'Duna Prueba',
                    'latitude_location': 1.0,
                    'longitude_location': 1.0,
                    'habitat_location': 'Desierto',
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'location information updated in database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def update_location(id_location):
    response = update_values_in_db(request, id_location, Locations)
    return jsonify(response), 200


@cross_origin()
@app.route('/api/v1/locations/<int:id_location>', methods=['DELETE'])
@swag_from({
    'tags': ['Locations'],
    'methods': ['DELETE'],
    'summary': 'DELETE record for a location stored in database according their ID',
    'description': 'This functions updates values in table locations from BIRDeep database by using the id',
    'parameters': [
        {
            'name': 'id_location',
            'in': 'path',
            'type': 'integer',
            'required': True,
        },
    ],
    'responses': {
        200: {
            'description': 'location information deleted from database ',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def delete_location(id_location):
    response = delete_values_in_db(id_location, Locations)
    return jsonify(response), 200

# --------------- UPLOAD SING EVENTS ---------

@cross_origin()
@app.route('/api/v1/upload_singevent', methods=['POST'])
@swag_from({
    'tags': ['labels'],
    'methods': ['POST'],
    'summary': 'Insert new locations in database',
    'description': 'This functions creates a new record in table locations from BIRDeep database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
            }
        }
    ],
    'responses': {
        200: {
            'description': 'location created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def upload_folder():
    response = insert_in_singevent(request, SingEvents, Diagnostics, Recordings)
    return jsonify(response), 200

# --------------- DOWNLOAD RECORDINGS  ---------------


@cross_origin()
@app.route('/api/v1/download_recording', methods=['GET'])
@swag_from({
    'tags': ['download'],
    'methods': ['GET'],
    'summary': 'Download recording',
    'description': 'This functions downloads a recording from the database',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
            }
        }
    ],
    'responses': {
        200: {
            'description': 'location created in database',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def download_recording():
    ruta = request.data.decode('utf-8')
    return send_file(ruta, as_attachment=True, mimetype='audio/wav')

@cross_origin()
@app.route('/api/v1/download_all_recordings', methods=['GET'])
def download_all_recordings():
    response = get_values_from_db(request, Recordings)
    uris = [entry['uri'] for entry in response]

    with zipfile.ZipFile('audios.zip', 'w') as zip_file:
        for ruta_archivo in uris:
            zip_file.write(ruta_archivo, os.path.basename(ruta_archivo))

    return send_file('archivos.zip', as_attachment=True, download_name='archivos.zip')

@cross_origin()
@app.route('/api/v1/spectrogram', methods=['GET'])
def spectrogram():
    ruta = request.args.get('uri')
    sep = ruta.split('/')
    y, sr = librosa.load(ruta)
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
    datos_csv = '\n'.join(','.join(str(valor) for valor in fila) for fila in D)
    audio_url = url_for(sep[0], filename=sep[1])
    return jsonify(audio_url=audio_url, datos_csv=datos_csv)

# --------------- INSERT FILES  ---------------


@cross_origin()
@app.route('/api/v1/insert_files', methods=['POST'])
@swag_from({
    'tags': ['Insert_Files'],
    'methods': ['POST'],
    'summary': 'Insert new files in database and internal storage',
    'description': 'This functions creates a new record in table files from BIRDeep database and includes the files in '
                   'the internal storage of the server',
    'parameters': [
        {
            'name': 'json_data',
            'in': 'formData',
            'type': 'object',
            'required': True,
            'description': 'JSON Data to be inserted into the records table with metadata info. '
                           'One entry for every file in the request.',
            'example': '{\n' 
                       '\"file_1\": {'
                       '\"file_name\": \"file_1.wav\",\n'
                       '\"id_recorder_record\": 1,\n'
                       '\"time_record\": \"2000-01-01 00:00:00\",\n'
                       '\"filetype_record\": \".wav\",\n'
                       '\"bitrate_record\": 192,\n'
                       '\"sample_rate_record\":\"32000\",\n'
                       '\"gain_record\":2.5,\n'
                       '\"duration_record\":59\n},'
        },
        {
            'name': 'file_X',
            'in': 'formData',
            'type': 'file',
            'description': 'Audio file. One file for every audio file to upload.'
        }
    ],
    'responses': {
        200: {
            'description': 'files stored in the server',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def insert_files():

    json_data = json.loads(request.form.get('json_data'))
    files = request.files
    db_object = Recordings
    # storage files in server storage and creates the database record
    response = save_files_in_storage(json_data, files, db_object)
    return jsonify(response), 200


# ERROR HANDLERS
app.register_error_handler(400, bad_request_error)
app.register_error_handler(401, unauthorized_error)
app.register_error_handler(403, forbidden_error)
app.register_error_handler(404, not_found_error)
app.register_error_handler(405, method_not_allowed_error)
app.register_error_handler(409, conflict_error)
app.register_error_handler(415, unsupported_media_type_error)
app.register_error_handler(500, internal_server_error)
app.register_error_handler(502, bad_gateway_error)
app.register_error_handler(503, service_unavailable_error)
app.register_error_handler(504, gateway_timeout_error)
app.register_error_handler(505, http_version_not_supported_error)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)


