import json

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse


# from .weatherModels import WeaTest
# Create your views here.
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
# Receiving Data from AJAX
def searchForm(request):
    form_data_dict = {}
    form_data_list = json.loads(request.POST.get('formData', None))
    for field in form_data_list:
        form_data_dict[field["name"]] = field["value"]
    print(form_data_dict)
    return render(request, 'index.html')



def inputtojson(input):
    data = {
        "Dimension units": input['Dimension units'],
        "Height": input['Height'],
        "Length": input['Length'],
        "Width": input['Width'],
        "Weight unit": input['Weight unit'],
        "Weight": input['Weight'],
        "ShipFrom": {
            "Address": {
            "AddressLine": input['ShipFrom[Address][AddressLine]'],
            "City": input['ShipFrom[Address][City]'],
            "CountryCode": input['ShipFrom[Address][CountryCode]'],
            "PostalCode": input['ShipFrom[Address][PostalCode]'],
            "StateProvinceCode": input['ShipFrom[Address][StateProvinceCode]']
            }
        },
        "ShipTo": {
            "Address": {
            "AddressLine": input['ShipTo[Address][AddressLine]'],
            "City": input['ShipTo[Address][City]'],
            "CountryCode": input['ShipTo[Address][CountryCode]'],
            "PostalCode": input['ShipTo[Address][PostalCode]'],
            "StateProvinceCode": input['ShipTo[Address][StateProvinceCode]']
            }
        }
    }
    return data

def input(request):
    inputdata = request.GET
    #print('not json : ')
    print(inputdata)
    #a = inputdata['ShipFrom[Address]']
    #print(a)
    #inputdata = inputtojson(inputdata)
    #print('json : ')
    #print(inputdata)
    #print(inputdata["Height"])

    data = {"data": [
        {
            "UPS_Service": "Saver",
            "Money": "1552.60",
        },
        {
            "UPS_Service": "Worldwide Expedited",
            "Money": "932.72",
        },
    ]
    }
    return JsonResponse(data)

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
