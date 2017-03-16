from . import research_blueprint as research
from flask import render_template

@research.route('/')
def main():
    return render_template('research/main.html')