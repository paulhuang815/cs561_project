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


def fedex_time(service, from_country, to_country):
    return '-'


def usps_time(service, from_country, to_country):
    return '-'


def sendle_time(date_range, pickup_date):
    shipping_time = []
    for deliver_time in date_range:
        shipping_time.append(
            (datetime.strptime(deliver_time, '%Y-%m-%d') - datetime.strptime(pickup_date, '%Y-%m-%d')).days)
    return "{0}-{1} Days".format(shipping_time[0], shipping_time[1])
