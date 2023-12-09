import uuid
from flask import Flask, render_template, session, request, redirect, url_for, make_response
from flask import jsonify
import flask
import certifi
import pymongo
import json
import time
import math
import numpy as np
import pandas as pd
from bson.objectid import ObjectId
from datetime import datetime
from werkzeug.utils import secure_filename
import gridfs
from flask_cors import CORS
from pymongo import MongoClient
import certifi
import razorpay
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
app.secret_key = 'your_secret_keysadf' 
# Define a route to list all collections
uri = "mongodb+srv://krishnam20309:hOqmS2ItyXAbFd8h@rapl.xnjfkhl.mongodb.net/?retryWrites=true&w=majority"
razorpay_client = razorpay.Client(auth=("id", "secretkey"))
ca = certifi.where()

client = pymongo.MongoClient(
uri, tlsCAFile=ca)

rapl_db = client["RAPL"]



ca = certifi.where()
client = MongoClient(
    "mongodb+srv://krishnam20309:hOqmS2ItyXAbFd8h@rapl.xnjfkhl.mongodb.net/?retryWrites=true&w=majority",
    tlsCAFile=ca
)
db = client.RAPL  # Use the appropriate database
fs = gridfs.GridFS(db)
@app.route('/image/<image_id>')
def serve_image(image_id):
    try:
        image_file = fs.get(ObjectId(image_id))
        image_url = url_for('serve_image', image_id=image_id, _external=True)
        print(f"Serving image at URL: {image_url}")
        app.logger.info(f"Serving image at URL: {image_url}")
        response = make_response(image_file.read())
        response.mimetype = image_file.content_type
        return response
    except gridfs.NoFile:
        return jsonify({"error": "Image not found"}), 404

# Start the Flask loop
@app.route('/')
def hello_world():
    return jsonify(message="Hello, World!")
@app.route('/session')
def get_session():
    
    user_id = session.get('user_id')
    
    if user_id:
       
        return jsonify({
            "is_authenticated": True,
            "user_id": session.get('user_id'),
            "username": session.get('username')  # Include username in the response
        })
    else:
        return jsonify({"is_authenticated": False}), 401
# Register route
@app.route('/details')
def get_user_details():
    user_id = session.get('user_id')
    if user_id:
        farmer = db['Farmer'].find_one({"_id": ObjectId(user_id)})
        if farmer:
            picture_id = farmer.get('picture_id', '')
            image_url = url_for('serve_image', image_id=picture_id) if picture_id else ''
            # Process the farmer document, excluding sensitive fields like password
            farmer_details = {
                "Username": farmer.get('Username'),
                "Email": farmer.get('Email'),
                "dob": farmer.get('date of birth'),
                "phone": farmer.get('phone'),
                "address": farmer.get('address'),
                "land_size": farmer.get("Land_Size"),
                "village": farmer.get("Village_name"),
                "image_url": image_url,  # Include the image URL
            }
            return jsonify(farmer_details), 200
        else:
            return jsonify({"error": "Farmer not found"}), 404
    else:
        return jsonify({"error": "Unauthorized"}), 401
@app.route('/Farmer/<user_id>', methods=['GET'])
def get_farmer(user_id):
    try:
        # Convert string to ObjectId
        object_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid ID format"}), 400

    farmer = db.Farmer.find_one({"_id": object_id})
    if farmer:
        farmer['_id'] = str(farmer['_id'])  # Convert ObjectId to string
        if 'picture_id' in farmer and isinstance(farmer['picture_id'], ObjectId):
            farmer['picture_id'] = str(farmer['picture_id'])
        
        return jsonify(farmer)
    else:
        return jsonify({"error": "Farmer not found"}), 404

from flask import request, jsonify
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
import gridfs

@app.route('/Farmer/<user_id>', methods=['PUT'])
def update_farmer(user_id):
    # Check if the request has the file part and other form fields
    if request.method == 'PUT':
        # Initialize farmer_data as a dictionary to store non-file form fields
        farmer_data = request.form.to_dict()
        file = request.files.get('picture')

        if file and file.filename != '':
            filename = secure_filename(file.filename)
            content_type = file.content_type

            fs = gridfs.GridFS(db)  # Ensure GridFS is initialized

            # Delete the old image here if you want to
            # ...

            # Upload the new image and add picture_id to farmer_data dictionary
            picture_id = fs.put(file, content_type=content_type, filename=filename)
            farmer_data['picture_id'] = str(picture_id)

        try:
            # Convert string to ObjectId
            object_id = ObjectId(user_id)

            # Exclude the _id field from the update data, if it exists
            farmer_data.pop('_id', None)

            # Update the database
            result = db.Farmer.update_one({"_id": object_id}, {"$set": farmer_data})
            if result.matched_count:
                return jsonify({"status": "success"})
            else:
                return jsonify({"error": "Update failed"}), 400
        except bson.errors.InvalidId:
            return jsonify({"error": "Invalid ID format"}), 400

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.form  # Use form to get text input data
        file = request.files.get('picture')  # Access the file
        
        # Check if email already exists in the database
        if db['Farmer'].find_one({"Email": data.get('email')}):
            app.logger.error('Failed to register user', exc_info='Email already registered')
            # return jsonify({"error": str(e)}), 500
            return jsonify({"error": "Email already registered"}), 400  # Or any other status code you see fit

        # Proceed with registration if email is not taken
        new_farmer = {
            "Username": data.get('username'),
            "Email": data.get('email'),
            "date of birth": data.get('dateOfBirth'),
            "phone": data.get('phone'),
            "address": data.get('address'),
            "pswd": data.get('pswd'),
            "Land_Size": data.get('landSize'),
            "Village_name": data.get('villageName')
        }
        new_farmer['isApproved'] = False

        if file:
            filename = secure_filename(file.filename)
            content_type = file.content_type
            picture_id = fs.put(file, content_type=content_type, filename=filename)
            new_farmer['picture_id'] = picture_id  # Store the picture ID in the user document
        
        result = db['Farmer'].insert_one(new_farmer)
        return jsonify({"status": "success", "inserted_id": str(result.inserted_id)})
    except Exception as e:
        app.logger.error('Failed to register user', exc_info=e)
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    print("inninininininninninin")
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        farmer = rapl_db["Farmer"].find_one({"Email": email})
        #print(farmer)
        if farmer and farmer.get("pswd") == password:
            if not farmer.get("isApproved", False):
                return jsonify({"status": "fail", "message": "Account not approved"}), 403
            print(farmer.get("isApproved"))
            print("in")
            session['user_id'] = str(farmer['_id'])  # Save user ID in session
          
            session['username'] = str(farmer['Username'])

            session['Email'] = str(farmer['Email'])
            print(session['Email'])
            
            return jsonify({"status": "success", "message": "Login Successful","username":session['username'] ,"user_id": session['user_id']}), 200
        else:
            
            return jsonify({"status": "fail", "message": "Incorrect password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/approve_user/<user_id>', methods=['POST'])
def approve_user(user_id):
    try:
        object_id = ObjectId(user_id)
        result = db.Farmer.update_one({"_id": object_id}, {"$set": {"isApproved": True}})
        if result.matched_count:
            return jsonify({"status": "success"})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user_id from session
    return jsonify({"status": "success", "message": "Logged out"}), 200

@app.route('/cart', methods=['GET'])
def get_cart_items():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']

    try:
        cart_items_cursor = db.Cart.find({"user_id": user_id})
        cart_items = []
        
        for item in cart_items_cursor:
            item['_id'] = str(item['_id'])  # Convert ObjectId to string
            item['user_id'] = str(item['user_id'])

            # Fetch product details
            product = db.Product.find_one({"_id": ObjectId(item['product_id'])})
            if product:
                item['product_price'] = float(product.get('price', 0))
                item['product_name'] = product.get('title', 'No title')
                # Convert coverImg ObjectId to a URL
                if 'coverImg' in product and isinstance(product['coverImg'], ObjectId):
                    item['coverImg'] = url_for('serve_image', image_id=str(product['coverImg']))
                else:
                    item['coverImg'] = 'No image'
            
            cart_items.append(item)
        
        return jsonify(cart_items)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/cart', methods=['POST'])
def add_to_cart():
    if 'user_id' not in flask.session:
        return jsonify({"error": "Not logged in"}), 401
    
    user_id = flask.session['user_id']
    quantity = int(request.json.get('quantity', 1))
    product_id = request.json['product_id']

    with client.start_session() as session:
        with session.start_transaction():
            product = db.Product.find_one({"_id": ObjectId(product_id)}, session=session)
            if not product:
                return jsonify({"error": "Product not found"}), 404
            
            if product['stock'] < quantity:
                return jsonify({"error": "Not enough stock available"}), 400
            
            existing_item = db.Cart.find_one({
                "user_id": user_id,
                "product_id": product_id
            }, session=session)
            
            if existing_item:
                new_quantity = existing_item['quantity'] + quantity
                if product['stock'] >= new_quantity:
                    db.Cart.update_one(
                        {"_id": existing_item['_id']},
                        {"$set": {"quantity": new_quantity, "added_on": datetime.now()}},
                        session=session
                    )
                    db.Product.update_one(
                        {"_id": ObjectId(product_id)},
                        {"$inc": {"stock": -quantity}},
                        session=session
                    )
                else:
                    return jsonify({"error": "Not enough stock to add more of this product"}), 400
            else:
                cart_item = {
                    "user_id": user_id,
                    "product_id": product_id,
                    "quantity": quantity,
                    "added_on": datetime.now()
                }
                db.Cart.insert_one(cart_item, session=session)
                db.Product.update_one(
                    {"_id": ObjectId(product_id)},
                    {"$inc": {"stock": -quantity}},
                    session=session
                )

            session.commit_transaction()
            return jsonify({"status": "success"})
@app.route('/cart/<cart_id>', methods=['DELETE'])
def remove_from_cart(cart_id):
    if 'user_id' not in flask.session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = flask.session['user_id']

    with client.start_session() as session:
        with session.start_transaction():
            try:
                object_id = ObjectId(cart_id)
                cart_item = db.Cart.find_one({"_id": object_id, "user_id": user_id}, session=session)
                
                if not cart_item:
                    return jsonify({"error": "Cart item not found or does not belong to user"}), 404

                product_update_result = db.Product.update_one(
                    {"_id": ObjectId(cart_item['product_id'])},
                    {"$inc": {"stock": cart_item['quantity']}},
                    session=session
                )
                
                if product_update_result.matched_count == 0:
                    session.abort_transaction()
                    return jsonify({"error": "Failed to update product stock"}), 400

                cart_delete_result = db.Cart.delete_one({"_id": object_id}, session=session)
                
                if cart_delete_result.deleted_count == 0:
                    session.abort_transaction()
                    return jsonify({"error": "Failed to remove item from cart"}), 400
                
                session.commit_transaction()
                return jsonify({"status": "success"})

            except Exception as e:
                session.abort_transaction()
                return jsonify({"error": str(e)}), 500


@app.route('/products', methods=['GET'])
def get_products():
    try:
        # Fetch only approved products
        products_cursor = db.Product.find({"isApproved": True})
        products_list = list(products_cursor)
        for product in products_list:
            product['_id'] = str(product['_id'])  # Convert ObjectId to string
            if 'coverImg' in product and isinstance(product['coverImg'], ObjectId):
                product['coverImg'] = url_for('serve_image', image_id=str(product['coverImg']))
            print("image : ",product['coverImg'])
        return jsonify(products_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    if 'user_id' not in session or session['Email'] != 'abhinn@gmail.com':
        return jsonify({"error": "Unauthorized"}), 401

    try:
        result = db.Product.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count:
            return jsonify({"status": "success"})
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/sell', methods=['POST'])
def sell_product():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']
    data = request.form.to_dict()
    file = request.files.get('coverImg')

    new_product = {
        "title": data.get('title'),
        "description": data.get('description'),
        "price": data.get('price'),
        "stock": int(data.get('stock')),
        "seller_id": user_id,
        "isApproved": False  # Set isApproved to False by default for new listings
    }

    if file:
        fs = gridfs.GridFS(db)
        filename = secure_filename(file.filename)
        content_type = file.content_type
        cover_img_id = fs.put(file, content_type=content_type, filename=filename)
        new_product['coverImg'] = cover_img_id

    try:
        result = db['Product'].insert_one(new_product)
        return jsonify({"status": "success", "inserted_id": str(result.inserted_id)})
    except Exception as e:
        app.logger.error('Failed to list product', exc_info=e)
        return jsonify({"error": str(e)}), 500

@app.route('/create_order', methods=['POST'])
def create_order():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']
    data = request.json
    products = data.get('products')
    total_price = data.get('total_price')

    with client.start_session() as mongo_session:
        with mongo_session.start_transaction():
            new_order = {
                "user_id": user_id,
                "products": products,
                "total_price": total_price,
                "status": "confirmed",
                "created_at": datetime.now()
            }

            # Insert the new order into the database
            db.Orders.insert_one(new_order, session=mongo_session)

            # Clear the cart by deleting all items for the user
            db.Cart.delete_many({"user_id": user_id}, session=mongo_session)

            mongo_session.commit_transaction()
            return jsonify({"status": "success"})

    # If an exception occurs, it would be caught by a global exception handler
    # or you can add a try-except block here and handle accordingly.

@app.route('/user/orders', methods=['GET'])
def get_user_orders():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']

    try:
        orders = list(db.Orders.find({"user_id": (user_id)}))
        print(orders)
        for order in orders:
            order['_id'] = str(order['_id'])  # Convert ObjectId to string for JSON serialization

        return jsonify(orders)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/user/listed-products', methods=['GET'])
def get_user_listed_products():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']

    try:
        products = list(db.Product.find({"seller_id": user_id}))
        
        for product in products:
            product['_id'] = str(product['_id']) 
            if 'coverImg' in product and isinstance(product['coverImg'], ObjectId):
                product['coverImg'] = url_for('serve_image', image_id=str(product['coverImg']))
            print(product['_id'])
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/products/unapproved', methods=['GET'])
def get_unapproved_products():
    
    # This endpoint returns all products that are not yet approved
    if 'user_id' not in session or session['Email'] != 'abhinn@gmail.com':
        print("in")
        return jsonify({"error": "Unauthorized"}), 401

    try:
        unapproved_products = list(db.Product.find({"isApproved": False}))
        for product in unapproved_products:
            product['_id'] = str(product['_id'])
            if 'coverImg' in product and isinstance(product['coverImg'], ObjectId):
                product['coverImg'] = url_for('serve_image', image_id=str(product['coverImg']))
        return jsonify(unapproved_products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/products/approve/<product_id>', methods=['POST'])
def approve_product(product_id):
    if 'user_id' not in session or session['Email'] != 'abhinn@gmail.com':
        return jsonify({"error": "Unauthorized"}), 401

    try:
        result = db.Product.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"isApproved": True}}
        )
        if result.matched_count:
            return jsonify({"status": "success"})
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/users/unapproved', methods=['GET'])
def get_unapproved_users():
    if 'user_id' not in session or session['Email'] != 'abhinn@gmail.com':
        return jsonify({"error": "Unauthorized"}), 401
    try:
        # Fetch only unapproved users
        unapproved_users_cursor = db.Farmer.find({"isApproved": False})
        unapproved_users_list = list(unapproved_users_cursor)
        print(unapproved_users_list)
        
        for user in unapproved_users_list:
            if 'picture_id' in user and isinstance(user['picture_id'], ObjectId):
                user['picture_id'] = url_for('serve_image', image_id=str(user['picture_id']))
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
        return jsonify(unapproved_users_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)