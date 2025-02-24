from .database import db

class Processors(db.Model):
    __tablename__ = 'processors'

    id_processor = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name_processor = db.Column(db.String(20))
    model_processor = db.Column(db.String(60))
    comment_processor = db.Column(db.Text)

    def __init__(self):
        self.name_processor = None
        self.model_processor = None
        self.comment_processor = None