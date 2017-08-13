from . import user
from flask_login import login_required, current_user
from flask import render_template

@user.route('/')
@login_required
def index():
    return render_template('users/index.html')

@user.route('/logout')
def logout():
    return render_template('users/logout.html')