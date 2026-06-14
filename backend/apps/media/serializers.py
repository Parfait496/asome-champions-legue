from rest_framework import serializers
from .models import MediaItem


class MediaItemSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaItem
        fields = [
            'id', 'match', 'media_type', 'file', 'file_url',
            'thumbnail', 'thumbnail_url', 'caption', 'matchday', 'created_at',
        ]

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None