var submitBtn = document.getElementById('submitLink');
submitBtn.onclick = function() {
    if (submitBtn.hasAttribute("disabled")) {
        return
    }
    submitBtn.setAttribute("disabled", "true");
    const url = document.getElementById('youtubeLink').value;
    const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
    const match = url.match(regex);
    if (match && match[6]) {
        fetch('./api/item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vid: match[6]
            }),
        }).then(response => {
            if (response.ok) {
                submitBtn.removeAttribute("disabled");
                window.alert('Added video');
                updateVideoList(); // Refresh the list if the video was added successfully
            } else {
                window.alert('Failed to add video');
            }
            document.getElementById('youtubeLink').value = "";
        });
    } else {
        submitBtn.removeAttribute("disabled");
        window.alert('Invalid YouTube link');
        document.getElementById('youtubeLink').value = "";
    }
};

function updateVideoList() {
    fetch('./api/list')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('videoListTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear current rows

            data.forEach(video => {
                let row = tableBody.insertRow();
                let titleCell = row.insertCell(0);
                let actionCell = row.insertCell(1);
                titleCell.innerHTML = video.title;

                // Delete button with Bootstrap classes
                let deleteButton = document.createElement('button');
                deleteButton.innerHTML = 'Delete';
                deleteButton.className = 'btn btn-danger btn-sm m-1'; // Bootstrap button classes
                deleteButton.onclick = function() {
                    fetch('/api/item', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            vid: video.vid
                        }),
                    }).then(() => {
                        updateVideoList(); // Refresh the list
                    });
                };
                actionCell.appendChild(deleteButton);

                // Top button with Bootstrap classes
                let topButton = document.createElement('button');
                topButton.innerHTML = 'Top';
                topButton.className = 'btn btn-success btn-sm m-1'; // Bootstrap button classes
                topButton.onclick = function() {
                    fetch('/api/item/top', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            vid: video.vid
                        }),
                    }).then(() => {
                        updateVideoList(); // Refresh the list
                    });
                };
                actionCell.appendChild(topButton);
            });
        })
        .catch(error => console.error('Error fetching video list:', error));
}
setInterval(updateVideoList, 500);