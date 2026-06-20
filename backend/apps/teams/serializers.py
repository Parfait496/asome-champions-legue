from rest_framework import serializers
from .models import Team, Player


class PlayerSerializer(serializers.ModelSerializer):
    goals = serializers.ReadOnlyField()
    assists = serializers.ReadOnlyField()
    yellow_cards = serializers.ReadOnlyField()
    red_cards = serializers.ReadOnlyField()

    class Meta:
        model = Player
        fields = [
            'id', 'name', 'jersey_number', 'position',
            'photo', 'is_captain', 'goals', 'assists',
            'yellow_cards', 'red_cards',
        ]


class TeamListSerializer(serializers.ModelSerializer):
    stats = serializers.ReadOnlyField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'year_group', 'emoji', 'color', 'bg_color', 'is_eliminated', 'stats']


class TeamDetailSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    stats = serializers.ReadOnlyField()

    class Meta:
        model = Team
        fields = [
            'id', 'name', 'year_group', 'emoji',
            'color', 'bg_color', 'players', 'stats',
        ]