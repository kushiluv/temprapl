import unittest
from data_functions import *

class TestDataFunction(unittest.TestCase):

    def test_create_new_farmer_user(self):
        farmer_name = "John Doe"
        dob = "1980-01-01"
        phone = "1234567890"
        address = {"street": "123 Main Street", "city": "Anytown", "state": "CA", "zip": "91234"}
        password = "password"

        farmer_id = create_new_farmer_user(farmer_name, dob, phone, address, password)

        # Assert that the farmer was created successfully
        self.assertIsNotNone(farmer_id)

        # Assert that the farmer's details are correct
        farmer = get_farmer_details(farmer_id)
        self.assertEqual(farmer_name, farmer["name"])
        self.assertEqual(dob, farmer["dob"])
        self.assertEqual(phone, farmer["phone"])
        self.assertEqual(address, farmer["address"])
        self.assertEqual(password, farmer["password"])

    def test_add_crop(self):
        farmer_id = "1234567890"
        crop_name = "Tomato"
        crop_type = "Vegetable"
        crop_quantity = 100
        crop_price = 10
        crop_description = "A delicious and nutritious fruit."

        crop_id = add_crop(farmer_id, crop_name, crop_type, crop_quantity, crop_price, crop_description)

        # Assert that the crop was added successfully
        self.assertIsNotNone(crop_id)

        # Assert that the crop's details are correct
        crop = get_farmer_crops(farmer_id)[0]
        self.assertEqual(crop_name, crop["crop_name"])
        self.assertEqual(crop_type, crop["crop_type"])
        self.assertEqual(crop_quantity, crop["crop_quantity"])
        self.assertEqual(crop_price, crop["crop_price"])
        self.assertEqual(crop_description, crop["crop_description"])

    def test_farmer_login(self):
        phone = "1234567890"
        password = "password"

        is_logged_in = farmer_login(phone, password)

        # Assert that the farmer is successfully logged in
        self.assertTrue(is_logged_in)

    def test_buyer_login(self):
        phone = "1234567890"
        password = "password"

        is_logged_in = buyer_login(phone, password)

        # Assert that the buyer is successfully logged in
        self.assertTrue(is_logged_in)

if __name__ == "__main__":
    unittest.main()
