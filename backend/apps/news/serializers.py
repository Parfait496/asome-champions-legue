from rest_framework import serializers
from .models import NewsPost, Submission


class NewsPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    is_published = serializers.BooleanField(default=True, required=False)

    class Meta:
        model = NewsPost
        fields = [
            'id', 'title', 'tag', 'excerpt', 'content',
            'cover_image', 'cover_image_url', 'emoji', 'bg_color',
            'author_name', 'author_title', 'is_published', 'created_at',
        ]

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            'id', 'submission_type', 'name', 'email',
            'subject', 'message', 'created_at',
        ]