<<<<<<< Updated upstream
=======
# models.py

# contiene las clases que definen las tablas de la base de datos (han de coincidir con las tablas de la base de datos)

>>>>>>> Stashed changes
# from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

#  model tabla 'diagnostics'
class Diagnostics(db.Model):
    id_diagnostic = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_record_diagnostic = db.Column(db.Integer, db.ForeignKey('recordings.id_record'))
    time_executed = db.Column(db.DateTime)
    used_model = db.Column(db.String(20))
    model_version = db.Column(db.String(20))
    pretreatment = db.Column(db.Text)
    created_by = db.Column(db.String(20))

    def __init__(self):
        self.id_record_diagnostic = None
        self.used_model = None
        self.model_version = None
        self.pretreatment = None
        self.created_by = None


# model tabla 'Species'
class Species(db.Model):
    scientific_name = db.Column(db.String(50), primary_key=True)
    spanish_name = db.Column(db.String(50))
    english_name = db.Column(db.String(50))
    short_name = db.Column(db.String(30))
    family = db.Column(db.String(15))

    def __init__(self):
        self.spanish_name = None
        self.english_name = None
        self.short_name = None
        self.family = None


# model tabla log_status
class LogRecorders(db.Model):
    id_log = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_recorder = db.Column(db.Integer, db.ForeignKey('recorders.id_recorder'))
    time_log = db.Column(db.DateTime, default=db.func.now())
    temperature_log = db.Column(db.Integer)
    # COMMENT: PODRÍAMOS INCLUIR UN SENSOR DE HUMEDAD EN EL INTERIOR DEL DISPOSITIVO PARA COMPROBAR ESTANQUEIDAD
    # humidity_log = db.Column(db.Integer)

    def __init__(self, id_recorder=None, time_log=None, temperature_log=None):
        self.id_recorder = id_recorder
        self.time_log = time_log
        self.temperature_log = temperature_log


# model tabla events_Canto
class SingEvents(db.Model):
    id_event = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_diagnostic_event = db.Column(db.Integer, db.ForeignKey('diagnostics.id_diagnostic'))
    scientific_name_specie = db.Column(db.String(50), db.ForeignKey('species.scientific_name'))
    time_event = db.Column(db.DateTime)
    start_event = db.Column(db.Numeric(10, 8))
    end_event = db.Column(db.Numeric(10, 8))
    overlap_event = db.Column(db.Boolean, default=False)
    confidence_event = db.Column(db.Numeric(5, 4))
    sensitivity_event = db.Column(db.Numeric(5, 4))  # He asumido que la sensibilidad es un valor decimal
    quality_score_manual_event = db.Column(db.Numeric(5, 4))
    comment = db.Column(db.String(100))

    def __init__(self):
        self.id_diagnostic_event = None
        self.scientific_name_specie = None
        self.time_event = None
        self.start_event = None
        self.end_event = None
        self.overlap_event = None
        self.confidence_event = None
        self.sensitivity_event = None
        self.quality_score_manual_event = None
        self.comment = None


# model tabla recordings
class Recordings(db.Model):
    id_record = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_recorder_recordings = db.Column(db.Integer, db.ForeignKey('recorders.id_recorder'))
    time_record = db.Column(db.DateTime)
    filetype_record = db.Column(db.String(6))
    bitrate_record = db.Column(db.Integer)  # Bitrate en kbps
    sample_rate_record = db.Column(db.String(8))  # Tasa de record en formato XXX/XX
    gain_record = db.Column(db.Numeric(5, 3))
    duration_record = db.Column(db.Integer)  # Duracion en segundos
    uri = db.Column(db.String(100))
    device = db.Column(db.String(100))

    def __init__(self):
        self.id_recorder_recordings = None
        self.time_record = None
        self.filetype_record = None
        self.bitrate_record = None
        self.sample_rate_record = None
        self.gain_record = None
        self.duration_record = None
        self.uri = None
        self.device = None


# model tabla recorders
class Recorders(db.Model):
    id_recorder = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_location_recorder = db.Column(db.Integer, db.ForeignKey('locations.id_location'))
    id_microphone_recorder = db.Column(db.Integer, db.ForeignKey('microphones.id_microphone'))
    id_processor_recorder = db.Column(db.Integer, db.ForeignKey('processors.id_processor'))
    status = db.Column(db.DateTime)
    recorder_name = db.Column(db.String(30))
    installation_date = db.Column(db.DateTime)

    def __init__(self):
        self.id_location_recorder = None
        self.id_microphone_recorder = None
        self.id_processor_recorder = None
        self.status = None
        self.recorder_name = None
        self.installation_date = None

        
# model tabla microphones
class Microphones(db.Model):
    id_microphone = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name_microphone = db.Column(db.String(20))
    model_microphone = db.Column(db.String(60))
    comment_microphone = db.Column(db.Text)

    def __init__(self):
        self.name_microphone = None
        self.model_microphone = None
        self.comment_microphone = None
    
    
class Processors(db.Model):
    id_processor = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name_processor = db.Column(db.String(20))
    model_processor = db.Column(db.String(60))
    comment_processor = db.Column(db.Text)

    def __init__(self):
        self.name_processor = None
        self.model_processor = None
        self.comment_processor = None
    
    
class Locations(db.Model):
    id_location = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name_location = db.Column(db.String(60))
    latitude_location = db.Column(db.Numeric(9, 6))
    longitude_location = db.Column(db.Numeric(9, 6))
    habitat_location = db.Column(db.String(60))

    def __init__(self):
        self.name_location = None
        self.latitude_location = None
        self.longitude_location = None
        self.habitat_location = None