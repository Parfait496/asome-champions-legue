from rest_framework import serializers
from .models import Match, MatchEvent
from apps.teams.models import Team
from apps.teams.serializers import TeamListSerializer


class MatchEventSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)
    team_name = serializers.CharField(source='player.team.name', read_only=True)

    class Meta:
        model = MatchEvent
        fields = ['id', 'player_name', 'team_name', 'event_type', 'minute', 'notes']


class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamListSerializer(read_only=True)
    away_team = TeamListSerializer(read_only=True)
    home_team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='home_team',
        write_only=True, required=False, allow_null=True
    )
    away_team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='away_team',
        write_only=True, required=False, allow_null=True
    )
    penalty_winner_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='penalty_winner',
        write_only=True, required=False, allow_null=True
    )
    penalty_winner = TeamListSerializer(read_only=True)
    events = MatchEventSerializer(many=True, read_only=True)
    home_display = serializers.SerializerMethodField()
    away_display = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = [
            'id', 'home_team', 'away_team', 'home_team_id', 'away_team_id',
            'home_placeholder', 'away_placeholder', 'home_display', 'away_display',
            'home_score', 'away_score', 'match_date', 'matchday', 'venue',
            'status', 'minute', 'penalty_winner', 'penalty_winner_id', 'events',
        ]

    def get_home_display(self, obj):
        if obj.home_team:
            return obj.home_team.name
        return obj.home_placeholder or 'À définir'

    def get_away_display(self, obj):
        if obj.away_team:
            return obj.away_team.name
        return obj.away_placeholder or 'À définir'