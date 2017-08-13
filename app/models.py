from . import login_manager
from flask import session

class User():
    def __init__(self, email):
        self.email = email
    
    def is_active(self):
        return True

    def get_id(self):
        return self.email

    def is_authenticated(self):
        return self.email.endswith('@mahidol.edu') and 'google_token' in session

    def is_anonymous(self):
        return False
    
@login_manager.user_loader
def load_user(user_email):
    return User(user_email)