from .database import db

class LogRecorders(db.Model):
    __tablename__ = 'log_recorders'

    id_log = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_recorder = db.Column(db.Integer, db.ForeignKey('recorders.id_recorder'))
    time_log = db.Column(db.DateTime, default=db.func.now())
    temperature_log = db.Column(db.Integer)
    # COMMENT: PODRÍAMOS INCLUIR UN SENSOR DE HUMEDAD EN EL INTERIOR DEL DISPOSITIVO PARA COMPROBAR ESTANQUEIDAD
    # humidity_log = db.Column(db.Integer)

    def __init__(self, id_recorder=None, time_log=None, temperature_log=None):
        self.id_recorder = id_recorder
        self.time_log = time_log
        self.temperature_log = temperature_log