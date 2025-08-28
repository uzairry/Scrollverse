// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/videos');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve frontend files
app.use(express.static('public'));

// API: Get all videos
app.get('/api/videos', (req, res) => {
    fs.readFile('videos.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Could not read videos database." });
        }
        res.json(JSON.parse(data));
    });
});

// =========================================================
// NEW API: Get videos by a specific creator
// =========================================================
app.get('/api/videos/by-creator/:username', (req, res) => {
    const username = req.params.username; // Get username from URL

    fs.readFile('videos.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Could not read database file." });
        }
        
        const allVideos = JSON.parse(data);
        
        // Filter videos to find ones by the specific creator
        const userVideos = allVideos.filter(video => video.creator === username);
        
        res.json(userVideos); // Send back the filtered list
    });
});
// =========================================================

// Video Upload Endpoint
app.post('/api/upload', upload.single('videoFile'), (req, res) => {
    const newVideoData = {
    id: Date.now(),
    creator: req.body.creator,
    description: req.body.description,
    videoUrl: `/videos/${req.file.filename}`,
    // =========================================================
    //   NAYI LINE: HAR NAYI VIDEO KE LIYE AEK DEFAULT THUMBNAIL
    // =========================================================
    thumbnailUrl: "https://placehold.co/300x500/222/fff?text=New+Video", 
    creatorAvatarUrl: "https://placehold.co/50x50/fe2c55/white?text=U",
    likes: "0",
    comments: "0",
    saves: "0",
    shares: "0"
};

    fs.readFile('videos.json', 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: "Could not read database file." }); }
        
        const videos = JSON.parse(data);
        videos.push(newVideoData);

        fs.writeFile('videos.json', JSON.stringify(videos, null, 2), (err) => {
            if (err) { return res.status(500).json({ error: "Could not update database file." }); }
            res.redirect('/');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});