from django.db import models
from django.contrib.auth.models import User


class NewsPost(models.Model):
    TAGS = [
        ('match_report', 'Match Report'),
        ('announcement', 'Announcement'),
        ('player_spotlight', 'Player Spotlight'),
        ('stats', 'Stats'),
        ('general', 'General'),
    ]

    title = models.CharField(max_length=200)
    tag = models.CharField(max_length=30, choices=TAGS, default='general')
    excerpt = models.TextField(max_length=300)
    content = models.TextField()
    emoji = models.CharField(max_length=10, default='📰')
    bg_color = models.CharField(max_length=7, default='#0D2E4B')
    author = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title