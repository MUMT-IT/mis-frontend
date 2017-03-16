from flask import Blueprint

research_blueprint = Blueprint('research', __name__)

from . import views