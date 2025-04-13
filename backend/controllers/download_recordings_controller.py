# /controllers/download_recordings_controller.py

import zipfile
import os
import librosa
import numpy as np
from flask import request, jsonify, send_file, url_for
from models import Recordings
from utils.crud_operations import get_values_from_db

def download_recording():
    """
    Download a single audio recording from the database.

    This function receives the path to an audio file via a POST request,
    verifies that the file exists, and returns it as a downloadable attachment.
    """
    
    # Decode the file path from the request body
    ruta = request.data.decode('utf-8')

    # Check if the file exists on the server
    if not os.path.exists(ruta):
        return jsonify({"error": "Archivo no encontrado"}), 404

    # Extract the filename from the path
    filename = os.path.basename(ruta)

    # Send the file as a downloadable response
    return send_file(
        ruta,
        as_attachment=True,
        download_name=filename,  # Set the file name for download
        mimetype="audio/wav"     # Set the MIME type
    )

def download_all_recordings():
    """
    Download all audio recordings as a ZIP file.

    This function retrieves all recordings from the database,
    zips them into a single file, and returns the zip file as a download.
    """
    
    # Fetch all recordings from the database
    response = get_values_from_db(request, Recordings)

    # Extract the URI of each recording
    uris = [entry['uri'] for entry in response]

    # Define the name of the zip file
    zip_filename = 'audios.zip'

    # Create and write files to the ZIP archive
    with zipfile.ZipFile(zip_filename, 'w') as zip_file:
        for ruta_archivo in uris:
            if os.path.exists(ruta_archivo):
                # Add each valid file to the zip, using its base name
                zip_file.write(ruta_archivo, os.path.basename(ruta_archivo))

    # Return the zip file as a downloadable response
    return send_file(zip_filename, as_attachment=True, download_name=zip_filename)

def spectrogram():
    """
    Generate a spectrogram from an audio file.

    This function loads an audio file specified via query parameters,
    generates its spectrogram using Librosa, and returns the data as CSV
    along with a generated URL for the audio file.
    """

    # Get the file path from the request arguments
    ruta = request.args.get('uri')

    # Validate the provided path
    if not ruta or not os.path.exists(ruta):
        return jsonify({"error": "Invalid or missing file path"}), 400

    # Split the path to extract components for building a URL
    sep = ruta.split('/')

    # Load the audio file using librosa
    y, sr = librosa.load(ruta, sr=None)

    # Compute the spectrogram in decibels
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)

    # Convert the spectrogram matrix to CSV format
    datos_csv = '\n'.join(','.join(str(valor) for valor in fila) for fila in D)

    # Generate a URL for the audio file (for frontend playback if needed)
    audio_url = url_for(sep[-2], filename=sep[-1])  # Dynamic URL construction

    # Return the spectrogram CSV data and audio URL as a JSON response
    return jsonify(audio_url=audio_url, datos_csv=datos_csv)
