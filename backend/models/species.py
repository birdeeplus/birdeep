from .database import db

class Species(db.Model):
    __tablename__ = 'species'

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
