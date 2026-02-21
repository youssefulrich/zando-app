from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, BookingReviewViewSet, FavoriteViewSet

router = DefaultRouter()

# Ajoutez basename pour chaque ViewSet
router.register("bookings", BookingViewSet, basename="booking")
router.register("reviews", BookingReviewViewSet, basename="review")
router.register("favorites", FavoriteViewSet, basename="favorite")

urlpatterns = router.urls