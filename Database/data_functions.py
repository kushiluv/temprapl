uri = "mongodb+srv://krishnam20309:hOqmS2ItyXAbFd8h@rapl.xnjfkhl.mongodb.net/?retryWrites=true&w=majority"
import certifi
import pymongo
ca = certifi.where()

client = pymongo.MongoClient(
uri, tlsCAFile=ca)
db  = client.test

rapl_db = client["RAPL"]


def create_new_farmer_user(farmer_name: str, dob: str, phone: str, address: dict, password: str):
    try:
        farmer = {
            "name": farmer_name,
            "dob": dob,
            "phone": phone,
            "address": address,
            "password": password
        }
        farmer_id = rapl_db["Farmer"].insert_one(farmer).inserted_id
        return farmer_id
    except Exception as e:
        print(f"Error creating new farmer user: {e}")
        return None


def add_crop(farmer_id: str, crop_name: str, crop_type: str, crop_quantity: int, crop_price: int, crop_description: str):
    crop = {
        "farmer_id": farmer_id,
        "crop_name": crop_name,
        "crop_type": crop_type,
        "crop_quantity": crop_quantity,
        "crop_price": crop_price,
        "crop_description": crop_description
    }
    crop_id = rapl_db["crops"].insert_one(crop).inserted_id
    return crop_id

def farmer_login(phone: str, password: str):
    farmer = rapl_db["farmers"].find_one({"phone": phone})
    if farmer["password"] == password:
        return True
    else:
        return False

def get_farmer_details(farmer_id: str):
    farmer = rapl_db["farmers"].find_one({"_id": farmer_id})
    return farmer

def get_farmer_crops(farmer_id: str):
    crops = rapl_db["crops"].find({"farmer_id": farmer_id})
    return crops

def add_buyer(buyer_name: str, address: dict, phone: str, password: str):
    buyer = {
        "name": buyer_name,
        "address": address,
        "phone": phone,
        "password": password
    }
    buyer_id = rapl_db["buyers"].insert_one(buyer).inserted_id
    return buyer_id

def buyer_login(phone: str, password: str):
    buyer = rapl_db["buyers"].find_one({"phone": phone})
    if buyer["password"] == password:
        return True
    else:
        return False
    
def get_buyer_details(buyer_id: str):
    buyer = rapl_db["buyers"].find_one({"_id": buyer_id})
    return buyer

