import numpy as np
from PIL import Image
import tensorflow as tf
import io
import os
import urllib.request
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the model URL from .env
MODEL_URL = os.getenv("MODEL_URL")

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "pneumonia_model.h5")

# Ensure model is downloaded
def download_model_if_needed():
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
    if not os.path.exists(MODEL_PATH):
        print("Downloading model from S3...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print("Download complete.")

download_model_if_needed()

# Load model
model = tf.keras.models.load_model(MODEL_PATH)

# Image preprocessing
def preprocess_image(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert('L')  # Grayscale
    img = img.resize((224, 224))
    img = np.array(img).reshape(1, 224, 224, 1) / 255.0
    return img

# Prediction
def predict(file_bytes):
    image = preprocess_image(file_bytes)
    prediction = model.predict(image)[0][0]
    label = "PNEUMONIA" if prediction > 0.5 else "NORMAL"
    confidence = float(prediction if prediction > 0.5 else 1 - prediction)
    return {"label": label, "confidence": round(confidence, 3)}
