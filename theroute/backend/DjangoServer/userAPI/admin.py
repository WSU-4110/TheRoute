from django.contrib import admin
from .models import AppUser

@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'date_joined')
    search_fields = ('email', 'username')
    ordering = ('date_joined',)