import joblib

def predict_deaths(confirmed, recovered, active):
    """
    Predict the number of deaths based on confirmed, recovered, and active cases.
    
    Parameters:
    -----------
    confirmed : int
        Number of confirmed cases
    recovered : int
        Number of recovered cases
    active : int
        Number of active cases
        
    Returns:
    --------
    float
        Predicted number of deaths
    """
    # Load the model
    model = joblib.load('covid19_deaths_prediction_model.pkl')
    
    # Make prediction
    prediction = model.predict([[confirmed, recovered, active]])[0]
    
    return prediction
