<<<<<<< Updated upstream
=======
# error_handlers.py

# gestiona los distintos errores que pueden ocurrir en la aplicación

>>>>>>> Stashed changes
from flask import jsonify


# Error 400 - Bad Request
def bad_request_error(e):
    return jsonify({
        'error': 'Bad Request',
        'message': 'La solicitud no pudo ser entendida por el servidor debido a una sintaxis incorrecta.'
    }), 400


# Error 401 - Unauthorized
def unauthorized_error(e):
    return jsonify({
        'error': 'Unauthorized',
        'message': 'No se proporcionaron credenciales válidas para acceder '
                   'a los recursos solicitados.'
    }), 401


# Error 403 - Forbidden
def forbidden_error(e):
    return jsonify({
        'error': 'Forbidden',
        'message': 'No tienes permiso para acceder a los recursos solicitados.'
    }), 403


# Error 404 - Not Found
def not_found_error(e):
    return jsonify({
        'error': 'Not Found',
        'message': 'La ruta solicitada no fue encontrada.'
    }), 404


# Error 405 - Method Not Allowed
def method_not_allowed_error(e):
    return jsonify({
        'error': 'Method Not Allowed',
        'message': 'El método HTTP utilizado no está permitido para esta ruta.'
    }), 405


# Error 409 - Conflict
def conflict_error(e):
    return jsonify({
        'error': 'Conflict',
        'message': 'La solicitud no pudo ser procesada debido a '
                   'un conflicto en el estado actual del recurso.'
    }), 409


# Error 415 - Unsupported Media Type
def unsupported_media_type_error(e):
    return jsonify({
        'error': 'Unsupported Media Type',
        'message': 'El tipo de medio de la solicitud no es compatible '
                   'con el recurso solicitado.'
    }), 415


# Error 500 - Internal Server Error
def internal_server_error(e):
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'Ha ocurrido un error en el servidor.'
    }), 500


# Error 502 - Bad Gateway
def bad_gateway_error(e):
    return jsonify({
        'error': 'Bad Gateway',
        'message': 'El servidor actuó como una puerta de enlace o proxy y '
                   'recibió una respuesta no válida del servidor ascendente.'
    }), 502


# Error 503 - Service Unavailable
def service_unavailable_error(e):
    return jsonify({
        'error': 'Service Unavailable',
        'message': 'El servidor no está listo para manejar la solicitud debido '
                   'a una sobrecarga temporal o mantenimiento del servidor.'
    }), 503


# Error 504 - Gateway Timeout
def gateway_timeout_error(e):
    return jsonify({
        'error': 'Gateway Timeout',
        'message': 'El servidor actuó como una puerta de enlace o proxy pero no '
                   'recibió una respuesta oportuna del servidor ascendente.'
    }), 504


# Error 505 - HTTP Version Not Supported
def http_version_not_supported_error(e):
    return jsonify({
        'error': 'HTTP Version Not Supported',
        'message': 'La versión del protocolo HTTP utilizada en la solicitud no es compatible con el servidor.'
    }), 505