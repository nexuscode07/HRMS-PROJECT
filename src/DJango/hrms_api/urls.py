
# Add this import at the top
from .views import register_employee_with_clerk, delete_employee_with_clerk
"""
URL configuration for hrms_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin

from .views import (
    EmployeeViewSet, AdminViewSet, AttendanceViewSet, LeaveViewSet,
    AnnouncementViewSet, NotificationViewSet, PayrollViewSet,
    DashboardStatViewSet, MeetingScheduleViewSet,
    ClockinViewSet, ClockoutViewSet,
    home, dashboard_view, meetings_view, employee_clock_in, employee_clock_out, employee_attendance_records, admin_attendance_list, admin_dashboard_stats, register_employee_with_clerk, delete_employee_with_clerk
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'admins', AdminViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'leaves', LeaveViewSet)
router.register(r'announcements', AnnouncementViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'payroll', PayrollViewSet)
router.register(r'dashboardstats', DashboardStatViewSet)
router.register(r'meetingschedules', MeetingScheduleViewSet)
router.register(r'clockin', ClockinViewSet, basename='clockin')
router.register(r'clockout', ClockoutViewSet, basename='clockout')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    # --- Custom Employee APIs (must be above router include to avoid conflict) ---
    path('api/employees/register_with_clerk/', register_employee_with_clerk, name='register_employee_with_clerk'),
    path('api/employees/delete_with_clerk/<int:employee_id>/', delete_employee_with_clerk),
    # --- Custom Attendance APIs ---
    path('api/employee/clock-in/', employee_clock_in, name='employee-clock-in'),
    path('api/employee/clock-out/', employee_clock_out, name='employee-clock-out'),
    path('api/employee/attendance/', employee_attendance_records, name='employee-attendance-records'),
    path('api/admin/attendance/', admin_attendance_list, name='admin-attendance-list'),
    path('api/admin/dashboard/', admin_dashboard_stats, name='admin-dashboard-stats'),
    path('api/dashboard/', dashboard_view, name='dashboard'),
    path('api/meetings/', meetings_view, name='meetings'),
    path('api/', include(router.urls)),

    # ...existing code...
]