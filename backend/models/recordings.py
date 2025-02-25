from .database import db

class Recordings(db.Model):
    __tablename__ = 'recordings'

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
    filename = db.Column(db.String(100))

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
        self.filename = None