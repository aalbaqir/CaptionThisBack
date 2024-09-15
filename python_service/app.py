from flask import Flask, request, jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import os

app = Flask(__name__)

# Define the upload folder path
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load the model and processor from Hugging Face
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def generate_caption(file_path):
    """
    Generate a caption for the given image file.
    """
    try:
        app.logger.info(f"Opening image file: {file_path}")
        image = Image.open(file_path)

        app.logger.info(f"Image format: {image.format}, Image size: {image.size}")
        app.logger.info("Processing the image for caption generation")

        inputs = processor(image, return_tensors="pt")

        # Generate caption with sampling to add variability
        app.logger.info("Generating caption using the model")
        out = model.generate(**inputs, do_sample=True, temperature=0.7, top_k=50)

        # Decode the generated caption
        app.logger.info("Decoding the generated caption")
        caption = processor.decode(out[0], skip_special_tokens=True)

        app.logger.info(f"Generated caption: {caption}")
        return caption
    except Exception as e:
        app.logger.error(f"Error generating caption: {str(e)}")
        raise

@app.route('/generate_caption', methods=['POST'])
def generate_caption_route():
    """
    Handle POST requests to /generate_caption, process the image, and generate a caption.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save the file to the uploads folder
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        # Log the file save operation
        app.logger.info(f"File saved at: {file_path}")

        # Generate the caption
        caption = generate_caption(file_path)

        return jsonify({'caption': caption})
    except Exception as e:
        app.logger.error(f"Error processing file: {str(e)}")
        return jsonify({'error': 'Failed to generate caption'}), 500

if __name__ == '__main__':
    # Enable debug mode for detailed error logs
    app.run(host='localhost', port=5000, debug=True)
