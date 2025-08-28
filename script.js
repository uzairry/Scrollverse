document.addEventListener('DOMContentLoaded', () => {
    const videoFeed = document.getElementById('video-feed');

    fetch('/api/videos')
        .then(response => response.json())
        .then(videos => {
            videos.forEach(videoData => {
                const videoContainer = createVideoElement(videoData);
                videoFeed.appendChild(videoContainer);
            });
            setupVideoPlayers();
        })
        .catch(error => {
            console.error("Videos fetch karne mein masla hua:", error);
            videoFeed.innerHTML = `<p style="text-align: center; padding: 50px;">Could not load videos. Please make sure the server is running.</p>`;
        });

    function createVideoElement(data) {
        const container = document.createElement('div');
        container.className = 'video-container';

        const video = document.createElement('video');
        video.src = data.videoUrl;
        video.loop = true;
        video.playsInline = true;

        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        
        overlay.innerHTML = `
            <div class="video-details">
                <h3>${data.creator}</h3>
                <p>${data.description}</p>
            </div>
            <div class="video-actions">
                <div class="creator-profile-pic">
                    <img src="${data.creatorAvatarUrl || 'https://placehold.co/50x50/fe2c55/white?text=C'}" alt="Creator Avatar">
                    <div class="follow-plus-icon">+</div>
                </div>
                <div class="action-button" data-action="like" data-video-id="${data.id}">
                    <i class="fas fa-heart"></i>
                    <span>${data.likes}</span>
                </div>
                <div class="action-button" data-action="comment" data-video-id="${data.id}">
                    <i class="fas fa-comment-dots"></i>
                    <span>${data.comments}</span>
                </div>
                <div class="action-button" data-action="save" data-video-id="${data.id}">
                    <i class="fas fa-bookmark"></i>
                    <span>${data.saves}</span>
                </div>
                <div class="action-button" data-action="share" data-video-id="${data.id}">
                    <i class="fas fa-share"></i>
                    <span>${data.shares}</span>
                </div>
            </div>
        `;
        
        container.appendChild(video);
        container.appendChild(overlay);
        
        const likeButton = overlay.querySelector('[data-action="like"] i');
        likeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            likeButton.classList.toggle('liked');
        });

        container.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        return container;
    }

    function setupVideoPlayers() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.8
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, options);

        const videoContainers = document.querySelectorAll('.video-container');
        videoContainers.forEach(container => {
            observer.observe(container);
        });
    }
});