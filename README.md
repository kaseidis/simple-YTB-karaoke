# Simple YTB Karaoke System
Welcome to our Home Karaoke System, designed to bring the joy of karaoke into your home with ease. Powered by YouTube and a simple, interactive interface, you can queue up your favorite songs, manage playlists, and sing along with family and friends. Follow the instructions below to get started.

## Requirements
- Python 3.6 or higher
- Internet connection
- YouTube API key (free)

## Setup

1. **Clone or Download the Repository**

    Begin by cloning this repository to your local machine or download it as a ZIP file and extract it.

2. **Install Dependencies**

    Navigate to the project directory where requirements.txt is located and run the following command to install the necessary Python libraries:
    ``` bash
    pip install -r requirements.txt
    ```

3. **Obtain a YouTube API Key**

    To fetch song titles from YouTube, you need a valid API key. Follow these steps to get one:

    1. Go to [Google Developers Consol](https://console.developers.google.com/)
    2. Create a new project
    3. Navigate to **Credentials** and click on **Create Credentials > API key**
    4. Enable the YouTube Data API v3 for your project
    5. Copy the API key generated

    For detailed instructions, visit [Getting Started with YouTube API](https://developers.google.com/youtube/v3/getting-started).

4. **Configure the Application**

    Open app.py with a text editor and paste your YouTube API key into the API_KEY variable:

    ```python
    API_KEY = 'YOUR_API_KEY_HERE'
    ```

5. **Run the Application**

    With the API key set, you're ready to start the server. Run the following command in your terminal:

    ```bash
    python app.py
    ```
    
    The karaoke system will now be running on your local machine at http://localhost:8081/.

## How to Use

1. **Accessing the Karaoke Interface**

    Open a web browser and go to http://localhost:8081/. You'll be greeted with the karaoke system's homepage.

2. **Connect Using a Mobile Device**

    To queue songs from your mobile device, access the QR code displayed on the top right corner of the homepage. This QR code directs to a mobile-friendly interface where you can add or manage songs.

    - The first time you play a song, you may need to interact with the video player to start playback. Subsequent songs should play automatically.

3. **Adding Songs**

    Use the mobile interface to search for and add songs to your playlist. Each song added will be queued in the system for playback.

4. **Managing the Playlist**

    The system allows you to view your current playlist, move songs up in the queue, and remove songs you no longer want to play.

Enjoy your home karaoke experience, and sing your heart out with friends and family!

## License

This project is licensed under the [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.zh-cn.html) version 3 or any later version.
