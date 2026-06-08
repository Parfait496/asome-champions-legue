from django.contrib import admin
from .models import NewsPost


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'tag', 'author', 'is_published', 'created_at']
    list_filter = ['tag', 'is_published']
    search_fields = ['title', 'content']