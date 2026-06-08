from django.contrib import admin
from .models import Team, Player


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'year_group', 'emoji', 'color']
    list_filter = ['year_group']
    search_fields = ['name']


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ['name', 'jersey_number', 'team', 'position', 'is_captain']
    list_filter = ['team', 'position']
    search_fields = ['name']