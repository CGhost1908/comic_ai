from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.home, name="home"),
    path("home/", views.home, name="home"),
    path("comic/", views.comic, name="comic"),
    path("manga/", views.manga, name="manga"),
    path('save_page/', views.save_page, name='save_page'),
    path('save/<int:save_id>/', views.view_save, name='view_save'),
]