from . import main_blueprint as main
from flask import render_template_string, render_template

@main.route('/')
def main():
    return render_template("main/main.html")