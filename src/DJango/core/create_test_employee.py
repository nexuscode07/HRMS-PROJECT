from core.models import Employee

# Create a test employee if not exists
if not Employee.objects.filter(name="Test User").exists():
    Employee.objects.create(name="Test User", position="Developer", department="IT")
    print("Test User created.")
else:
    print("Test User already exists.")
