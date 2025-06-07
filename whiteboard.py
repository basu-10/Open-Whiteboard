# app.py
from flask import Flask, render_template, request, jsonify
import os
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024  # 4MB limit

# Create upload directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    return render_template('whiteboard.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            return jsonify({'error': 'Invalid file type. Only images allowed'}), 400

        filename = f"{uuid.uuid4().hex}{os.path.splitext(file.filename)[1]}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Return relative URL for better compatibility
        return jsonify({'url': f'static/uploads/{filename}'}), 200
    
    except Exception as e:
        app.logger.error(f"Image upload error: {str(e)}")
        return jsonify({'error': 'Server error processing image'}), 500

if __name__ == '__main__':
    app.run(debug=True)