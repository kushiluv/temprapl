import unittest
from unittest.mock import patch
from flask_testing import TestCase
from app import app, db
import json
from bson.objectid import ObjectId

class FlaskTestCase(TestCase):

    def create_app(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        return app

    def setUp(self):
        pass  # Setup your test environment if needed

    def tearDown(self):
        pass  # Teardown your test environment if needed

    # Test case 1: Testing index route
    def test_index(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Hello, World!', response.data)

    # Add more test cases here...

    # Test for successful user registration
    # @patch('app.db.Farmer.insert_one')
    # def test_successful_registration(self, mock_insert):
    #     mock_insert.return_value = {'inserted_id': '123'}
    #     response = self.client.post('/register', data=json.dumps({
    #         'username': 'testuser',
    #         'email': 'test@email.com',
    #         'dateOfBirth': '1990-01-01',
    #         'phone': '1234567890',
    #         'address': '123 Street',
    #         'pswd': 'password',
    #         'landSize': '10',
    #         'villageName': 'TestVillage'
    #     }), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn('success', response.json['status'])

    # Test for user registration with existing email
    @patch('app.db.Farmer.find_one')
    def test_registration_with_existing_email(self, mock_find):
        mock_find.return_value = {'Email': 'existing@email.com'}
        response = self.client.post('/register', data=json.dumps({
            'username': 'newuser',
            'email': 'existing@email.com',
            #... other fields
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Email already registered', response.json['error'])

    # Test for successful login
    @patch('app.db.Farmer.find_one')
    def test_successful_login(self, mock_find):
        mock_find.return_value = {
            '_id': ObjectId('654fe967c3e37f9977018d9f'),
            'Username': 'Abhinn',
            'Email': 'abhinn@gmail.com',
            'pswd': 'pass'
        }
        response = self.client.post('/login', data=json.dumps({
            'Email': 'abhinn@gmail.com',
            'pswd': 'pass'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Login Successful', response.json['message'])

    # Test for login with incorrect password
    @patch('app.db.Farmer.find_one')
    def test_login_incorrect_password(self, mock_find):
        mock_find.return_value = {
            '_id': '123',
            'Username': 'Abhinn',
            'Email': 'abhinn@gmail.com',
            'pswd': 'pass'
        }
        response = self.client.post('/login', data=json.dumps({
            'email': 'abhinn@gmail.com',
            'password': 'wrong_password'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertIn('Login Failed', response.json['message'])

    

if __name__ == '__main__':
    unittest.main()
