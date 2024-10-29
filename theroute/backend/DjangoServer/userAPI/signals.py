from django.apps import AppConfig
from django.db.backends.signals import connection_created

class UserApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'userAPI'

    def ready(self):
        # Connect the signal in the ready method
        connection_created.connect(self.set_journal_mode)

    def set_journal_mode(self, sender, connection, **kwargs):
        cursor = connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL;")  # Set journal mode to WAL (Write-Ahead Logging)
        cursor.execute("PRAGMA busy_timeout=30000;")  # Set busy timeout to 30 seconds
