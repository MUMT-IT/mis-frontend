from flask import render_template
from . import employee_blueprint as employee_bp


@employee_bp.route('/department/<department_slug>')
def list_staff(department_slug):
    return render_template('employee/department.html', dept_slug=department_slug)


@employee_bp.route('/profile/<employee_id>')
def get_profile(employee_id):
    return render_template('employee/research-profile.html',
                           employee_id=employee_id)


@employee_bp.route('/research/')
def add_research_article():
    return render_template('employee/research.html')
