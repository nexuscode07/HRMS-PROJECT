# HRMS Django REST API

This project provides a backend API for both Employee and Admin dashboards using Django and Django REST Framework. All dashboard data is served from the API/database—no static or dummy data is used.

## Features
- Employee CRUD (admin only)
- Employee dashboard data (employee only)
- Attendance (clock in/out, summary, history)
- Leave (apply, list, approve/reject)
- Announcements (list, create, delete)
- Notifications (list, create)
- Payroll (summary, history)

## Setup
1. Create and activate the virtual environment:
   ```
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```
   pip install django djangorestframework
   ```
3. Run migrations:
   ```
   python manage.py migrate
   ```
4. Create a superuser:
   ```
   python manage.py createsuperuser
   ```
5. Start the server:
   ```
   python manage.py runserver
   ```

## API Endpoints
- `/api/employees/`
- `/api/leaves/`
- `/api/attendance/`
- `/api/announcements/`
- `/api/notifications/`
- `/api/payroll/`

## Next Steps
- Implement models, serializers, and views in the `core` app.
- Connect your React frontend to these endpoints.
