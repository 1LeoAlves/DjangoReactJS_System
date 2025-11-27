# from django.urls import path
# from . import views

# urlpatterns = [
#     path('hello/', views.hello_world),
# ]

from rest_framework import routers
from .views import TaskViewSet, UserViewSet

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')  # 👈 adiciona basename
router.register(r'users', UserViewSet)

urlpatterns = router.urls