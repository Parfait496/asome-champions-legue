from rest_framework.routers import DefaultRouter
from .views import MatchViewSet, MatchEventViewSet

router = DefaultRouter()
router.register('matches', MatchViewSet, basename='match')
router.register('events', MatchEventViewSet, basename='event')

urlpatterns = router.urls