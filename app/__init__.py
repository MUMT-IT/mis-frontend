from flask import Flask

def create_db():
    app = Flask(__name__)

    from app.main import main_blueprint
    app.register_blueprint(main_blueprint, end_point='/')
    return app