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