from django.urls import path
from . import views
from django.conf.urls import url


urlpatterns = [
    #path('', views.index, name='home-index'),
    #url(r'^', views.table, name='views_table'),
    url(r'^ups/$', views.ups_api, name='ups_api'),
]