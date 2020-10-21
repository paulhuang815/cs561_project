from django.test import TestCase


# Create your tests here.
class UpsTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        print('----------Start Ups Api Test----------')
        pass

    def test_UPS_api(self):
        import json
        from home.views import ups

        print("Check return value")

        with open("./home/test.json", 'r', encoding='UTF-8') as f:
            info_dict = json.load(f)

        for i in info_dict.values():
            # json_str = json.dumps(i)
            # with open("./home/ups_test.json", 'w', encoding='UTF-8') as f:
            #     f.write(json_str)
            result = ups(i)
            print(result)
            self.assertIsNotNone(result)

        print('----------End Ups Api Test----------')

