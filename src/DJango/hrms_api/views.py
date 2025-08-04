
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['DELETE'])
def delete_employee_with_clerk(request, employee_id):
    try:
        employee = Employee.objects.get(pk=employee_id)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=404)

    # Remove from Clerk
    clerk_url = f"https://api.clerk.com/v1/users?email_address={employee.email}"
    clerk_secret = getattr(settings, 'CLERK_SECRET_KEY', None) or 'sk_test_4mMnhr78gdJGPmM79L0YbieF79oSL35RITI2sIuMOv'
    headers = {
        "Authorization": f"Bearer {clerk_secret}",
        "Content-Type": "application/json"
    }
    # Get Clerk user by email
    user_list_resp = requests.get(clerk_url, headers=headers)
    if user_list_resp.status_code == 200 and user_list_resp.json():
        user_id = user_list_resp.json()[0]['id']
        # Delete Clerk user
        del_url = f"https://api.clerk.com/v1/users/{user_id}"
        requests.delete(del_url, headers=headers)

    # Delete from DB with error handling for protected related objects
    try:
        employee.delete()
    except Exception as e:
        return Response({'error': f'Could not delete employee from database: {str(e)}'}, status=500)
    return Response({'success': True})
# --- Delete Employee from DB and Clerk ---
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['DELETE'])
def delete_employee_with_clerk(request, employee_id):
    try:
        employee = Employee.objects.get(pk=employee_id)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=404)

    # Remove from Clerk
    clerk_url = f"https://api.clerk.com/v1/users?email_address={employee.email}"
    clerk_secret = getattr(settings, 'CLERK_SECRET_KEY', None) or 'sk_test_4mMnhr78gdJGPmM79L0YbieF79oSL35RITI2sIuMOv'
    headers = {
        "Authorization": f"Bearer {clerk_secret}",
        "Content-Type": "application/json"
    }
    # Get Clerk user by email
    user_list_resp = requests.get(clerk_url, headers=headers)
    if user_list_resp.status_code == 200 and user_list_resp.json():
        user_id = user_list_resp.json()[0]['id']
        # Delete Clerk user
        del_url = f"https://api.clerk.com/v1/users/{user_id}"
        requests.delete(del_url, headers=headers)

    # Delete from DB
    employee.delete()
    return Response({'success': True})
# --- Register Employee with Clerk ---
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def register_employee_with_clerk(request):
    data = request.data.copy()
    # 1. Create employee in your DB
    serializer = EmployeeSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    employee = serializer.save()

    # 2. Register with Clerk
    clerk_url = "https://api.clerk.com/v1/users"
    clerk_secret = getattr(settings, 'CLERK_SECRET_KEY', None) or 'sk_test_4mMnhr78gdJGPmM79L0YbieF79oSL35RITI2sIuMOv'
    headers = {
        "Authorization": f"Bearer {clerk_secret}",
        "Content-Type": "application/json"
    }
    # Ensure password is present and not empty
    if not data.get('password'):
        employee.delete()
        return Response({'error': 'Password is required for Clerk registration.'}, status=400)
    clerk_data = {
        "email_address": [data['email']],
        "password": data['password'],
        "first_name": data['name'].split()[0],
        "last_name": ' '.join(data['name'].split()[1:]) or ''
    }
    clerk_response = requests.post(clerk_url, json=clerk_data, headers=headers)
    if clerk_response.status_code != 201:
        # Optionally: rollback employee creation here
        employee.delete()
        # Return Clerk error details for easier debugging
        try:
            clerk_error = clerk_response.json()
        except Exception:
            clerk_error = clerk_response.text
        return Response({'error': 'Failed to create Clerk user', 'clerk': clerk_error}, status=422)

    return Response(serializer.data, status=201)
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import viewsets, status
# from django.utils import timezone
# from django.http import HttpResponse
# from datetime import datetime, date, time

from core.models import Employee, Admin, Attendance, Leave, Announcement, Notification, Payroll, DashboardStat, MeetingSchedule
from hrms_api.serializers import (
    EmployeeSerializer, AdminSerializer, AttendanceSerializer, LeaveSerializer,
    AnnouncementSerializer, NotificationSerializer, PayrollSerializer,
    DashboardStatSerializer, MeetingScheduleSerializer
)
# ViewSets for new models
class DashboardStatViewSet(viewsets.ModelViewSet):
    queryset = DashboardStat.objects.all()
    serializer_class = DashboardStatSerializer

class MeetingScheduleViewSet(viewsets.ModelViewSet):
    queryset = MeetingSchedule.objects.all()
    serializer_class = MeetingScheduleSerializer
# Admin ViewSet
from rest_framework import viewsets
class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer


# # Dashboard View
# @api_view(['GET'])
# def dashboard_view(request):
#     employee_id = request.GET.get('employee_id')
#     data = {
#         'totalLeaves': 5,
#         'presentDays': 20,
#         'totalHours': 160,
#     }
#     return Response(data)

# # Meetings View
# @api_view(['GET'])
# def meetings_view(request):
#     employee_id = request.GET.get('employee_id')
#     data = [
#         {'title': 'Team Sync', 'date': timezone.now().date(), 'time': '10:00 AM'},
#         {'title': 'Project Review', 'date': timezone.now().date(), 'time': '2:00 PM'},
#     ]
#     return Response(data)

# # Home View
# def home(request):
#     return HttpResponse("<h2>Welcome to the HRMS API. Visit <a href='/api/'>/api/</a> for the API endpoints.</h2>")

# # =======================
# # ViewSets for REST APIs
# # =======================

# class EmployeeViewSet(viewsets.ModelViewSet):
#     queryset = Employee.objects.all()
#     serializer_class = EmployeeSerializer

# class AttendanceViewSet(viewsets.ModelViewSet):
#     queryset = Attendance.objects.all()
#     serializer_class = AttendanceSerializer

# class LeaveViewSet(viewsets.ModelViewSet):
#     queryset = Leave.objects.all()
#     serializer_class = LeaveSerializer

#     # 👇 Correctly override the create method to handle employee list
#     def create(self, request, *args, **kwargs):
#         data = request.data.copy()
#         # Fix: If employee is sent as list like [101], take first item
#         if isinstance(data.get("employee"), list):
#             data["employee"] = data["employee"][0]

#         serializer = self.get_serializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)










from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from django.utils import timezone
from django.http import HttpResponse
from datetime import datetime, date, time


from core.models import Employee, Attendance, Leave, Announcement, Notification, Payroll, DashboardStat, MeetingSchedule
from hrms_api.serializers import (
    EmployeeSerializer, AttendanceSerializer, LeaveSerializer,
    AnnouncementSerializer, NotificationSerializer, PayrollSerializer ,ClockinSerializer ,ClockoutSerializer
)


# --- Employee Attendance API ---
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.response import Response
@api_view(['POST'])
def employee_clock_in(request):
    """Employee marks attendance (Clock In)"""
    data = request.data.copy()
    emp_id = data.get("employee")
    date_str = data.get("date")
    status_val = data.get("status", "Present")
    if not emp_id or not date_str:
        return Response({"error": "employee and date required"}, status=400)
    try:
        emp_obj = Employee.objects.get(pk=emp_id)
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)
    # Prevent duplicate attendance for same day
    att, created = Attendance.objects.get_or_create(employee=emp_obj, date=date_str, defaults={"status": status_val})
    if not created:
        return Response({"error": "Attendance already marked for today"}, status=400)
    att.status = status_val
    att.clock_in = timezone.now().time()
    att.save()
    # Notify admin
    admin_obj = Admin.objects.first()
    Notification.objects.create(
        employee=emp_obj,
        message=f"{emp_obj.name} checked in as '{status_val}' on {date_str}.",
        created_at=timezone.now()
    )
    return Response({"success": True, "attendance_id": att.id})

# --- Employee Clock Out API ---
@api_view(['POST'])
def employee_clock_out(request):
    """Employee marks attendance (Clock Out)"""
    try:
        data = request.data.copy()
        emp_id = data.get("employee")
        date_str = data.get("date")
        if not emp_id or not date_str:
            return Response({"error": "employee and date required"}, status=400)
        try:
            emp_obj = Employee.objects.get(pk=emp_id)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
        att = Attendance.objects.filter(employee=emp_obj, date=date_str).order_by('-id').first()
        if not att:
            return Response({"error": "Attendance record not found for today. Please clock in first."}, status=404)
        if att.clock_out:
            return Response({"error": "Already clocked out for today."}, status=400)
        att.clock_out = timezone.now().time()
        att.save()
        # Notify admin (handle missing Admin gracefully)
        try:
            admin_obj = Admin.objects.first()
            if admin_obj:
                Notification.objects.create(
                    employee=emp_obj,
                    message=f"{emp_obj.name} checked out on {date_str}.",
                    created_at=timezone.now()
                )
        except Exception as e:
            import logging
            logging.error(f"Notification error: {e}")
        return Response({"success": True, "attendance_id": att.id})
    except Exception as e:
        import logging
        logging.error(f"Clock out error: {e}")
        return Response({"error": f"Internal server error: {str(e)}"}, status=500)

@api_view(['GET'])
def employee_attendance_records(request):
    """Employee views their own attendance records"""
    emp_id = request.GET.get("employee_id")
    if not emp_id:
        return Response({"error": "employee_id required"}, status=400)
    records = Attendance.objects.filter(employee_id=emp_id).order_by("-date")
    data = [
        {
            "date": r.date,
            "clock_in": r.clock_in,
            "clock_out": r.clock_out,
            "status": r.status,
            "hours": (datetime.combine(date.today(), r.clock_out) - datetime.combine(date.today(), r.clock_in)).seconds // 3600 if r.clock_in and r.clock_out else None
        }
        for r in records
    ]
    return Response(data)

# --- Admin Attendance API ---
@api_view(['GET'])
def admin_attendance_list(request):
    """Admin views all attendance records"""
    records = Attendance.objects.select_related("employee").order_by("-date")
    data = [
        {
            "employee": r.employee.name,
            "employee_id": r.employee.id,
            "date": r.date,
            "clock_in": r.clock_in,
            "clock_out": r.clock_out,
            "status": r.status,
            "hours": (datetime.combine(date.today(), r.clock_out) - datetime.combine(date.today(), r.clock_in)).seconds // 3600 if r.clock_in and r.clock_out else None
        }
        for r in records
    ]
    return Response(data)

@api_view(['GET'])
def admin_dashboard_stats(request):
    """Admin dashboard summary"""
    total_employees = Employee.objects.count()
    total_attendance = Attendance.objects.count()
    present_today = Attendance.objects.filter(date=timezone.now().date(), status="Present").count()
    absent_today = Attendance.objects.filter(date=timezone.now().date(), status="Absent").count()
    return Response({
        "total_employees": total_employees,
        "total_attendance": total_attendance,
        "present_today": present_today,
        "absent_today": absent_today
    })


# Dashboard View
@api_view(['GET'])
def dashboard_view(request):
    employee_id = request.GET.get('employee_id')
    data = {
        'totalLeaves': 5,
        'presentDays': 20,
        'totalHours': 160,
    }
    return Response(data)


# Meetings View
@api_view(['GET'])
def meetings_view(request):
    employee_id = request.GET.get('employee_id')
    data = [
        {'title': 'Team Sync', 'date': timezone.now().date(), 'time': '10:00 AM'},
        {'title': 'Project Review', 'date': timezone.now().date(), 'time': '2:00 PM'},
    ]
    return Response(data)


# Home View
def home(request):
    return HttpResponse("<h2>Welcome to the HRMS API. Visit <a href='/api/'>/api/</a> for the API endpoints.</h2>")


# =======================
# ViewSets for REST APIs
# =======================

from rest_framework import filters

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['email']


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    # Legacy create removed. Use employee_clock_in API for attendance marking.



class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if isinstance(data.get("employee"), list):
            data["employee"] = data["employee"][0]
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status
        response = super().partial_update(request, *args, **kwargs)
        new_status = response.data.get('status')
        if new_status and new_status != old_status:
            # Create notification for employee
            Notification.objects.create(
                employee=instance.employee,
                message=f"Your leave request from {instance.start_date} to {instance.end_date} was {new_status.lower()}.",
                type="leave",
                status="unread"
            )
        return response


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

class ClockinViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = ClockinSerializer

class ClockoutViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = ClockoutSerializer
