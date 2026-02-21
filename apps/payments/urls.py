from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, RefundViewSet, PayoutViewSet

router = DefaultRouter()
router.register("payments", PaymentViewSet, basename="payments")
router.register("refunds", RefundViewSet, basename= "refunds")
router.register("payouts", PayoutViewSet, basename= "payouts")

urlpatterns = [
    path("", include(router.urls)),
]
