from django.contrib import admin
from .models import MediaItem


@admin.register(MediaItem)
class MediaItemAdmin(admin.ModelAdmin):
    list_display = ['caption', 'media_type', 'match', 'matchday', 'created_at']
    list_filter = ['media_type', 'matchday']
    search_fields = ['caption']