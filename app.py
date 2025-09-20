from flask import Flask, request, render_template, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load the trained model and scaler
try:
    with open('logistic_model_without.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
    
    with open('scaler_without.pkl', 'rb') as scaler_file:
        scaler = pickle.load(scaler_file)
        
    print("Model and scaler loaded successfully!")
except FileNotFoundError:
    print("Error: Model or scaler files not found. Make sure 'logistic_model.pkl' and 'scaler.pkl' are in the same directory.")
    model = None
    scaler = None
except Exception as e:
    print(f"An error occurred while loading files: {e}")
    model = None
    scaler = None

@app.route('/')
def home():
    """Renders the main page of the website."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handles prediction requests from the website form."""
    if not model or not scaler:
        return jsonify({'error': 'Model or scaler not loaded properly.'}), 500

    try:
        # Get data from the POST request's JSON body
        data = request.get_json()
        
        # Extract features in the correct order as the model was trained on
        pregnancies = float(data['Pregnancies'])
        glucose = float(data['Glucose'])
        blood_pressure = float(data['BloodPressure'])
        skin_thickness = float(data['SkinThickness'])
        insulin = float(data['Insulin'])
        bmi = float(data['BMI'])
        dpf = float(data['DiabetesPedigreeFunction'])
        age = float(data['Age'])
        
        # Create a numpy array for the features
        features = np.array([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, dpf, age]])
        
        # Apply the same scaling used during training
        features_scaled = scaler.transform(features)
        
        # Make a prediction
        prediction_result = model.predict(features_scaled)[0]
        
        # Return the prediction as a JSON response
        return jsonify({'prediction': int(prediction_result)})
    
    except KeyError as e:
        return jsonify({'error': f'Missing feature in request: {e}'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred during prediction: {e}'}), 500

if __name__ == '__main__':
    # Run the Flask application
    app.run(debug=True)

