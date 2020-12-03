import re
from datetime import datetime


def ups_time(service, from_country, to_country):
    if from_country != 'US':
        return '-'
    else:
        # to United States
        if to_country == 'US':
            dom_time = {
                # domestic time:
                'Next Day Air': '1 Day',
                '2nd Day Air': '1 Day',
                'Ground': '1-5 Days',
                '3 DaySelect': '1-3 Days',
                'Next Day Air Saver': '1 Day',
                'UPS Next Day Air Early': '1 Day',
                '2nd Day Air A.M.': '1 Day',
            }
            if service in dom_time.keys():
                return dom_time[service]
            else:
                return '-'

        # to Canada
        elif to_country == 'CA':
            return '1 Day'

        # to Mexico, Latin America or Europe
        elif to_country in ('MX', 'AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'PA', 'PE', 'UY',
                            'DE', 'FR', 'IT', 'NL', 'BE', 'LU', 'IE', 'GR', 'ES', 'PT', 'AT', 'FI', 'SI', 'CY', 'MT',
                            'SK', 'EE', 'LV'):
            return '2 Days'

        # to Middle East, Asia or Africa
        else:
            return 'more than 3 Days'


def fedex_time(service, time_lst):
    for i in time_lst:
        i = dict(i)
        if service == i['Service']:
            try:
                shipping_time = str((i['DeliveryDate'] - datetime.now().date()).days)
                # print(shipping_time)
                if shipping_time == '1':
                    return "{0} Day".format(shipping_time)
                else:
                    return "{0} Days".format(shipping_time)
            except:
                return '-'

    return '-'


def usps_time(service, from_country, to_country):
    if from_country != 'US':
        return '-'

    else:
        # to United States
        if to_country == 'US':
            if service == 'USPS Retail Ground':
                return '2-9 Days'

            elif service == 'Media Mail Parcel':
                return '2-10 Days'

            elif service == 'Library Mail Parcel':
                return '7-10 Days'

            else:
                pattern = re.compile(r'\d+')  # find number
                time = pattern.findall(service)
                if time:
                    return '{0} Days'.format(time[0])
                else:
                    return '-'

        # to other countries
        else:
            if service == 'Priority Mail Express International':
                return '3-5 Days'

            elif service == 'Priority Mail International':
                return '6-10 Days'

            else:
                return '-'


def sendle_time(date_range, pickup_date):
    try:
        shipping_time = []
        for deliver_time in date_range:
            shipping_time.append(
                (datetime.strptime(deliver_time, '%Y-%m-%d') - datetime.strptime(pickup_date, '%Y-%m-%d')).days)
        return "{0}-{1} Days".format(shipping_time[0], shipping_time[1])
    except:
        return '-'
