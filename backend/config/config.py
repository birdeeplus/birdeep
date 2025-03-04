# config.py

# Realiza la configuración de la base de datos mediante SQLAlchemy
# y la configuración de la autenticación mediante JWT

class Config:
    """Clase base para configuraciones."""
    pass

class DevelopmentConfig(Config):
    """Configuración para el entorno de desarrollo."""
    DEBUG = True
    # Para local
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://birdeep_user:clave@localhost/birdeep'
    # Para servidor por ssh
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://birdeep_user:clave@localhost:3306/birdeep'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'clave'  # Se usa para la autenticación con JWT
    JWT_USER = 'user'
    JWT_PASSWORD = 'password'

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
