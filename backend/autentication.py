from flask_jwt_extended import JWTManager, jwt_required, create_access_token


def jwt_token_creation(request, correct_user, correct_password):
    username = request.json.get('username')
    password = request.json.get('password')

    if username == correct_user and password == correct_password:
        token = create_access_token(identity=username)
        return {'token': token, 'message': 'Created JWT Token', 'code': 200}
    else:
        return {'message': 'Invalid Credentials', 'code': 401}
 