import unittest
from app import app, db
import json

class IntegrationTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Configure your app for testing
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        app.config['MONGODB_SETTINGS'] = {
            'db': 'your_test_db_name',
            # Add other database configuration settings
        }
        cls.client = app.test_client()

        # Setup database, you can load test data here if needed
        # ...

    @classmethod
    def tearDownClass(cls):
        # Tear down database, delete test data, etc.
        # ...
        pass

    # Test for successful registration
    def test_registration(self):
        response = self.client.post('/register', data=json.dumps({
            'username': 'testuser',
            'email': 'testuser@example.com',
            'date of birth': '1985-01-01',
            'phone': '1234567890',
            'address': 'test address',
            'Land_size': '1000 acres',
            'pswd': 'password123',
            # Add other required fields
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', response.json['status'])

    # Test for successful login
    def test_login(self):
        response = self.client.post('/login', data=json.dumps({
            'email': 'kiran@example.com' , #'testuser@example.com',
            'pswd': 'kiran123', #'password123'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', response.json['status'])

    # Test for getting user details
    def test_user_details(self):
        # Assuming you have created a user and have their ID
        user_id = 'Abhinn'
        response = self.client.get(f'/Farmer/{user_id}')
        self.assertEqual(response.status_code, 200)

    # Add more integration tests here...

if __name__ == '__main__':
    unittest.main()
