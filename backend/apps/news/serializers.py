from rest_framework import serializers
from .models import NewsPost


class NewsPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(
        source='author.username', read_only=True
    )

    class Meta:
        model = NewsPost
        fields = [
            'id', 'title', 'tag', 'excerpt', 'content',
            'emoji', 'bg_color', 'author_name',
            'is_published', 'created_at',
        ]

from .models import NewsPost, Submission

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'submission_type', 'name', 'email',
                  'subject', 'message', 'created_at']