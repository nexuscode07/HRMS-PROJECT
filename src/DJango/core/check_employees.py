from core.models import Employee

print("Employee count:", Employee.objects.count())
for emp in Employee.objects.all():
    print(f"ID: {emp.id}, Name: {emp.name}, Position: {emp.position}, Department: {emp.department}")
