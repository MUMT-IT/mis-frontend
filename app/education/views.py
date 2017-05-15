from . import edu_blueprint as edu
from flask import render_template


@edu.route('/')
def index():
    return render_template('education/index.html')


@edu.route('/results/wrs')
def show_wrs_results():
    return render_template('education/wrs.html')
