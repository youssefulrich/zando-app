from rest_framework.routers import DefaultRouter
from .views import ResidenceViewSet, ResidenceImageViewSet, AvailabilityViewSet

router = DefaultRouter()

router.register("residences", ResidenceViewSet)
router.register("residence-images", ResidenceImageViewSet)
router.register("availabilities", AvailabilityViewSet)

urlpatterns = router.urls
