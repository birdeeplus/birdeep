from flask import Blueprint
from controllers.species_controller import insert_new_specie, query_species, update_specie, delete_specie
from flasgger import swag_from

species_bp = Blueprint('species', __name__)

@species_bp.route('/api/v1/species', methods=['POST'])
@swag_from({
    'tags': ['Species operations'],
    'operationId': 'insert_new_specie',
    'summary': 'Insert a new species',
    'description': 'Adds a new species to the database.',
    'parameters': [
        {
            'name': 'specie_data',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'common_name': {'type': 'string', 'description': 'Common name of the species'},
                    'scientific_name': {'type': 'string', 'description': 'Scientific name of the species'},
                    'description': {'type': 'string', 'description': 'Additional description or note'}
                },
                'required': ['common_name', 'scientific_name']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Species successfully inserted',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_specie': {'type': 'integer'},
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
        }
    }
})
def insert_new_specie_route():
    return insert_new_specie()


@species_bp.route('/api/v1/species', methods=['GET'])
@swag_from({
    'tags': ['Species operations'],
    'operationId': 'query_species',
    'summary': 'Query species',
    'description': 'Retrieves all species from the database.',
    'responses': {
        200: {
            'description': 'List of species',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id_specie': {'type': 'integer'},
                        'common_name': {'type': 'string'},
                        'scientific_name': {'type': 'string'},
                        'description': {'type': 'string'}
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
def query_species_route():
    return query_species()


@species_bp.route('/api/v1/species/<int:id_specie>', methods=['PUT'])
@swag_from({
    'tags': ['Species operations'],
    'operationId': 'update_specie',
    'summary': 'Update a species',
    'description': 'Updates the information of a specific species.',
    'parameters': [
        {
            'name': 'id_specie',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the species to update'
        },
        {
            'name': 'specie_data',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'common_name': {'type': 'string'},
                    'scientific_name': {'type': 'string'},
                    'description': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Species successfully updated',
            'schema': {
                'type': 'object',
                'properties': {
                    'id_specie': {'type': 'integer'},
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Species not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        500: {
            'description': 'Unexpected update error',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def update_specie_route(id_specie):
    return update_specie(id_specie)


@species_bp.route('/api/v1/species/<int:id_specie>', methods=['DELETE'])
@swag_from({
    'tags': ['Species operations'],
    'operationId': 'delete_specie',
    'summary': 'Delete a species',
    'description': 'Deletes a specific species from the database.',
    'parameters': [
        {
            'name': 'id_specie',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the species to delete'
        }
    ],
    'responses': {
        200: {
            'description': 'Species successfully deleted',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        404: {
            'description': 'Species not found',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        },
        500: {
            'description': 'Unexpected deletion error',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    }
})
def delete_specie_route(id_specie):
    return delete_specie(id_specie)
