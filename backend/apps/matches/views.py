from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Match, MatchEvent
from .serializers import MatchSerializer, MatchEventSerializer
from apps.teams.models import Team, Player
from apps.teams.serializers import TeamListSerializer, PlayerSerializer


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.select_related(
        'home_team', 'away_team', 'penalty_winner'
    ).prefetch_related('events__player__team')
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['status', 'matchday']
    ordering_fields = ['match_date', 'matchday']

    @action(detail=False, methods=['get'])
    def live(self, request):
        live_matches = self.get_queryset().filter(status='live')
        return Response(MatchSerializer(live_matches, many=True).data)

    @action(detail=False, methods=['get'])
    def standings(self, request):
        teams = Team.objects.prefetch_related(
            'home_matches__penalty_winner',
            'away_matches__penalty_winner',
        )
        data = []
        for team in teams:
            try:
                entry = {'team': TeamListSerializer(team).data}
                entry.update(team.stats)
                data.append(entry)
            except Exception:
                continue

        # Eliminated teams ALWAYS go to the bottom, regardless of points.
        # Sort key: (eliminated_flag, -points, -gd, -gf)
        # eliminated_flag: 0 for active teams (sorts first), 1 for eliminated (sorts last)
        data.sort(key=lambda x: (
            1 if x['team'].get('is_eliminated') else 0,
            -x['points'],
            -x['gd'],
            -x['gf'],
        ))
        return Response(data)

    @action(detail=False, methods=['get'])
    def top_scorers(self, request):
        players = sorted(
            Player.objects.select_related('team').all(),
            key=lambda p: p.goals,
            reverse=True
        )[:20]
        return Response(PlayerSerializer(players, many=True).data)


class MatchEventViewSet(viewsets.ModelViewSet):
    queryset = MatchEvent.objects.select_related('player__team', 'match')
    serializer_class = MatchEventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['match', 'event_type']