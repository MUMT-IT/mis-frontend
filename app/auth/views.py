from flask import Flask, redirect, url_for, session, request, jsonify
from flask_login import login_user, login_user, logout_user
from . import auth
from .. import oauth
from ..models import User

GOOGLE_ID = '833469404514-np621evcb7bibogapmcbu3qshn5s0q6t.apps.googleusercontent.com'
GOOGLE_SECRET = 'f4YDHfIKyRgwt0IMe0WVrQrj'


google = oauth.remote_app(
    'google',
    consumer_key=GOOGLE_ID,
    consumer_secret=GOOGLE_SECRET,
    request_token_params={
        'scope': 'email'
    },
    base_url = 'https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)

@auth.route('/')
def index():
    if 'google_token' in session:
        me = google.get('userinfo')
        user = User(me.data['email'])  # create a user object
        login_user(user, remember=False)
        return redirect(request.args.get('next') or url_for('main.main'))
    else:
        return redirect(url_for('auth.login'))

@auth.route('/login')
def login():
    return google.authorize(callback=url_for('auth.authorized', _external=True))

@auth.route('/logout')
def logout():
    session.pop('google_token', None)
    logout_user()
    return redirect(url_for('user.logout'))

@auth.route('/login/authorized')
def authorized():
    resp = google.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
            )
    session['google_token'] = (resp['access_token'], '')
    me = google.get('userinfo')
    user = User(me.data['email'])  # create a user object
    login_user(user, remember=False)
    return redirect(url_for('user.index'))

@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')