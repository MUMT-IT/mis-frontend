from flask import Flask
from flask_bootstrap import Bootstrap

bootstrap = Bootstrap()

def create_db():
    app = Flask(__name__)
    bootstrap.init_app(app)

    from app.main import main_blueprint
    app.register_blueprint(main_blueprint, url_prefix='/')

    from app.research import research_blueprint
    app.register_blueprint(research_blueprint, url_prefix='/research')

    from app.employee import employee_blueprint
    app.register_blueprint(employee_blueprint, url_prefix='/employee')

    from app.education import edu_blueprint
    app.register_blueprint(edu_blueprint, url_prefix='/education')

    from app.health_services import healthservice_blueprint
    app.register_blueprint(healthservice_blueprint, url_prefix='/healthservices')

    return app