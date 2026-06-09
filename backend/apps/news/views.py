from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import NewsPost, Submission
from .serializers import NewsPostSerializer, SubmissionSerializer


class NewsPostViewSet(viewsets.ModelViewSet):
    queryset = NewsPost.objects.filter(is_published=True)
    serializer_class = NewsPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    search_fields = ['title', 'content']
    filterset_fields = ['tag']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticatedOrReadOnly()]