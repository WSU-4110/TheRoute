import re
from rest_framework.exceptions import ValidationError

def custom_validation(data):
    """Performs custom validation on user data."""
    required_fields = ['email', 'password']

    # Check for missing required fields
    for field in required_fields:
        if field not in data or not data[field]:
            raise ValidationError(f"The field '{field}' is required.")

    # Validate email and password formats
    if not validate_email(data['email']):
        raise ValidationError("Invalid email format.")
    if not validate_password(data['password']):
        raise ValidationError("Password must be at least 8 characters long.")

    return data

def validate_email(email):
    """Checks if the email is in a valid format."""
    email_format = r'^[\w\.-]+@[\w\.-]+\.\w{2,4}$'
    if re.match(email_format, email):
        return True
    return False

def validate_password(password):
    """Ensures the password meets basic security criteria."""
    password_format = r'^[a-zA-Z0-9!@#$%^&*()_+=\-{}[\]:;"\'<>,.?/\\|~`]*$'
    if len(password) < 8:
        return False
    if not re.match(password_format, password):
        return False
    return True
