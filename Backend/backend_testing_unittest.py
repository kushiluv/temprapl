import unittest, json
from app import app
from bson import ObjectId
from flask import session
from app import db

class TestAppEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_register_farmer_success(self):
        """Test that the `/register` endpoint successfully registers a farmer."""

        data = {
            "username": "John Doe",
            "email": "john.doe@example.com",
            "dateOfBirth": "1990-01-01",
            "phone": "1234567890",
            "address": "123 Main Street",
            "pswd": "password",
            "landSize": 100,
            "villageName": "My Village"
        }

        response = self.app.post('/register', json=data)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertEqual(data['status'], "success")

    def test_login_farmer_success(self):
        """Test that the `/login` endpoint successfully logs in a farmer."""

        data = {
            "email": "john.doe@example.com",
            "password": "password"
        }

        response = self.app.post('/login', json=data)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertEqual(data['status'], "success")

    def test_logout_farmer_success(self):
        """Test that the `/logout` endpoint successfully logs out a farmer."""

        # Login the farmer
        self.test_login_farmer_success()

        # Logout the farmer
        response = self.app.post('/logout')

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertEqual(data['status'], "success")

    def test_get_products_success(self):
        """Test that the `/products` endpoint successfully returns the list of products."""

        response = self.app.get('/products')

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertIsInstance(data, list)

    def test_sell_product_success(self):
        """Test that the `/sell` endpoint successfully sells a product."""

        # Login the farmer
        self.test_login_farmer_success()

        data = {
            "title": "Product Title",
            "description": "Product Description",
            "price": 100,
            "stock": 10
        }

        response = self.app.post('/sell', form=data)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertEqual(data['status'], "success")

    def test_add_to_cart_success(self):
        """Test that the `/cart` endpoint successfully adds a product to the cart."""

        # Login the farmer
        self.test_login_farmer_success()

        data = {
            "product_id": ObjectId()
        }

        response = self.app.post('/cart', json=data)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertEqual(data['status'], "success")

    def test_get_cart_items_success(self):
        """Test that the `/cart` endpoint successfully returns the list of cart items for a logged-in farmer."""

        # Login the farmer
        self.test_login_farmer_success()

        # Add a product to the farmer's cart
        self.test_add_to_cart_success()

        response = self.app.get('/cart')

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertIsInstance(data, list)

    def test_remove_from_cart_success(self):
        """Test that the `/cart/<cart_id>` endpoint successfully removes a cart item for a logged-in farmer."""

        # Login the farmer
        self.test_login_farmer_success()

        # Add a product to the farmer's cart
        self.test_add_to_cart_success()

        # Get the first cart item ID
        cart_item = db.Cart.find_one({"user_id": ObjectId(session['user_id'])})
        cart_item_id = str(cart_item['_id'])

        # Remove the cart item
        response = self.app.delete('/cart/{}'.format(cart_item_id))

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertEqual(data['status'], "success")

        # Check that the cart item is removed from the database
        cart_item = db.Cart.find_one({"user_id": ObjectId(session['user_id']), "_id": ObjectId(cart_item_id)})

        self.assertIsNone(cart_item)

    def test_search_products_success(self):
        """Test that the `/search` endpoint successfully searches for products."""

        query = "product title"

        response = self.app.get('/search', query_string={"q": query})

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertIsInstance(data, list)

    def test_place_order_success(self):
        """Test that the `/order` endpoint successfully places an order."""

        # Login the farmer
        self.test_login_farmer_success()

        # Add a product to the farmer's cart
        self.test_add_to_cart_success()

        # Place the order
        response = self.app.post('/order')

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertEqual(data['status'], "success")

    def test_get_orders_success(self):
        """Test that the `/orders` endpoint successfully returns the list of orders for a logged-in farmer."""

        # Login the farmer
        self.test_login_farmer_success()

        # Place an order
        self.test_place_order_success()

        response = self.app.get('/orders')

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertIsInstance(data, list)

    def test_send_message_success(self):
        """Test that the `/send-message` endpoint successfully sends a message to another farmer."""

        # Login the farmer
        self.test_login_farmer_success()

        # Get the recipient farmer's ID
        recipient_farmer = db.Farmer.find_one({"email": "another_farmer@example.com"})
        recipient_farmer_id = str(recipient_farmer['_id'])

        # Send the message
        data = {
            "recipient_id": recipient_farmer_id,
            "message": "This is a test message."
        }

        response = self.app.post('/send-message', json=data)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.data)

        self.assertEqual(data['status'], "success")

if __name__ == '__main__':
    unittest.main()
