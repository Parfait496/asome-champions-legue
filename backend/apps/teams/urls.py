from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, PlayerViewSet

router = DefaultRouter()
router.register('teams', TeamViewSet, basename='team')
router.register('players', PlayerViewSet, basename='player')

urlpatterns = router.urls