from django.urls import path
from . import views
from django.conf.urls import url
from django.views.static import serve
# from home.static.js import demo
from cs561_shipping.settings import STATIC_ROOT

urlpatterns = [
    path('', views.index, name='home-index'),
    url(r'table', views.table, name='views_table'),
    url(r'input', views.input, name='input'),
    url(r'searchForm', views.searchForm, name='searchForm'),
    # url(r'^shipping_api/$', views.shipping_api, name='shipping_api'),
    # url(r'static/js/demo', serve.js.demo, name='demo.js'),
    url(r'^static/(?P<path>.*)$', serve,{'document_root': STATIC_ROOT}), 
]