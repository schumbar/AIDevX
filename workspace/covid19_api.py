from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load the model
model = joblib.load('covid19_deaths_prediction_model.pkl')

@app.route('/')
def home():
    return """
    <h1>COVID-19 Death Prediction API</h1>
    <p>This API predicts the number of deaths based on confirmed, recovered, and active cases.</p>
    <h2>Usage:</h2>
    <p>Send a POST request to /predict with the following JSON data:</p>
    <pre>
    {
        "confirmed": 100000,
        "recovered": 50000,
        "active": 45000
    }
    </pre>
    """

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.get_json()
        
        # Extract features
        confirmed = data.get('confirmed', 0)
        recovered = data.get('recovered', 0)
        active = data.get('active', 0)
        
        # Make prediction
        prediction = model.predict([[confirmed, recovered, active]])[0]
        
        # Calculate mortality rate
        mortality_rate = (prediction / confirmed) * 100 if confirmed > 0 else 0
        
        # Return prediction
        return jsonify({
            'prediction': round(float(prediction)),
            'mortality_rate': round(mortality_rate, 2),
            'input': {
                'confirmed': confirmed,
                'recovered': recovered,
                'active': active
            }
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    try:
        # Get data from request
        data = request.get_json()
        
        # Check if data is a list
        if not isinstance(data, list):
            return jsonify({'error': 'Input must be a list of objects'}), 400
        
        # Process each item in the list
        results = []
        for item in data:
            # Extract features
            confirmed = item.get('confirmed', 0)
            recovered = item.get('recovered', 0)
            active = item.get('active', 0)
            
            # Make prediction
            prediction = model.predict([[confirmed, recovered, active]])[0]
            
            # Calculate mortality rate
            mortality_rate = (prediction / confirmed) * 100 if confirmed > 0 else 0
            
            # Add to results
            results.append({
                'prediction': round(float(prediction)),
                'mortality_rate': round(mortality_rate, 2),
                'input': {
                    'confirmed': confirmed,
                    'recovered': recovered,
                    'active': active
                }
            })
        
        # Return predictions
        return jsonify(results)
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)