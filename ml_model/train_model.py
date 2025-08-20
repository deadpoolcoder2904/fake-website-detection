import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import requests
import io
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def download_dataset():
    """Download the UCI Phishing Website dataset."""
    try:
        url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00327/Training%20Dataset.arff"
        logging.info("Downloading dataset from UCI repository...")
        
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse ARFF file
        lines = response.text.split('\n')
        data_start = 0
        columns = []
        
        # Find the start of data and column names
        for i, line in enumerate(lines):
            if line.lower().startswith('@attribute'):
                # Extract column name from @attribute line
                col_name = line.split()[1]
                columns.append(col_name)
            elif line.lower().startswith('@data'):
                data_start = i + 1
                break
        
        # Extract data
        data_lines = [line.strip() for line in lines[data_start:] if line.strip()]
        data_array = np.array([list(map(float, line.split(','))) for line in data_lines])
        
        # Create DataFrame
        df = pd.DataFrame(data_array, columns=columns)
        logging.info(f"Dataset downloaded successfully. Shape: {df.shape}")
        return df
    except Exception as e:
        logging.error(f"Error downloading dataset: {str(e)}")
        raise

def prepare_data(data):
    """Prepare the dataset for training."""
    try:
        # The last column is the target (1 for legitimate, -1 for phishing)
        X = data.iloc[:, :-1]
        y = data.iloc[:, -1]
        
        # Convert -1 to 0 for binary classification
        y = (y == 1).astype(int)
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        logging.info(f"Training set shape: {X_train.shape}")
        logging.info(f"Test set shape: {X_test.shape}")
        
        return X_train, X_test, y_train, y_test
    except Exception as e:
        logging.error(f"Error preparing data: {str(e)}")
        raise

def train_model(X_train, y_train):
    """Train the Random Forest model."""
    try:
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            min_samples_split=10,
            min_samples_leaf=5,
            random_state=42,
            n_jobs=-1
        )
        
        logging.info("Training Random Forest model...")
        model.fit(X_train, y_train)
        logging.info("Model training completed")
        
        return model
    except Exception as e:
        logging.error(f"Error training model: {str(e)}")
        raise

def evaluate_model(model, X_test, y_test):
    """Evaluate the model's performance."""
    try:
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        logging.info("\nModel Evaluation:")
        logging.info(f"Accuracy: {accuracy:.4f}")
        logging.info("\nClassification Report:")
        logging.info(classification_report(y_test, y_pred))
        
        return accuracy
    except Exception as e:
        logging.error(f"Error evaluating model: {str(e)}")
        raise

def save_model(model, accuracy):
    """Save the trained model."""
    try:
        model_filename = 'url_classifier.joblib'
        joblib.dump(model, model_filename)
        logging.info(f"Model saved as {model_filename}")
        
        # Save model metadata
        metadata = {
            'accuracy': accuracy,
            'n_features': model.n_features_in_,
            'feature_importance': model.feature_importances_.tolist()
        }
        
        with open('model_metadata.txt', 'w') as f:
            for key, value in metadata.items():
                f.write(f"{key}: {value}\n")
        
        logging.info("Model metadata saved")
    except Exception as e:
        logging.error(f"Error saving model: {str(e)}")
        raise

def main():
    try:
        # Download and prepare dataset
        data = download_dataset()
        X_train, X_test, y_train, y_test = prepare_data(data)
        
        # Train model
        model = train_model(X_train, y_train)
        
        # Evaluate model
        accuracy = evaluate_model(model, X_test, y_test)
        
        # Save model
        save_model(model, accuracy)
        
    except Exception as e:
        logging.error(f"Training pipeline failed: {str(e)}")
        raise

if __name__ == "__main__":
    main() 