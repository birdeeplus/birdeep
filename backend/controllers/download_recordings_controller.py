# /controllers/download_recordings_controller.py

import zipfile
import os
import librosa
import numpy as np
from flask import request, jsonify, send_file, url_for
from models import Recordings
from utils.crud_operations import get_values_from_db
from flasgger import swag_from

# Obtener la ruta absoluta de los archivos de documentación Swagger
BASE_SWAGGER_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../swagger'))

def get_swagger_path(filename):
    """Devuelve la ruta completa del archivo Swagger si existe, de lo contrario, devuelve None"""
    filepath = os.path.join(BASE_SWAGGER_PATH, filename)
    return filepath if os.path.exists(filepath) else None

@swag_from(get_swagger_path('download_recording.yml'), methods=['GET'])
def download_recording():
    """
    Download a single audio recording from the database
    """
    ruta = request.data.decode('utf-8')
    return send_file(ruta, as_attachment=True, mimetype='audio/wav')

@swag_from(get_swagger_path('download_all_recordings.yml'), methods=['GET'])
def download_all_recordings():
    """
    Download all audio recordings as a zip file
    """
    response = get_values_from_db(request, Recordings)
    uris = [entry['uri'] for entry in response]

    zip_filename = 'audios.zip'
    with zipfile.ZipFile(zip_filename, 'w') as zip_file:
        for ruta_archivo in uris:
            if os.path.exists(ruta_archivo):
                zip_file.write(ruta_archivo, os.path.basename(ruta_archivo))

    return send_file(zip_filename, as_attachment=True, download_name=zip_filename)

@swag_from(get_swagger_path('spectrogram.yml'), methods=['GET'])
def spectrogram():
    """
    Generate a spectrogram from an audio file
    """
    ruta = request.args.get('uri')
    if not ruta or not os.path.exists(ruta):
        return jsonify({"error": "Invalid or missing file path"}), 400

    sep = ruta.split('/')
    y, sr = librosa.load(ruta, sr=None)
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
    datos_csv = '\n'.join(','.join(str(valor) for valor in fila) for fila in D)
    audio_url = url_for(sep[-2], filename=sep[-1])  # Ajuste para evitar errores de indexado

    return jsonify(audio_url=audio_url, datos_csv=datos_csv)
