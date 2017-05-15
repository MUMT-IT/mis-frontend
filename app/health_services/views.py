from flask import render_template
from . import healthservice_blueprint as healthservice


@healthservice.route('/')
def index():
    return render_template('health_services/index.html')