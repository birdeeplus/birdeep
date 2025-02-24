from .database import db

class Recorders(db.Model):
    __tablename__ = 'recorders'

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