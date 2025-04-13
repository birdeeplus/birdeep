#/controllers/upload_singevent_controller.py

import os
from flask import request, jsonify
from models import SingEvents, Diagnostics, Recordings
from utils.crud_operations import insert_in_singevent

def upload_folder():
    """
    Insert new sing events into the database.

    This function handles the insertion of new sing events into the database. 
    It leverages a utility function `insert_in_singevent` to process the request data 
    and insert relevant records into the `SingEvents`, `Diagnostics`, and `Recordings` tables.

    The request is expected to contain the necessary data for inserting the sing event, 
    along with any associated diagnostics or recordings. The function returns a 
    JSON response with the result of the insertion operation.
    """

    # Call the utility function to insert the sing events along with diagnostics and recordings
    response = insert_in_singevent(request, SingEvents, Diagnostics, Recordings)

    # Return the result of the operation as a JSON response
    return jsonify(response), 200
