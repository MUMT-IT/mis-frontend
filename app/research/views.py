from . import research_blueprint as research
from flask import render_template

@research.route('/')
def main():
    return render_template('research/main.html')

@research.route('/embed')
def main_embed():
    return render_template('research/main-naked.html')

@research.route('/embed/recentpub')
def recent_embed():
    return render_template('research/recent.html')

@research.route('/department/all/')
def show_department_all():
    return render_template('research/department_all.html')