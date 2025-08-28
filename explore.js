// public/explore.js
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.filter-btn');
    const videoGrid = document.getElementById('explore-grid');
    let allVideos = []; // Tamam videos ko yahan save kareinge

    // Server se tamam videos fetch karein
    fetch('/api/videos')
        .then(response => response.json())
        .then(videos => {
            allVideos = videos;
            displayVideos(allVideos); // Shuru mein tamam videos dikhayein
        });

    // Har category button par click ka event lagayein
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pehle tamam buttons se 'active' class hatayein
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Sirf click kiye hue button par 'active' class lagayein
            button.classList.add('active');

            const category = button.textContent; // Button ka text (jaise "Comedy") hasil karein

            if (category === 'All') {
                displayVideos(allVideos); // 'All' par tamam videos dikhayein
            } else {
                // Sirf is category ki videos ko filter karein
                const filteredVideos = allVideos.filter(video => video.category === category);
                displayVideos(filteredVideos);
            }
        });
    });

    // Yeh function videos ki list le kar unka grid banata hai
    function displayVideos(videoArray) {
        videoGrid.innerHTML = ''; // Pehle grid ko khali karein
        videoArray.forEach(video => {
            const thumb = document.createElement('div');
            thumb.className = 'video-thumbnail';
            thumb.innerHTML = `
                <img src="${video.thumbnailUrl}" alt="Video Thumbnail">
                <div class="thumbnail-overlay">
                    <div class="thumbnail-stats"><i class="fas fa-heart"></i> ${video.likes}</div>
                    <div class="thumbnail-creator">
                        <img src="${video.creatorAvatarUrl || 'https://placehold.co/30x30/fff/000?text=U'}" alt="Creator">
                    </div>
                </div>
            `;
            videoGrid.appendChild(thumb);
        });
    }
});