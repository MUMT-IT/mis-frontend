from flask import Blueprint

edu_blueprint = Blueprint('edu', __name__)

from views import *
