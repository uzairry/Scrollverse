// public/profile.js

// Yeh function tab chalta hai jab poora HTML page load ho jata hai
document.addEventListener('DOMContentLoaded', () => {
    
    // Pehle yeh check karein ke humein video grid mil raha hai ya nahi
    const videoGrid = document.getElementById('profile-video-grid');
    if (!videoGrid) {
        console.error("Error: Video grid element ('profile-video-grid') nahi mila.");
        return; // Agar grid na mile to aage na jayein
    }

    // Hum is profile page ko hardcode kar rahe hain "uzair.ch123" ke liye
    const creatorUsername = "uzair.ch123"; 
    
    console.log(`Fetching videos for user: ${creatorUsername}`); // <<-- YEH NAYI LINE DEBUGGING KE LIYE HAI

    // Nayi API se is creator ki videos fetch karein
    fetch(`/api/videos/by-creator/${creatorUsername}`)
        .then(response => {
            // Yeh check karein ke server ne 'OK' (200) jawab diya hai ya nahi
            if (!response.ok) {
                throw new Error(`Server ne error diya: ${response.status}`);
            }
            return response.json();
        })
        .then(videos => {
            console.log("Server se videos mil gayi hain:", videos); // <<-- YEH NAYI LINE DEBUGGING KE LIYE HAI

            // Agar creator ke paas koi video nahi hai
            if (videos.length === 0) {
                videoGrid.innerHTML = `
                    <div class="empty-grid-message" style="grid-column: 1 / -1;">
                        <div class="empty-grid-icon"><i class="fas fa-th"></i></div>
                        <h2>Upload your first video</h2>
                    </div>
                `;
            } else {
                // Agar videos mil gayi hain, to har video ke liye aek thumbnail banayein
                let thumbnailsHTML = ''; // Pehle aek khali string banayein
                videos.forEach(video => {
                    thumbnailsHTML += `
                        <div class="profile-video-thumb">
                            <img src="${video.thumbnailUrl}" alt="Video Thumbnail"> 
                            <div class="thumb-stats">
                                <i class="fas fa-play"></i> ${video.likes}
                            </div>
                        </div>
                    `;
                });
                videoGrid.innerHTML = thumbnailsHTML; // Aakhir mein poora grid aek sath add karein
            }
        })
        .catch(error => {
            console.error("User ki videos fetch karne mein bohot bara masla hua:", error);
            // Agar fetch karne mein koi error aaye to yeh message dikhayein
            videoGrid.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">Could not load videos. Please check the browser console for errors.</p>`;
        });
});