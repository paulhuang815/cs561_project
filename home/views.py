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
    # print('not json : ')
    print(inputdata)
    # a = inputdata['ShipFrom[Address]']
    # print(a)
    # inputdata = inputtojson(inputdata)
    # print('json : ')
    # print(inputdata)
    # print(inputdata["Height"])

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


def ups(info):
    import xml.etree.ElementTree as ET
    from zeep import Client, Settings, helpers
    from zeep.exceptions import Fault, TransportError, XMLSyntaxError

    # Set Connection
    settings = Settings(strict=False, xml_huge_tree=True)
    client = Client('./home/controler/SCHEMA-WSDLs/RateWS.wsdl', settings=settings)

    # Set API KEY
    headers = {

        'UPSSecurity': {
            'UsernameToken': {
                'Username': 'xray_404',
                'Password': 'cs561_ups'
            },

            'ServiceAccessToken': {
                'AccessLicenseNumber': '0D8AA783849110D2'
            }

        }
    }

    # Create request dictionary
    requestDictionary = {

        "RequestOption": "Shop",
        "TransactionReference": {
            "CustomerContext": " "  # NULL
        }
    }

    # Create rate request dictionary
    with open(info, 'r', encoding='UTF-8') as f:
        info_dict = json.load(f)

    # Conversion unit of Dimension
    if info_dict["Dimension units"] != "inches":  # CM to Inches
        info_dict["Height"] = float(info_dict["Height"]) * 0.393700787
        info_dict["Length"] = float(info_dict["Length"]) * 0.393700787
        info_dict["Width"] = float(info_dict["Width"]) * 0.393700787

    if float(info_dict["Length"]) + 2 * float(info_dict["Height"]) + 2 * float(info_dict["Width"]) > 165:
        return 'Package exceeds the maximum size total constraints of 165 inches ' \
               '(length + girth, where girth is 2 x width plus 2 x height)'

    # Conversion unit of Weight
    if info_dict["Weight unit"] != "pounds":  # KG to pounds
        info_dict["Weight"] = float(info_dict["Height"]) * 2.20462262

    if float(info_dict["Weight"]) > 150.00:
        return 'The maximum per package weight is 150.00 pounds.'
    # print(info_dict)

    # Create rate request dictionary
    rateRequestDictionary = {

        "Package": {
            "Dimensions": {
                "Height": round(float(info_dict["Height"]), 2),
                "Length": round(float(info_dict["Length"]), 2),
                "UnitOfMeasurement": {
                    "Code": "IN",
                    "Description": "inches"
                },
                "Width": round(float(info_dict["Width"]), 2)
            },
            "PackageWeight": {
                "UnitOfMeasurement": {
                    "Code": "Lbs",
                    "Description": "pounds"
                },
                "Weight": round(float(info_dict["Weight"]), 2)
            },
            "PackagingType": {
                "Code": "00",  # Do not change this code
                "Description": "Rate"
            }
        },
        "Service": {
            "Code": "03",  # when "RequestOption" is "Shop", this code is ignored.
            "Description": "Service Code"
        },
        "ShipFrom": info_dict["ShipFrom"],
        "ShipTo": info_dict["ShipTo"],
        "Shipper": info_dict["ShipFrom"]
    }

    # Try operation
    try:
        response = client.service.ProcessRate(_soapheaders=headers, Request=requestDictionary,
                                              Shipment=rateRequestDictionary)

        input_dict = helpers.serialize_object(response)
        output_dict = json.loads(json.dumps(input_dict))

        # print(type(output_dict))

        # ups service code
        ups_code = {
            # Valid domestic values:
            '01': 'Next Day Air',
            '02': '2nd Day Air',
            '03': 'Ground',
            '12': '3 DaySelect',
            '13': 'Next Day Air Saver',
            '14': 'UPS Next Day Air Early',
            '59': '2nd Day Air A.M.',

            # Valid international values:
            '07': 'Worldwide Express',
            '08': 'Worldwide Expedited',
            '11': 'Standard',
            '54': 'Worldwide Express Plus',
            '65': 'Saver',
            '96': 'UPS Worldwide Express Freight',
            '71': 'UPS Worldwide Express Freight Midday',
        }

        rst = list()
        for i in output_dict['RatedShipment']:
            rst.append({'UPS Service': ups_code[i['Service']['Code']],
                        'Money': i['TotalCharges']['MonetaryValue']})

        # print(rst)
        return rst

    except Fault as error:
        print(ET.tostring(error.detail))
        return None


def ups_api(request):
    result = ups("./home/info.json")
    # print(result)
    # print(type(result))
    return result
    # return HttpResponse(result)
