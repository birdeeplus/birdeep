from .database import db

class Diagnostics(db.Model):
    __tablename__ = 'diagnostics'

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