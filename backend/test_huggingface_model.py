
from transformers import pipeline
from PIL import Image
import os

MODEL_NAME = "dima806/ai_vs_real_image_detection"

image_path = input("Enter the full path to a JPG or PNG test image: ").strip().strip('"')

if not os.path.isfile(image_path):
    print("ERROR: Image file not found.")
else:
    try:
        image = Image.open(image_path).convert("RGB")

        print("Loading Hugging Face model...")
        detector = pipeline("image-classification", model=MODEL_NAME)

        print("Running prediction...")
        results = detector(image)

        print("\nMODEL TEST SUCCESSFUL")
        print("Predictions:", results)

    except Exception as error:
        print("\nMODEL TEST FAILED")
        print(type(error).__name__ + ":", error)
