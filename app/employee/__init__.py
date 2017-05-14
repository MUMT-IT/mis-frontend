from flask import Blueprint

employee_blueprint = Blueprint('employee', __name__)

from views import *