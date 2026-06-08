from django.db import models
from apps.matches.models import Match


class MediaItem(models.Model):
    TYPES = [
        ('photo', 'Photo'),
        ('video', 'Video'),
    ]

    match = models.ForeignKey(
        Match, related_name='media',
        on_delete=models.SET_NULL, null=True, blank=True
    )
    media_type = models.CharField(max_length=10, choices=TYPES, default='photo')
    file = models.FileField(upload_to='gallery/')
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    caption = models.CharField(max_length=200, blank=True)
    matchday = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.media_type} — {self.caption or self.file.name}"