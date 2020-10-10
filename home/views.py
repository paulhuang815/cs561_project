import json

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse


# from .weatherModels import WeaTest
# Create your views here.

def index(request):
    return render(request, 'index.html')


def table(request):
    data = {"data": [
        {
            "id": "10000001",
            "cid": "20454554",
            "city": "Corvallis",
            "latitude": "1112.5555",
            "longitude": "134.54684",
            "street_name": "SW Chickadee ST",
            "injured_count": "4",
            "crash_time": "05/11/2015"
        },
    ]
    }
    return JsonResponse(data)
