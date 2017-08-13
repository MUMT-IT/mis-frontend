from flask import Flask
from flask_bootstrap import Bootstrap
from flask_oauthlib.client import OAuth
from flask_login import LoginManager

login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'

bootstrap = Bootstrap()
oauth = OAuth()

def create_db():
    app = Flask(__name__)
    bootstrap.init_app(app)
    oauth.init_app(app)
    login_manager.init_app(app)

    app.secret_key = 'arandomwords'
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

    from app.auth import auth
    app.register_blueprint(auth, url_prefix='/auth')

    from app.departments import dept
    app.register_blueprint(dept, url_prefix='/restricted/dept')

    from app.users import user
    app.register_blueprint(user, url_prefix='/restricted/user')

    return app