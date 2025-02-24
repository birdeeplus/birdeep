from .database import db

class Microphones(db.Model):
    __tablename__ = 'microphones'

    id_microphone = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name_microphone = db.Column(db.String(20))
    model_microphone = db.Column(db.String(60))
    comment_microphone = db.Column(db.Text)

    def __init__(self):
        self.name_microphone = None
        self.model_microphone = None
        self.comment_microphone = None