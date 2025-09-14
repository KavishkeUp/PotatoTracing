import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import json
import os

def train_random_forest_model():
    """
    Train a Random Forest model for potato price prediction
    """
    print("🌱 Starting Random Forest model training...")
    
    # Load training data
    try:
        # First try to load from Excel file
        if os.path.exists('training_data.xlsx'):
            df = pd.read_excel('training_data.xlsx')
            print(f"📊 Loaded {len(df)} records from training_data.xlsx")
        else:
            print("❌ training_data.xlsx not found. Please run extract-training-data.js first.")
            return None
    except Exception as e:
        print(f"❌ Error loading training data: {e}")
        return None
    
    # Check if we have enough data
    if len(df) < 10:
        print("❌ Not enough training data. Need at least 10 records.")
        return None
    
    # Prepare features and target
    feature_columns = [
        'harvestMonth', 'daysFromHarvestToCollection', 'daysFromCollectionToDistribution',
        'daysFromDistributionToSupermarket', 'totalDaysInSupplyChain', 'harvestQuantity',
        'collectionQuantity', 'distributionQuantity', 'supermarketQuantity',
        'collectionLossPercent', 'distributionLossPercent', 'supermarketLossPercent',
        'origin', 'marketLocation', 'chemicalsUsed', 'collectionStorageConditions',
        'distributionStorageConditions', 'collectionTemperature', 'distributionTemperature',
        'promotions', 'labels'
    ]
    
    # Handle season encoding
    season_encoder = LabelEncoder()
    df['season_encoded'] = season_encoder.fit_transform(df['season'])
    feature_columns.append('season_encoded')
    
    # Remove any records with missing values
    df_clean = df.dropna(subset=feature_columns + ['price'])
    
    if len(df_clean) < 10:
        print("❌ Not enough clean training data after removing missing values.")
        return None
    
    print(f"📊 Using {len(df_clean)} clean records for training")
    
    # Prepare X and y
    X = df_clean[feature_columns]
    y = df_clean['price']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"📊 Training set: {len(X_train)} records")
    print(f"📊 Test set: {len(X_test)} records")
    
    # Train Random Forest model
    print("🌲 Training Random Forest model...")
    
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    rf_model.fit(X_train, y_train)
    
    # Make predictions
    y_pred_train = rf_model.predict(X_train)
    y_pred_test = rf_model.predict(X_test)
    
    # Calculate metrics
    train_mae = mean_absolute_error(y_train, y_pred_train)
    test_mae = mean_absolute_error(y_test, y_pred_test)
    train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    
    print("\n📈 Model Performance:")
    print(f"Training MAE: LKR {train_mae:.2f}")
    print(f"Test MAE: LKR {test_mae:.2f}")
    print(f"Training RMSE: LKR {train_rmse:.2f}")
    print(f"Test RMSE: LKR {test_rmse:.2f}")
    print(f"Training R²: {train_r2:.3f}")
    print(f"Test R²: {test_r2:.3f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🔍 Top 10 Most Important Features:")
    for i, row in feature_importance.head(10).iterrows():
        print(f"  {row['feature']}: {row['importance']:.3f}")
    
    # Save the model
    model_data = {
        'model': rf_model,
        'feature_columns': feature_columns,
        'season_encoder': season_encoder,
        'training_stats': {
            'total_records': len(df),
            'clean_records': len(df_clean),
            'train_records': len(X_train),
            'test_records': len(X_test),
            'train_mae': train_mae,
            'test_mae': test_mae,
            'train_rmse': train_rmse,
            'test_rmse': test_rmse,
            'train_r2': train_r2,
            'test_r2': test_r2
        }
    }
    
    # Save as pickle file
    with open('potato_price_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print(f"\n💾 Model saved as: potato_price_model.pkl")
    
    # Save model info as JSON for reference
    model_info = {
        'model_type': 'RandomForestRegressor',
        'feature_columns': feature_columns,
        'training_stats': model_data['training_stats'],
        'feature_importance': feature_importance.to_dict('records')
    }
    
    with open('model_info.json', 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print(f"📄 Model info saved as: model_info.json")
    
    # Test prediction with sample data
    print("\n🧪 Testing model with sample prediction...")
    sample_data = X_test.iloc[0:1]
    sample_prediction = rf_model.predict(sample_data)[0]
    actual_price = y_test.iloc[0]
    
    print(f"Sample prediction: LKR {sample_prediction:.2f}")
    print(f"Actual price: LKR {actual_price:.2f}")
    print(f"Difference: LKR {abs(sample_prediction - actual_price):.2f}")
    
    return model_data

if __name__ == "__main__":
    train_random_forest_model()
