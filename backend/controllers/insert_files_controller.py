#/controllers/insert_files_controller.py

import os
import json
from flask import request, jsonify
from models import Recordings
from utils.crud_operations import save_files_in_storage

def insert_files():
    """
    Insert new files into the database and store them in internal storage.

    This function handles a multipart/form-data POST request, which should contain:
    - A JSON payload under the key 'json_data' with metadata for each file.
    - One or more files sent via the request.

    The function delegates the processing and storage to a utility function,
    and returns the result as a JSON response.
    """

    # Parse the JSON metadata from the 'json_data' form field
    json_data = json.loads(request.form.get('json_data'))

    # Get the uploaded files from the request
    files = request.files

    # Define the target database model (Recordings table)
    db_object = Recordings

    # Save files and their metadata using the utility function
    response = save_files_in_storage(json_data, files, db_object)

    # Return the result of the operation as a JSON response
    return jsonify(response), 200
