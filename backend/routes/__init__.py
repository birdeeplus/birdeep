# /routes/__init__.py

from flask import Blueprint

# Importamos todos los blueprints de las rutas
from .diagnostics_routes import diagnostics_bp
from .download_recordings_routes import download_recordings_bp
from .insert_files_routes import insert_files_bp
from .locations_routes import locations_bp
from .log_recorders_routes import log_recorders_bp
from .login_routes import auth_bp
from .microphones_routes import microphones_bp
from .processors_routes import processors_bp
from .recorders_routes import recorders_bp
from .recordings_routes import recordings_bp
from .sing_events_routes import sing_events_bp
from .species_routes import species_bp
from .upload_singevent_routes import upload_singevent_bp

# Creamos una lista con todos los blueprints para un registro limpio
blueprints = [
    diagnostics_bp,
    download_recordings_bp,
    insert_files_bp,
    locations_bp,
    log_recorders_bp,
    auth_bp,
    microphones_bp,
    processors_bp,
    recorders_bp,
    recordings_bp,
    sing_events_bp,
    species_bp,
    upload_singevent_bp
]

def register_routes(app):
    """Registra todas las rutas en la aplicación Flask."""
    for bp in blueprints:
        app.register_blueprint(bp)
