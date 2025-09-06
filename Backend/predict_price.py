import pickle
import json
import sys
import pandas as pd
from sklearn.preprocessing import LabelEncoder

def load_model():
    """Load the trained Random Forest model"""
    try:
        with open('potato_price_model.pkl', 'rb') as f:
            model_data = pickle.load(f)
        return model_data
    except Exception as e:
        print(f"Error loading model: {e}", file=sys.stderr)
        return None

def predict_price(input_data):
    """Make price prediction using the trained model"""
    try:
        # Load model
        model_data = load_model()
        if model_data is None:
            return None
        
        model = model_data['model']
        feature_columns = model_data['feature_columns']
        season_encoder = model_data['season_encoder']
        
        # Prepare input data
        input_df = pd.DataFrame([input_data])
        
        # Encode season if present
        if 'season' in input_df.columns:
            input_df['season_encoded'] = season_encoder.transform(input_df['season'])
        
        # Ensure all required features are present
        for col in feature_columns:
            if col not in input_df.columns:
                input_df[col] = 0  # Default value
        
        # Select only the features used by the model
        X = input_df[feature_columns]
        
        # Make prediction
        prediction = model.predict(X)[0]
        
        return prediction
        
    except Exception as e:
        print(f"Error in prediction: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict_price.py <input_file>", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    try:
        # Load input data
        with open(input_file, 'r') as f:
            input_data = json.load(f)
        
        # Make prediction
        prediction = predict_price(input_data)
        
        if prediction is not None:
            print(f"{prediction:.2f}")
        else:
            print("0.00", file=sys.stderr)
            sys.exit(1)
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
