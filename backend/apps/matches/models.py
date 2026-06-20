from django.db import models
from apps.teams.models import Team, Player


class Match(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('live', 'Live'),
        ('done', 'Finished'),
        ('postponed', 'Postponed'),
    ]

    home_team = models.ForeignKey(
        Team, related_name='home_matches', on_delete=models.CASCADE,
        null=True, blank=True
    )
    away_team = models.ForeignKey(
        Team, related_name='away_matches', on_delete=models.CASCADE,
        null=True, blank=True
    )
    home_placeholder = models.CharField(max_length=100, blank=True, default='')
    away_placeholder = models.CharField(max_length=100, blank=True, default='')
    home_score = models.IntegerField(default=0)
    away_score = models.IntegerField(default=0)
    match_date = models.DateTimeField()
    matchday = models.IntegerField()
    venue = models.CharField(max_length=100, default='Campus Ground A')
    status = models.CharField(
        max_length=15, choices=STATUS_CHOICES, default='scheduled'
    )
    minute = models.IntegerField(null=True, blank=True)
    penalty_winner = models.ForeignKey(
        Team,
        related_name='penalty_wins',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-match_date']

    def __str__(self):
        return f"MD{self.matchday}: {self.home_team} vs {self.away_team}"


class MatchEvent(models.Model):
    EVENT_TYPES = [
        ('goal', 'Goal'),
        ('assist', 'Assist'),
        ('yellow_card', 'Yellow Card'),
        ('red_card', 'Red Card'),
        ('substitution', 'Substitution'),
        ('own_goal', 'Own Goal'),
    ]

    match = models.ForeignKey(
        Match, related_name='events', on_delete=models.CASCADE
    )
    player = models.ForeignKey(
        Player, related_name='match_events', on_delete=models.CASCADE
    )
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    minute = models.IntegerField()
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['minute']

    def __str__(self):
        return f"{self.event_type} — {self.player.name} ({self.minute}')"