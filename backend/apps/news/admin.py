from django.contrib import admin
from .models import NewsPost, Submission


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'tag', 'author', 'is_published', 'created_at']
    list_filter = ['tag', 'is_published']
    search_fields = ['title', 'content']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['submission_type', 'name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['submission_type', 'is_read']
    search_fields = ['name', 'subject', 'message']