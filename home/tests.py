from django.test import TestCase


# This is to give text color.
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


# Create your tests here.
class ApiTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        print('**********Start Api Test**********')
        pass

    def test_UPS_api(self):
        import json
        from home.api import ups

        print('----------Start Ups Api Test----------')

        with open("./home/test.json", 'r', encoding='UTF-8') as f:
            info_dict = json.load(f)

        for i in info_dict.values():
            result = ups(i)
            print(result)
            self.assertIsNotNone(result)

        print('----------End Ups Api Test----------\n')

    def test_Fedex_api(self):
        import json
        from home.api import fedex

        print('----------Start Fedex Api Test----------')

        with open("./home/info.json", 'r', encoding='UTF-8') as f:
            info_dict = json.load(f)

        for i in info_dict.values():
            result = fedex(i)
            print(result)
            self.assertIsNotNone(result)

        print('----------End Fedex Api Test----------\n')

    def test_Usps_api(self):
        import json
        from home.api import usps

        print('----------Start USPS Api Test----------')

        with open("./home/test.json", 'r', encoding='UTF-8') as f:
            info_dict = json.load(f)

        for i in info_dict.values():
            result = usps(i)
            print(result)
            self.assertIsNotNone(result)

        print('----------End USPS Api Test----------\n')

    def test_Sendle_api(self):
        import json
        from home.api import sendle

        print('----------Start Sendle Api Test----------')

        with open("./home/test.json", 'r', encoding='UTF-8') as f:
            info_dict = json.load(f)

        for i in info_dict.values():
            result = sendle(i)
            print(result)
            self.assertIsNotNone(result)

        print('----------End Sendle Api Test----------\n')

    def test_Shipping(self):
        import json
        from home.views import shipping_api

        print('----------Start Shipping Test----------')

        with open("./home/info.json", 'r', encoding='UTF-8') as f:
            info_dict = json.load(f)

        for i in info_dict.values():
            result = shipping_api(i)
            print(result)
            self.assertIsNotNone(result)

        print('----------End Shipping Test----------\n')


def get_data_from_web_test(
        data_from_web):  # this function is to test the server can successful get data and the data is what we expected.
    from datetime import datetime
    import json

    # check how many cases success and fail. 
    check = []

    # Start test the server can get data correct or not.
    print(bcolors.WARNING + 'Test information : Sever can get data correct or not' + bcolors.ENDC)
    print('Date : ' + datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

    # check the data is None or not and print the obtained data.
    g_result = ''
    if (data_from_web == None):
        g_result = bcolors.FAIL + "Fail" + bcolors.ENDC
        check.append(0)
    else:
        g_result = bcolors.OKGREEN + "Success" + bcolors.ENDC
        check.append(1)
    print('Data obtained by the server : ' + g_result)
    print('Data : ', data_from_web)

    # open info.json file to get expected data.
    # check open file correct and print expected data.
    with open('./home/info.json', 'r', encoding='UTF-8') as f:
        expected_data = json.load(f)
    e_result = ''
    if (expected_data == None):
        e_result = bcolors.FAIL + "Fail" + bcolors.ENDC
        check.append(0)
    else:
        e_result = bcolors.OKGREEN + "Success" + bcolors.ENDC
        check.append(1)
    print('Server expected data : ' + e_result)
    print('Data : ', expected_data["1"])

    # compare optained data and expected data are same or not.
    print('Compare optained and expected data : ')
    c_result = ''
    if (data_from_web == expected_data["1"]):
        c_result = bcolors.OKGREEN + "Correct" + bcolors.ENDC
        check.append(1)
    else:
        c_result = bcolors.FAIL + "Fault" + bcolors.ENDC
        check.append(0)
    print('Comparison result : ' + c_result)

    # print cases result.
    if (sum(check) == len(check)):
        print('Test Result : ' + bcolors.OKGREEN + 'Done' + bcolors.ENDC + f' total test {len(check):1} function.')
    else:
        print(
            f'Test Result : total test {len(check):1} function, success: {sum(check):1}, fail: {len(check) - sum(check):1} ')

    # End test.

def get_data_from_api_test(name, data_from_api):  # this function is to test the ups api can successful response data.
    from datetime import datetime
    import json

    # check how many cases success and fail. 
    check = []

    # Start test the api have result or not.
    # Because the data is from api probably will change so we can not compare.
    print(bcolors.WARNING + 'Test information : Test ' + name + ' api have result' + bcolors.ENDC)
    print('Date : ' + datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

    # Check api reture data and print it.
    a_result = ''
    if (data_from_api == []):
        a_result = bcolors.FAIL + "Fail" + bcolors.ENDC
        check.append(0)
    else:
        a_result = bcolors.OKGREEN + "Success" + bcolors.ENDC
        check.append(1)
    print('Api response reault : ' + a_result)
    print('Data : ', data_from_api)

    # print cases result.
    if (sum(check) == len(check)):
        print('Test Result : ' + bcolors.OKGREEN + 'Done' + bcolors.ENDC + f' total test {len(check):1} function.')
    else:
        print(
            f'Test Result : total test {len(check):1} function, success: {sum(check):1}, fail: {len(check) - sum(check):1} ')

    # End test.


def integration_test(data_from_web, data_from_ups_api, data_from_fedex_api, data_from_usps_api):  # This function is do the integration test
    from datetime import datetime

    # Start integration test.
    print(bcolors.HEADER + '---------- Start Test : Integration test ----------' + bcolors.ENDC)
    print('Date : ' + datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

    # Run get_data_from_web_test function.
    get_data_from_web_test(data_from_web)

    # Run get_data_from_api_test to check ups.
    get_data_from_api_test('ups', data_from_ups_api)

    # Run get_data_from_api_test to check fedex.
    get_data_from_api_test('fedex', data_from_fedex_api)

    # Run get_data_from_api_test to check usps.
    get_data_from_api_test('fedex', data_from_usps_api)

    # End integration test.
    print(bcolors.HEADER + '---------- End Test : Integration test ----------' + bcolors.ENDC)
