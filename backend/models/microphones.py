# /models/microphone.py
from .database import db

class Microphones(db.Model):
    __tablename__ = 'microphones'

    id_microphone = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model_microphone = db.Column(db.String(60), nullable=False)  # Asegúrate de que no sea nulo
    comment_microphone = db.Column(db.Text, nullable=True)

    def __init__(self, model_microphone=None, comment_microphone=None):
        self.model_microphone = model_microphone
        self.comment_microphone = comment_microphone
