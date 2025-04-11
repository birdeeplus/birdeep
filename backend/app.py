import zipfile
import librosa
import json
import numpy as np
import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flasgger import Swagger

# Importar configuraciones
from config.config import config

# Importar módulos
from models import db
from routes import register_routes
from utils import register_error_handlers



from sqlalchemy import text





# Función para crear la plantilla de Swagger
def create_swagger_template():
    return {
        "swagger": "2.0",
        "info": {
            "title": "BIRDeep API",
            "description": "API for Doñana BIRDeep project",
            "contact": {
                "responsibleOrganization": "Biological Station of Doñana (EBD)",
                "responsibleDeveloper": "Me",
                "email": "me@me.com",
                "url": "www.me.com",
            },
            "termsOfService": "https://me.com/terms",
            "version": "0.1"
        },
        "schemes": ["http", "https"],
        "operationId": "getmyData"
    }

# Función para inicializar la aplicación Flask
def create_app(environment_fn):
    app_fn = Flask(__name__)
    app_fn.config.from_object(environment_fn)

    # Inicializar módulos
    db.init_app(app_fn)
    Swagger(app_fn, template=create_swagger_template())
    JWTManager(app_fn)
    CORS(app_fn, resources={r"/*": {"origins": "http://localhost:3000"}})

    with app_fn.app_context():
        db.create_all()

    # Registrar rutas y manejadores de errores
    register_routes(app_fn)
    register_error_handlers(app_fn)

    # Ruta para servir archivos de audio
    @app_fn.route('/static/datos2/audio_data/<path:filename>')
    def serve_audio(filename):
        # Ruta a la carpeta de los audios
        audio_directory = r'datos2/audio_data'
        return send_from_directory(audio_directory, filename)
    return app_fn

# Definir entorno y crear la app
environment = config['development']
app = create_app(environment)

# Ruta de bienvenida
@app.route("/")
def home():
    return jsonify({"message": "Bienvenido al backend"}), 200

# para saber versión base de datos y su usa mysql o mariadb: http://localhost:8080/db-version (si solo pone database version=mysql, si pone mariadb version=mariadb)
@app.route("/db-version")
def db_version():
    with db.engine.connect() as connection:
        version_result = connection.execute(text("SELECT VERSION();"))
        version = version_result.scalar()  # Obtiene solo el string de versión
    return jsonify({"database_version": version})

# Iniciar servidor
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
