from rest_framework.routers import DefaultRouter
from .views import NewsPostViewSet, SubmissionViewSet

router = DefaultRouter()
router.register('news', NewsPostViewSet, basename='news')
router.register('submissions', SubmissionViewSet, basename='submission')

urlpatterns = router.urls