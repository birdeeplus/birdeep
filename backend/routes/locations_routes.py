# /routes/locations_routes.py
from flask import Blueprint
from controllers.locations_controller import insert_new_location, query_locations, update_location, delete_location, get_location_by_id, get_recorders_by_location
from flasgger import swag_from

locations_bp = Blueprint('locations', __name__)

@locations_bp.route('/api/v1/locations', methods=['POST'])
@swag_from({
    'tags': ['Operations related to locations in the BIRDeep database'],
    'operationId': 'insert_new_location',
    'summary': 'Insert a new location',
    'description': 'Adds a new location to the database.',
    'parameters': [
        {
            'name': 'location_data',
            'in': 'body',
            'description': 'Location data to be inserted',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_location': {
                        'type': 'string',
                        'description': 'The name of the location'
                    },
                    'latitude_location': {
                        'type': 'number',
                        'format': 'float',
                        'description': 'The latitude of the location'
                    },
                    'longitude_location': {
                        'type': 'number',
                        'format': 'float',
                        'description': 'The longitude of the location'
                    },
                    'habitat_location': {
                        'type': 'string',
                        'description': 'Optional description of the habitat at the location'
                    }
                },
                'required': ['name_location', 'latitude_location', 'longitude_location']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Location successfully created',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_location': {'type': 'integer'},
                    'name_location': {'type': 'string'},
                    'latitude_location': {'type': 'number', 'format': 'float'},
                    'longitude_location': {'type': 'number', 'format': 'float'},
                    'habitat_location': {'type': 'string'}
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
def insert_new_location_route():
    return insert_new_location()

@locations_bp.route('/api/v1/locations', methods=['GET'])
@swag_from({
    'tags': ['Operations related to locations in the BIRDeep database'],
    'operationId': 'query_locations',
    'summary': 'Get all locations',
    'description': 'Fetches all locations from the database.',
    'responses': {
        200: {
            'description': 'Successful query of all locations',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id_location': {'type': 'integer'},
                        'name_location': {'type': 'string'},
                        'latitude_location': {'type': 'number', 'format': 'float'},
                        'longitude_location': {'type': 'number', 'format': 'float'},
                        'habitat_location': {'type': 'string'}
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
def query_locations_route():
    return query_locations()

@locations_bp.route('/api/v1/locations/<int:id_location>', methods=['PUT'])
@swag_from({
    'tags': ['Operations related to locations in the BIRDeep database'],
    'operationId': 'update_location',
    'summary': 'Update a location by ID',
    'description': 'Updates the details of an existing location by its ID.',
    'parameters': [
        {
            'name': 'id_location',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'The ID of the location to update'
        },
        {
            'name': 'location_data',
            'in': 'body',
            'description': 'Updated location data',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name_location': {'type': 'string'},
                    'latitude_location': {'type': 'number', 'format': 'float'},
                    'longitude_location': {'type': 'number', 'format': 'float'},
                    'habitat_location': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Location successfully updated',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_location': {'type': 'integer'},
                    'name_location': {'type': 'string'},
                    'latitude_location': {'type': 'number', 'format': 'float'},
                    'longitude_location': {'type': 'number', 'format': 'float'},
                    'habitat_location': {'type': 'string'}
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
            'description': 'Location not found',
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
def update_location_route(id_location):
    return update_location(id_location)

@locations_bp.route('/api/v1/locations/<int:id_location>', methods=['DELETE'])
@swag_from({
    'tags': ['Operations related to locations in the BIRDeep database'],
    'operationId': 'delete_location',
    'summary': 'Delete a location by ID',
    'description': 'Deletes a location from the database.',
    'parameters': [
        {
            'name': 'id_location',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'The ID of the location to delete'
        }
    ],
    'responses': {
        200: {
            'description': 'Location successfully deleted',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Location not found',
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
def delete_location_route(id_location):
    return delete_location(id_location)

@locations_bp.route('/api/v1/locations/<int:id_location>', methods=['GET'])
@swag_from({
    'tags': ['Operations related to locations in the BIRDeep database'],
    'operationId': 'get_location_by_id',
    'summary': 'Get location by ID',
    'description': 'Fetches a specific location by its ID.',
    'responses': {
        200: {
            'description': 'Successfully fetched location details',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_location': {'type': 'integer'},
                    'name_location': {'type': 'string'},
                    'latitude_location': {'type': 'number', 'format': 'float'},
                    'longitude_location': {'type': 'number', 'format': 'float'},
                    'habitat_location': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Location not found',
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
def get_location_by_id_route(id_location):
    return get_location_by_id(id_location)

@locations_bp.route('/api/v1/locations/<int:id_location>/recorders', methods=['GET'])
@swag_from({
    'tags': ['Operations related to locations in the BIRDeep database'],
    'operationId': 'get_recorders_by_location',
    'summary': 'Get recorders by location',
    'description': 'Fetches all recorders associated with a specific location.',
    'responses': {
        200: {
            'description': 'Successfully fetched recorders for the location',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id_recorder': {'type': 'integer'},
                        'recorder_name': {'type': 'string'},
                        'installation_date': {'type': 'string', 'format': 'date'},
                        'status': {'type': 'string'}
                    }
                }
            }
        },
        404: {
            'description': 'No recorders found for this location',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
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
def get_recorders_by_location_route(id_location):
    return get_recorders_by_location(id_location)
