from bottle import Bottle, request, response, run, static_file, default_app
import threading
import requests
import json
import socket
import qrcode
from io import BytesIO

# Initialize the Bottle app
app = Bottle()

# Initialize a thread lock
lock = threading.Lock()

# In-memory list to store the videos
videos = []

# YouTube API Key placeholder
API_KEY = ''

PORT = 8081

# Determine local IP address
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # connect() doesn't send packets with UDP, so this is safe
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

def get_video_title(vid):
    # This function would actually make a request to the YouTube API to get the video title
    response = requests.get(f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={vid}&key={API_KEY}")
    try:
        video_info = response.json()
        return video_info['items'][0]['snippet']['title']
    except:
        return "No Title Got"

@app.get('/api/client_qr')
def client_qr_code():
    # Generate URL with local IP and port
    local_ip = get_local_ip()
    url = f"http://{local_ip}:{PORT}/client"

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save the QR code to a bytes buffer
    bytes_buffer = BytesIO()
    img.save(bytes_buffer, format="PNG")
    bytes_buffer.seek(0)
    
    # Set the proper content type
    response.content_type = 'image/png'
    # Return the image
    return bytes_buffer.getvalue()

@app.get('/')
def serve_homepage():
    return static_file('index.htm', root='./static')


@app.get('/client')
def serve_homepage():
    return static_file('client.htm', root='./static')

@app.post('/api/item/top')
def move_item_to_top():
    try:
        data = request.json
        vid = data.get('vid')
        if not vid:
            response.status = 400
            return {"error": "Missing vid in request"}

        with lock:
            # Find the item in the list
            item = next((item for item in videos if item['vid'] == vid), None)
            if item:
                # Remove the item from its current position
                videos.remove(item)
                # Insert the item at the beginning of the list
                videos.insert(0, item)
                return {"message": "Video moved to the top successfully"}
            else:
                response.status = 404
                return {"error": "Video not found"}
    except Exception as e:
        response.status = 500
        return {"error": str(e)}

@app.post('/api/item')
def add_item():
    try:
        data = request.json
        vid = data.get('vid')
        if not vid:
            response.status = 400
            return {"error": "Missing vid in request"}
        
        title = get_video_title(vid)
        
        with lock:
            videos.append({'title': title, 'vid': vid})
        
        return {"message": "Video added successfully"}
    except Exception as e:
        response.status = 500
        return {"error": str(e)}

@app.get('/api/item')
def get_item():
    with lock:
        if videos:
            return videos.pop(0)
        else:
            response.status = 404
            return {"error": "No videos available"}

@app.delete('/api/item')
def delete_item():
    try:
        data = request.json
        vid = data.get('vid')
        if not vid:
            response.status = 400
            return {"error": "Missing vid in request"}
        
        with lock:
            global videos
            videos = [video for video in videos if video['vid'] != vid]
        
        return {"message": "Video deleted successfully"}
    except Exception as e:
        response.status = 500
        return {"error": str(e)}

@app.get('/api/list')
def list_items():
    with lock:
        return json.dumps(videos)

application = default_app()

# Run the Bottle web server
if __name__ == '__main__':
    #run(app, host='0.0.0.0', port=PORT, debug=True, reloader=True)
    run(app, host='0.0.0.0', port=PORT)
