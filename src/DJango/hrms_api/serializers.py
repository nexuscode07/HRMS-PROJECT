from core.models import DashboardStat, MeetingSchedule
from rest_framework import serializers
from core.models import Employee, Admin, Attendance, Leave, Announcement, Notification, Payroll , Clockin, Clockout

class ClockinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clockin
        fields = '__all__'

class ClockoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clockout
        fields = '__all__'

class DashboardStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardStat
        fields = '__all__'

class MeetingScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingSchedule
        fields = '__all__'
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
        
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = '__all__'
