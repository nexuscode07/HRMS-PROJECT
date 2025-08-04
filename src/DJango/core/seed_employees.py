from core.models import Employee

# Seed some employees for testing
Employee.objects.get_or_create(name="Test User", position="Developer", department="IT")
Employee.objects.get_or_create(name="Admin User", position="HR Manager", department="HR")
print("Test employees seeded.")
