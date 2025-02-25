from .database import db

class SingEvents(db.Model):
    __tablename__ = 'sing_events'

    id_event = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_diagnostic_event = db.Column(db.Integer, db.ForeignKey('diagnostics.id_diagnostic'))
    time_event = db.Column(db.DateTime)
    start_event = db.Column(db.Numeric(10, 8))
    end_event = db.Column(db.Numeric(10, 8))
    overlap_event = db.Column(db.Boolean, default=False)
    confidence_event = db.Column(db.Numeric(5, 4))
    sensitivity_event = db.Column(db.Numeric(5, 4))  # He asumido que la sensibilidad es un valor decimal
    quality_score_manual_event = db.Column(db.Numeric(5, 4))

    def __init__(self):
        self.id_diagnostic_event = None
        self.time_event = None
        self.start_event = None
        self.end_event = None
        self.overlap_event = None
        self.confidence_event = None
        self.sensitivity_event = None
        self.quality_score_manual_event = None
