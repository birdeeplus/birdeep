# controllers/login_controller.py

import os
from flask import request, jsonify, current_app
from flask_jwt_extended import create_access_token
from utils.autentication import jwt_token_creation  

def login():
    """
    User login endpoint - Generates JWT Token
    
    This endpoint accepts a POST request with user credentials (username and password).
    It validates the credentials and, if they are correct, generates a JWT token that can be 
    used for future authenticated requests. The endpoint also checks if the user is an admin 
    based on the username and includes this information in the response.
    
    Returns:
        JSON response containing the generated JWT token and admin status.
    """

    # Retrieve the valid username and password from the application's config
    valid_user = current_app.config['JWT_USER']
    valid_password = current_app.config['JWT_PASSWORD']
    
    # Call a helper function to create a JWT token, passing the request, valid user, and password
    token = jwt_token_creation(request, valid_user, valid_password)
    
    # Check if the token creation was successful
    if token['code'] == 200:
        
        # Logic to check if the user is an admin
        # This is currently set statically based on the username, but can be modified as needed
        is_admin = True if valid_user == "BirdeepAdmin" else False 
        
        # Return the JWT token along with the admin status in the response
        return jsonify(access_token=token['token'], is_admin=is_admin), 200
    else:
        # If the token creation failed, return the error message and code from the token
        return jsonify(message=token['message']), token['code']
