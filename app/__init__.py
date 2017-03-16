from flask import Flask
from flask_bootstrap import Bootstrap

bootstrap = Bootstrap()

def create_db():
    app = Flask(__name__)
    bootstrap.init_app(app)

    from app.main import main_blueprint
    app.register_blueprint(main_blueprint, end_point='/')
    return app