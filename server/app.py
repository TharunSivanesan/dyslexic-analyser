from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
import io

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_handwriting():
    # Check if the image is part of the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Process the image
        img = Image.open(io.BytesIO(file.read()))
        text = pytesseract.image_to_string(img)

        return jsonify({"extracted_text": text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)