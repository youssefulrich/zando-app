from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, VehicleImageViewSet

router = DefaultRouter()

router.register("vehicles", VehicleViewSet)
router.register("vehicle-images", VehicleImageViewSet)

urlpatterns = router.urls
