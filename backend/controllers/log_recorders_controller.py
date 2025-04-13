#/controllers/log_recorders_controller.py

import os
from flask import request, jsonify
from models import LogRecorders
from utils.crud_operations import insert_values_in_db

def insert_status():
    """
    Insert a new status of a recorder into the database.

    This function handles a POST request to insert a new log entry 
    for a recorder's status. It delegates the insertion logic to 
    a utility function `insert_values_in_db`, which processes the 
    incoming request and adds the status entry to the `LogRecorders` 
    table in the database.

    The request is expected to include the necessary data for the 
    status update. The function returns the result of the insertion 
    operation as a JSON response.
    """

    # Call the utility function to insert the new status entry into the LogRecorders table
    response = insert_values_in_db(request, LogRecorders)

    # Return the result of the insertion as a JSON response
    return jsonify(response), 200
