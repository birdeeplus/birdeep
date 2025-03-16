from dotenv import load_dotenv
import os

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

class Config:
    """Clase base para configuraciones."""
    pass

class DevelopmentConfig(Config):
    """Configuración para el entorno de desarrollo."""
    DEBUG = True
    # Usar las variables de entorno para formar la cadena de conexión
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Usar JWT_USER y JWT_PASSWORD desde el .env
    JWT_SECRET_KEY = os.getenv('JWT_PASSWORD')  # Usamos el JWT_PASSWORD de .env como clave secreta
    JWT_USER = os.getenv('JWT_USER')
    JWT_PASSWORD = os.getenv('JWT_PASSWORD')

    # Diccionarios de traducción para mapear nombres en las solicitudes
    TRANSLATION_DIAGNOSTIC_DICT = {
        'id_record': 'id_record_diagnostic'
    }

    TRANSLATION_RECORDINGS_DICT = {
        'id_recorder': 'id_recorder_recordings',
        'time': 'time_record',
        'filetype': 'filetype_record',
        'bitrate': 'bitrate_record',
        'sample_rate': 'sample_rate_record',
        'gain': 'gain_record',
        'duration': 'duration_record',
        'uri': 'uri',
        'device': 'device',
    }

    TRANSLATION_RECORDERS_DICT = {
        'id_location': 'id_location_recorder',
        'id_microphone': 'id_microphone_recorder',
        'id_processor': 'id_processor_recorder',
    }

    TRANSLATION_SINGEVENTS_DICT = {
        'id_diagnostic': 'id_diagnostic_event',
        'time': 'time_event',
        'start': 'start_event',
        'end': 'end_event',
        'overlap': 'overlap_event',
        'confidence': 'confidence_event',
        'sensitivity': 'sensitivity_event',
        'quality_score': 'quality_score_manual_event'
    }

# Diccionario de configuraciones
config = {
    'development': DevelopmentConfig
}
