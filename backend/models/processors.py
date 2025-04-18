from .database import db

class Processors(db.Model):
    __tablename__ = 'processors'

    id_processor = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model_processor = db.Column(db.String(60), nullable=False)  # Asegúrate de que no sea nulo
    comment_processor = db.Column(db.Text, nullable=True)

    def __init__(self, model_processor=None, comment_processor=None):
        self.model_processor = model_processor
        self.comment_processor = comment_processor
