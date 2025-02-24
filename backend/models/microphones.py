from .database import db

class Microphones(db.Model):
    __tablename__ = 'microphones'

    id_microphone = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model_microphone = db.Column(db.String(60))
    comment_microphone = db.Column(db.Text)

    def __init__(self):
        self.model_microphone = None
        self.comment_microphone = None