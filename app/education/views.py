from . import edu_blueprint as edu
from flask import render_template


@edu.route('/')
def index():
    return render_template('education/index.html')


@edu.route('/embed/undergrad/')
def show_undergrad_results_embed():
    return render_template('education/undergrad-embed.html')
