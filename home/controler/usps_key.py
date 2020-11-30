import json
import requests
import xmltodict

from datetime import datetime, timedelta
from lxml import etree

from home.shipping_time import usps_time

country_dict = {'AD': 'Andorra', 'AE': 'United Arab Emirates', 'AF': 'Afghanistan', 'AG': 'Antigua and Barbuda',
                'AI': 'Anguilla', 'AL': 'Albania', 'AM': 'Armenia', 'AO': 'Angola', 'AR': 'Argentina', 'AT': 'Austria',
                'AU': 'Australia', 'AZ': 'Azerbaijan', 'BB': 'Barbados', 'BD': 'Bangladesh', 'BE': 'Belgium',
                'BF': 'Burkina-faso', 'BG': 'Bulgaria', 'BH': 'Bahrain', 'BI': 'Burundi', 'BJ': 'Benin',
                'BL': 'Palestine', 'BM': 'Bermuda Is.', 'BN': 'Brunei', 'BO': 'Bolivia', 'BR': 'Brazil',
                'BS': 'Bahamas', 'BW': 'Botswana', 'BY': 'Belarus', 'BZ': 'Belize', 'CA': 'Canada',
                'CF': 'Central African Republic', 'CG': 'Congo', 'CH': 'Switzerland', 'CK': 'Cook Is.', 'CL': 'Chile',
                'CM': 'Cameroon', 'CN': 'China', 'CO': 'Colombia', 'CR': 'Costa Rica', 'CS': 'Czech', 'CU': 'Cuba',
                'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DE': 'Germany', 'DJ': 'Djibouti', 'DK': 'Denmark',
                'DO': 'Dominica Rep.', 'DZ': 'Algeria', 'EC': 'Ecuador', 'EE': 'Estonia', 'EG': 'Egypt', 'ES': 'Spain',
                'ET': 'Ethiopia', 'FI': 'Finland', 'FJ': 'Fiji', 'FR': 'France', 'GA': 'Gabon', 'GB': 'United Kiongdom',
                'GD': 'Grenada', 'GE': 'Georgia', 'GF': 'French Guiana', 'GH': 'Ghana', 'GI': 'Gibraltar',
                'GM': 'Gambia', 'GN': 'Guinea', 'GR': 'Greece', 'GT': 'Guatemala', 'GU': 'Guam', 'GY': 'Guyana',
                'HK': 'Hongkong', 'HN': 'Honduras', 'HT': 'Haiti', 'HU': 'Hungary', 'ID': 'Indonesia', 'IE': 'Ireland',
                'IL': 'Israel', 'IN': 'India', 'IQ': 'Iraq', 'IR': 'Iran', 'IS': 'Iceland', 'IT': 'Italy',
                'JM': 'Jamaica', 'JO': 'Jordan', 'JP': 'Japan', 'KE': 'Kenya', 'KG': 'Kyrgyzstan',
                'KH': 'Kampuchea (Cambodia )', 'KP': 'North Korea', 'KR': 'Korea', 'KT': 'Republic of Ivory Coast',
                'KW': 'Kuwait', 'KZ': 'Kazakstan', 'LA': 'Laos', 'LB': 'Lebanon', 'LC': 'St.Lucia',
                'LI': 'Liechtenstein', 'LK': 'Sri Lanka', 'LR': 'Liberia', 'LS': 'Lesotho', 'LT': 'Lithuania',
                'LU': 'Luxembourg', 'LV': 'Latvia', 'LY': 'Libya', 'MA': 'Morocco', 'MC': 'Monaco',
                'MD': 'Moldova, Republic of', 'MG': 'Madagascar', 'ML': 'Mali', 'MM': 'Burma', 'MN': 'Mongolia',
                'MO': 'Macao', 'MS': 'Montserrat Is', 'MT': 'Malta', 'MU': 'Mauritius', 'MV': 'Maldives',
                'MW': 'Malawi', 'MX': 'Mexico', 'MY': 'Malaysia', 'MZ': 'Mozambique', 'NA': 'Namibia', 'NE': 'Niger',
                'NG': 'Nigeria', 'NI': 'Nicaragua', 'NL': 'Netherlands', 'NO': 'Norway', 'NP': 'Nepal', 'NR': 'Nauru',
                'NZ': 'New Zealand', 'OM': 'Oman', 'PA': 'Panama', 'PE': 'Peru', 'PF': 'French Polynesia',
                'PG': 'Papua New Cuinea', 'PH': 'Philippines', 'PK': 'Pakistan', 'PL': 'Poland', 'PR': 'Puerto Rico',
                'PT': 'Portugal', 'PY': 'Paraguay', 'QA': 'Qatar', 'RO': 'Romania', 'RU': 'Russia',
                'SA': 'Saudi Arabia', 'SB': 'Solomon Is', 'SC': 'Seychelles', 'SD': 'Sudan', 'SE': 'Sweden',
                'SG': 'Singapore', 'SI': 'Slovenia', 'SK': 'Slovakia', 'SL': 'Sierra Leone', 'SM': 'San Marino',
                'SN': 'Senegal', 'SO': 'Somali', 'SR': 'Suriname', 'ST': 'Sao Tome and Principe', 'SV': 'EI Salvador',
                'SY': 'Syria', 'SZ': 'Swaziland', 'TD': 'Chad', 'TG': 'Togo', 'TH': 'Thailand', 'TJ': 'Tajikstan',
                'TM': 'Turkmenistan', 'TN': 'Tunisia', 'TO': 'Tonga', 'TR': 'Turkey', 'TT': 'Trinidad and Tobago',
                'TW': 'Taiwan', 'TZ': 'Tanzania', 'UA': 'Ukraine', 'UG': 'Uganda', 'US': 'United States of America',
                'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VC': 'Saint Vincent', 'VE': 'Venezuela', 'VN': 'Vietnam',
                'YE': 'Yemen', 'YU': 'Yugoslavia', 'ZA': 'South Africa', 'ZM': 'Zambia', 'ZR': 'Zaire',
                'ZW': 'Zimbabwe'}


class USPSApiError(Exception):
    pass


class USPSApi(object):
    BASE_URL = 'https://secure.shippingapis.com/ShippingAPI.dll?API='
    urls = {
        'dom_rate': 'RateV4&XML={xml}',
        'intl_rate': 'IntlRateV2&XML={xml}',
    }

    def __init__(self, api_user_id, test=False):
        self.api_user_id = api_user_id
        self.test = test

    def get_url(self, action, xml):
        return self.BASE_URL + self.urls[action].format(
            **{'test': 'Certify' if self.test else '', 'xml': xml}
        )

    def send_request(self, action, xml):
        xml = etree.tostring(xml, encoding='iso-8859-1', pretty_print=self.test).decode()
        url = self.get_url(action, xml)
        xml_response = requests.get(url).content
        response = json.loads(json.dumps(xmltodict.parse(xml_response)))
        if 'Error' in response:
            raise USPSApiError(response['Error']['Description'])
        return response

    def shipping_rate(self, *args, **kwargs):
        return ShippingRate(self, *args, **kwargs)


class ShippingRate(object):
    def __init__(self, usps, package):
        if package.country == 'US':
            xml = etree.Element('RateV4Request', {'USERID': usps.api_user_id})
        else:
            xml = etree.Element('IntlRateV2Request', {'USERID': usps.api_user_id})
            etree.SubElement(xml, 'Revision').text = '2'

        _package = etree.SubElement(xml, 'Package', {'ID': '0'})
        package.add_to_xml(_package)
        # print(etree.tostring(xml, pretty_print=True))

        self.rst = list()
        if package.country == 'US':
            result = usps.send_request('dom_rate', xml)
            # print(result)
            for i in result['RateV4Response']['Package']['Postage']:
                # print(i)
                # print(i['Rate'])
                i['MailService'] = i['MailService'].replace('&lt;sup&gt;&#174;&lt;/sup&gt;', '')
                i['MailService'] = i['MailService'].replace('&lt;sup&gt;&#8482;&lt;/sup&gt;', '')
                # print(i['MailService'])

                shipping_time = usps_time(str(i['MailService']), "US", 'US')
                self.rst.append({"Company": "USPS",
                                 'Service': str(i['MailService']),
                                 'Money': '$' + ' ' + str(i['Rate']),
                                 'Time': shipping_time})
        else:
            result = usps.send_request('intl_rate', xml)
            for i in result['IntlRateV2Response']['Package']['Service']:
                # print(i['Postage'])
                i['SvcDescription'] = i['SvcDescription'].replace('&lt;sup&gt;&#174;&lt;/sup&gt;', '')
                i['SvcDescription'] = i['SvcDescription'].replace('&lt;sup&gt;&#8482;&lt;/sup&gt;', '')
                # print(i['SvcDescription'])

                shipping_time = usps_time(str(i['SvcDescription']), "US", str(package.country))
                self.rst.append({"Company": "USPS",
                                 'Service': str(i['SvcDescription']),
                                 'Money': '$' + ' ' + str(i['Postage']),
                                 'Time': shipping_time})


class Package(object):

    def __init__(self, zip_origination, zip_destination, pounds, container='',
                 width='', length='', height='', country='', service='All', value_of_contents='', machinable='True'):
        self.zip_origination = zip_origination
        self.zip_destination = zip_destination

        # Package weight cannot exceed 70 pounds.
        self.pounds = str(int(float(pounds)))
        self.ounces = str(round((float(pounds) - int(float(pounds))) * 16, 2))

        # any dimension of the item exceeds 12 inches.
        self.container = container
        self.width = width
        self.length = length
        self.height = height
        self.value_of_contents = value_of_contents

        self.country = country
        self.service = service
        self.machinable = machinable

        time = datetime.now() + timedelta(days=30)
        self.acceptance_datetime = time.strftime("%Y-%m-%dT%H:%M:%S")

    def add_to_xml(self, root):
        if self.country == 'US':
            etree.SubElement(root, 'Service').text = self.service

            etree.SubElement(root, 'ZipOrigination').text = self.zip_origination
            etree.SubElement(root, 'ZipDestination').text = self.zip_destination

            etree.SubElement(root, 'Pounds').text = self.pounds
            etree.SubElement(root, 'Ounces').text = self.ounces

            etree.SubElement(root, 'Container').text = self.container
            etree.SubElement(root, 'Width').text = self.width
            etree.SubElement(root, 'Length').text = self.length
            etree.SubElement(root, 'Height').text = self.height

            etree.SubElement(root, 'Machinable').text = self.machinable
        else:
            etree.SubElement(root, 'Pounds').text = self.pounds
            etree.SubElement(root, 'Ounces').text = self.ounces

            etree.SubElement(root, 'MailType').text = self.service
            etree.SubElement(root, 'ValueOfContents').text = self.value_of_contents
            etree.SubElement(root, 'Country').text = country_dict[self.country]

            etree.SubElement(root, 'Width').text = self.width
            etree.SubElement(root, 'Length').text = self.length
            etree.SubElement(root, 'Height').text = self.height

            etree.SubElement(root, 'OriginZip').text = self.zip_origination
            etree.SubElement(root, 'AcceptanceDateTime').text = self.acceptance_datetime
            etree.SubElement(root, 'DestinationPostalCode').text = self.zip_destination
