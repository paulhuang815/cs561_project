import json

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
    info_dict = info
    # print(info_dict)
    # print(info_dict["Dimension units"])

    # Conversion unit of Dimension
    if info_dict["Dimension units"] != "inches":  # CM to Inches
        info_dict["Height"] = float(info_dict["Height"]) * 0.393700787
        info_dict["Length"] = float(info_dict["Length"]) * 0.393700787
        info_dict["Width"] = float(info_dict["Width"]) * 0.393700787

    if float(info_dict["Length"]) + 2 * float(info_dict["Height"]) + 2 * float(info_dict["Width"]) > 165:
        print('Package exceeds the maximum size total constraints of 165 inches ' \
              '(length + girth, where girth is 2 x width plus 2 x height)')
        return []

    # Conversion unit of Weight
    if info_dict["Weight unit"] != "pounds":  # KG to pounds
        info_dict["Weight"] = float(info_dict["Height"]) * 2.20462262

    if float(info_dict["Weight"]) > 150.00:
        print('The maximum per package weight is 150.00 pounds.')
        return []
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
            rst.append({"Company": "UPS", 'Service': ups_code[i['Service']['Code']],
                        'Money': i['TotalCharges']['MonetaryValue']})

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
        info["Weight"] = float(info["Height"]) * 2.20462262

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
                rst.append({"Company": "Fedex", 'Service': str(service.ServiceType),
                            'Money': str(rate_detail.ShipmentRateDetail.TotalNetFedExCharge.Amount)})

        return rst

    except Exception as e:
        print(e)
        return []


def usps(info):
    from .controler.usps_key import USPSApi, Package

    usps_api = USPSApi('589FORLE4209', test=True)

    # Conversion unit of Dimension
    if info["Dimension units"] != "inches":  # CM to Inches
        info["Height"] = float(info["Height"]) * 0.393700787
        info["Length"] = float(info["Length"]) * 0.393700787
        info["Width"] = float(info["Width"]) * 0.393700787

    # Conversion unit of Weight
    if info["Weight unit"] != "pounds":  # KG to pounds
        info["Weight"] = float(info["Height"]) * 2.20462262

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
        print(e)
        return []