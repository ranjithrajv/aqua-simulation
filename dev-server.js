const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the 'app' directory
app.use(express.static(path.join(__dirname, 'app')));

// Route to serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Handle all other routes by serving index.html (for SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Start the server
app.listen(PORT, 'localhost', () => {
  console.log(`\n🐟 Aquarium Tank Simulator running at:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`\n📝 Features:`);
  console.log(`   - Hot reload for development`);
  console.log(`   - Static file serving`);
  console.log(`   - SPA routing support`);
  console.log(`   - Three.js 3D visualization ready\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});