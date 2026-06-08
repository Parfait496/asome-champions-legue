from rest_framework.routers import DefaultRouter
from .views import MediaItemViewSet

router = DefaultRouter()
router.register('media', MediaItemViewSet, basename='media')

urlpatterns = router.urls