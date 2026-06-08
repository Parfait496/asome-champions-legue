from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import MediaItem
from .serializers import MediaItemSerializer


class MediaItemViewSet(viewsets.ModelViewSet):
    queryset = MediaItem.objects.all()
    serializer_class = MediaItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['media_type', 'matchday', 'match']