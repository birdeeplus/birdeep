# /routes/download_recordings_routes.py

from flask import Blueprint
from controllers.download_recordings_controller import (
    download_recording,
    download_all_recordings,
    spectrogram
)

download_recordings_bp = Blueprint('download_recordings', __name__)

download_recordings_bp.add_url_rule('/api/v1/download_recording', view_func=download_recording, methods=['GET'])
download_recordings_bp.add_url_rule('/api/v1/download_all_recordings', view_func=download_all_recordings, methods=['GET'])
download_recordings_bp.add_url_rule('/api/v1/spectrogram', view_func=spectrogram, methods=['GET'])
