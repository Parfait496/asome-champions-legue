from django.contrib import admin
from .models import Match, MatchEvent


class MatchEventInline(admin.TabularInline):
    model = MatchEvent
    extra = 1


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = [
        '__str__', 'matchday', 'status',
        'match_date', 'home_score', 'away_score', 'venue'
    ]
    list_filter = ['status', 'matchday']
    search_fields = ['home_team__name', 'away_team__name']
    inlines = [MatchEventInline]


@admin.register(MatchEvent)
class MatchEventAdmin(admin.ModelAdmin):
    list_display = ['match', 'player', 'event_type', 'minute']
    list_filter = ['event_type']
    search_fields = ['player__name']