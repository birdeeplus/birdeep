# /utils/autentication.py
# Se encarga de crear el token jwt y verificar las credenciales de los usuarios

from flask_jwt_extended import JWTManager, jwt_required, create_access_token

# toma el cuerpo de la solicitud
def jwt_token_creation(request, correct_user, correct_password):
    username = request.json.get('username')
    password = request.json.get('password')

    # comprueba si las credenciales son correctas
    if username == correct_user and password == correct_password:
        # crea el token jwt
        token = create_access_token(identity=username)
        return {'token': token, 'message': 'Created JWT Token', 'code': 200}
    else:
        return {'message': 'Invalid Credentials', 'code': 401}
 
 # Entrada:
#  {
#     "username": "admin",
#     "password": "password"
# }

# Salida en caso de acierto:
# {
#     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "message": "Created JWT Token",
#     "code": 200
# }

# Salida en caso de error:
# {
#     "message": "Invalid Credentials",
#     "code": 401
# }