from flask_jwt_extended import create_access_token
from datetime import timedelta

def jwt_token_creation(request, correct_user, correct_password):
    """
    Generates a JWT token for authenticated users.

    This function handles user authentication by comparing the provided credentials
    (username and password) from the incoming request with the correct ones defined
    by the application. If the credentials match, it generates a JWT token that is
    valid for 2 hours. The token can then be used for accessing protected endpoints.

    Args:
        request (flask.Request): The incoming HTTP request containing the user credentials in JSON format.
        correct_user (str): The expected valid username.
        correct_password (str): The expected valid password.

    Returns:
        dict: A dictionary containing the JWT token and a success message if authentication succeeds,
              or an error message and a 401 code if it fails.
    """

    # Extract username and password from the JSON body of the request
    username = request.json.get('username')
    password = request.json.get('password')

    # Check if the provided credentials match the valid ones
    if username == correct_user and password == correct_password:
        # If credentials are valid, generate a JWT token that expires in 2 hours
        token = create_access_token(identity=username, expires_delta=timedelta(hours=24))
        
        # Return the token along with a success message and HTTP status code 200
        return {'token': token, 'message': 'Created JWT Token', 'code': 200}
    else:
        # If credentials are invalid, return an error message with HTTP status code 401
        return {'message': 'Invalid Credentials', 'code': 401}
