from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=50)
    department = models.CharField(max_length=50)

class Admin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=50)
    position = models.CharField(max_length=50)

class DashboardStat(models.Model):
    employees = models.IntegerField(default=0)
    meetings = models.IntegerField(default=0)
    present_today = models.IntegerField(default=0)
    leaves_today = models.IntegerField(default=0)

class MeetingSchedule(models.Model):
    title = models.CharField(max_length=100)
    time = models.CharField(max_length=50)
    location = models.CharField(max_length=100)

class Attendance(models.Model):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20)
    clock_in = models.TimeField(null=True, blank=True)
    clock_out = models.TimeField(null=True, blank=True)
    
class Leave(models.Model):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, default='pending')  # 'approved' | 'pending' | 'rejected'
    applied_date = models.DateField(auto_now_add=True)

    def days(self):
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days + 1
        return 0
    
class Announcement(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    # employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, default=1, on_delete=models.CASCADE)

    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Payroll(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    month = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="Pending")
    generated_at = models.DateTimeField(auto_now_add=True)   

class Clockin(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    clock_in_time = models.DateTimeField(auto_now_add=True)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # Default to 0.0 hours

    def __str__(self):
        return f"{self.employee.name} - {self.clock_in_time.strftime('%Y-%m-%d %H:%M:%S')}"

 
class Clockout(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    clock_out_time = models.DateTimeField(auto_now_add=True)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # Default to 0.0 hours
    
    def __str__(self):
        return f"{self.employee.name} - {self.clock_out_time.strftime('%Y-%m-%d %H:%M:%S')}"

