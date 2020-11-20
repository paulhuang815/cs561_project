import json

from home.shipping_time import ups_time, fedex_time, sendle_time


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
    # with open(info, 'r', encoding='UTF-8') as f:
    # print(info)
    # print(info["Dimension units"])

    # Conversion unit of Dimension
    if info["Dimension units"] != "inches":  # CM to Inches
        info["Height"] = round(float(info["Height"]) * 0.393700787, 2)
        info["Length"] = round(float(info["Length"]) * 0.393700787, 2)
        info["Width"] = round(float(info["Width"]) * 0.393700787, 2)

    if float(info["Length"]) + 2 * float(info["Height"]) + 2 * float(info["Width"]) > 165:
        print('Package exceeds the maximum size total constraints of 165 inches ' \
              '(length + girth, where girth is 2 x width plus 2 x height)')
        return []

    # Conversion unit of Weight
    if info["Weight unit"] != "pounds":  # KG to pounds
        info["Weight"] = round(float(info["Weight"]) * 2.20462262, 2)

    if float(info["Weight"]) > 150.00:
        print('The maximum per package weight is 150.00 pounds.')
        return []
    # print(info)

    # Create rate request dictionary
    rateRequestDictionary = {

        "Package": {
            "Dimensions": {
                "Height": round(float(info["Height"]), 2),
                "Length": round(float(info["Length"]), 2),
                "UnitOfMeasurement": {
                    "Code": "IN",
                    "Description": "inches"
                },
                "Width": round(float(info["Width"]), 2)
            },
            "PackageWeight": {
                "UnitOfMeasurement": {
                    "Code": "Lbs",
                    "Description": "pounds"
                },
                "Weight": round(float(info["Weight"]), 2)
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
        "ShipFrom": info["ShipFrom"],
        "ShipTo": info["ShipTo"],
        "Shipper": info["ShipFrom"]
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
            try:
                shipping_time = ups_time(ups_code[i['Service']['Code']],
                                         info["ShipFrom"]["Address"]["CountryCode"],
                                         info["ShipTo"]["Address"]["CountryCode"])
            except:
                shipping_time = '-'
            rst.append({"Company": "UPS",
                        'Service': ups_code[i['Service']['Code']],
                        'Money': '$' + ' ' + i['TotalCharges']['MonetaryValue'],
                        'Time': shipping_time})

        # print(rst)
        return rst

    except Fault as error:
        print(ET.tostring(error.detail))
        return []


def fedex(info):
    from fedex.config import FedexConfig
    from fedex.services.rate_service import FedexRateServiceRequest

    # Set API KEY
    CONFIG_OBJ = FedexConfig(key='vMdHkxHdMhV2oMlI',
                             password='oA0a7k3QUwkaApVBkrigbFMoN',
                             account_number='787098177',
                             meter_number='252470584')

    # Create request
    rate = FedexRateServiceRequest(CONFIG_OBJ)

    # service type
    rate.RequestedShipment.DropoffType = None
    rate.RequestedShipment.ServiceType = None
    rate.RequestedShipment.PackagingType = None

    # sender information
    rate.RequestedShipment.Shipper.Address.StateOrProvinceCode = info["ShipFrom"]["Address"]["StateProvinceCode"]
    rate.RequestedShipment.Shipper.Address.PostalCode = info["ShipFrom"]["Address"]["PostalCode"]
    rate.RequestedShipment.Shipper.Address.CountryCode = info["ShipFrom"]["Address"]["CountryCode"]

    # receiver information
    rate.RequestedShipment.Recipient.Address.StateOrProvinceCode = info["ShipTo"]["Address"]["StateProvinceCode"]
    rate.RequestedShipment.Recipient.Address.PostalCode = info["ShipTo"]["Address"]["PostalCode"]
    rate.RequestedShipment.Recipient.Address.CountryCode = info["ShipTo"]["Address"]["CountryCode"]

    # payer
    rate.RequestedShipment.EdtRequestType = 'NONE'
    rate.RequestedShipment.ShippingChargesPayment.PaymentType = 'SENDER'

    # item information
    package1_weight = rate.create_wsdl_object_of_type('Weight')
    # Conversion unit of Weight
    if info["Weight unit"] != "pounds":  # KG to pounds
        info["Weight"] = round(float(info["Weight"]) * 2.20462262, 2)

    if float(info["Weight"]) > 150.00:
        print('The maximum per package weight is 150.00 pounds.')
        return []

    package1_weight.Value = round(float(info["Weight"]), 2)
    package1_weight.Units = "LB"
    package1 = rate.create_wsdl_object_of_type('RequestedPackageLineItem')
    package1.Weight = package1_weight
    package1.PhysicalPackaging = None
    package1.GroupPackageCount = 1
    rate.add_package(package1)

    # Try operation
    try:
        # send request
        rate.send_request()

        rst = list()
        for service in rate.response.RateReplyDetails:
            for rate_detail in service.RatedShipmentDetails:
                # shipping time
                shipping_time = fedex_time(str(service.ServiceType),
                                           info["ShipFrom"]["Address"]["CountryCode"],
                                           info["ShipTo"]["Address"]["CountryCode"])
                # service name
                try:
                    ser_name = str(service.ServiceType).replace('_', ' ')
                except:
                    ser_name = str(service.ServiceType)

                rst.append({"Company": "Fedex",
                            'Service': ser_name,
                            'Money': '$' + ' ' + str(rate_detail.ShipmentRateDetail.TotalNetFedExCharge.Amount),
                            'Time': shipping_time})

        return rst

    except Exception as e:

        print('Fedex error information:' + str(e))

        return []


def usps(info):
    from .controler.usps_key import USPSApi, Package

    usps_api = USPSApi('589FORLE4209', test=True)

    # Conversion unit of Dimension
    if info["Dimension units"] != "inches":  # CM to Inches
        info["Height"] = round(float(info["Height"]) * 0.393700787, 2)
        info["Length"] = round(float(info["Length"]) * 0.393700787, 2)
        info["Width"] = round(float(info["Width"]) * 0.393700787, 2)

    # Conversion unit of Weight
    if info["Weight unit"] != "pounds":  # KG to pounds
        info["Weight"] = round(float(info["Weight"]) * 2.20462262, 2)

    try:
        pack = Package(
            zip_origination=info["ShipFrom"]["Address"]["PostalCode"],
            zip_destination=info["ShipTo"]["Address"]["PostalCode"],
            pounds=info["Weight"],
            width=info["Width"],
            length=info["Length"],
            height=info["Height"],
            country=info["ShipTo"]["Address"]["CountryCode"]
        )
        validation = usps_api.shipping_rate(pack)
        return validation.rst
    except Exception as e:
        print('USPS error information:' + str(e))
        return []


def sendle(info):
    import requests

    if info["ShipFrom"]["Address"]["CountryCode"] == 'US' and info["ShipTo"]["Address"]["CountryCode"] == 'US':
        # Conversion unit of Weight
        if info["Weight unit"] != "pounds":  # KG to pounds
            info["Weight"] = round(float(info["Weight"]) * 2.20462262, 2)

        if float(info["Weight"]) > 70:
            print('In US, the maximum per package weight is 70 pounds.')
            return []

        package = {'pickup_suburb': info["ShipFrom"]["Address"]["City"],
                   'pickup_postcode': info["ShipFrom"]["Address"]["PostalCode"],
                   'pickup_country': 'US',
                   'delivery_suburb': info["ShipTo"]["Address"]["City"],
                   'delivery_postcode': info["ShipTo"]["Address"]["PostalCode"],
                   'delivery_country': 'US',
                   'weight_value': info["Weight"],
                   'weight_units': 'lb',
                   }

    elif info["ShipFrom"]["Address"]["CountryCode"] == 'AU':
        # Conversion unit of Weight
        if info["Weight unit"] == "pounds":  # pounds to KG
            info["Weight"] = round(float(info["Weight"]) / 2.20462262, 2)

        if float(info["Weight"]) > 25:
            print('In Austria, the maximum per package weight is 25 kilograms.')
            return []

        # create package
        if info["ShipTo"]["Address"]["CountryCode"] == 'AU':
            # domestic
            package = {'pickup_suburb': info["ShipFrom"]["Address"]["City"],
                       'pickup_postcode': info["ShipFrom"]["Address"]["PostalCode"],
                       'pickup_country': 'AU',
                       'delivery_suburb': info["ShipTo"]["Address"]["City"],
                       'delivery_postcode': info["ShipTo"]["Address"]["PostalCode"],
                       'delivery_country': 'AU',
                       'weight_value': info["Weight"],
                       'weight_units': 'kg',
                       }
        else:
            # international
            package = {'pickup_suburb': info["ShipFrom"]["Address"]["City"],
                       'pickup_postcode': info["ShipFrom"]["Address"]["PostalCode"],
                       'delivery_country': info["ShipTo"]["Address"]["CountryCode"],
                       'weight_value': info["Weight"],
                       'weight_units': 'kg',
                       }

    else:
        return []

    # try api
    try:
        url = 'https://api.sendle.com/api/quote'
        r = requests.get(url, params=package)
        # print(r.content)

        rst = list()
        for i in r.json():
            # print(i)
            try:
                shipping_time = sendle_time(i['eta']['date_range'],
                                            i['eta']['for_pickup_date'])
            except:
                shipping_time = '-'

            if info["ShipFrom"]["Address"]["CountryCode"] == 'AU':
                rst.append({"Company": "Sendle",
                            'Service': str(i['plan_name']),
                            'Money': '$' + ' ' + str(float(i['quote']['gross']['amount']) * 0.72),
                            'Time': shipping_time})

            elif info["ShipFrom"]["Address"]["CountryCode"] == 'US':
                rst.append({"Company": "Sendle",
                            'Service': str(i['plan_name']),
                            'Money': '$' + ' ' + str(i['quote']['gross']['amount']),
                            'Time': shipping_time})

        return rst

    except Exception as e:
        print('Sendle error information:' + str(e))
        return []
