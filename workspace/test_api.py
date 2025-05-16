import requests
import json

# Test single prediction
def test_single_prediction():
    url = "http://localhost:5000/predict"
    data = {
        "confirmed": 100000,
        "recovered": 50000,
        "active": 45000
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    
    print("Single Prediction Test:")
    print(json.dumps(result, indent=4))
    print()

# Test batch prediction
def test_batch_prediction():
    url = "http://localhost:5000/batch_predict"
    data = [
        {
            "confirmed": 100000,
            "recovered": 50000,
            "active": 45000
        },
        {
            "confirmed": 200000,
            "recovered": 100000,
            "active": 90000
        },
        {
            "confirmed": 500000,
            "recovered": 250000,
            "active": 225000
        }
    ]
    
    response = requests.post(url, json=data)
    result = response.json()
    
    print("Batch Prediction Test:")
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    test_single_prediction()
    test_batch_prediction()