from .database import db

class Locations(db.Model):
    __tablename__ = 'locations'

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