from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Team, Player
from .serializers import TeamListSerializer, TeamDetailSerializer, PlayerSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.prefetch_related('players')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['year_group', 'is_eliminated']
    search_fields = ['name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TeamDetailSerializer
        return TeamListSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.select_related('team')
    serializer_class = PlayerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['team', 'position']
    search_fields = ['name']
    ordering_fields = ['name', 'jersey_number']