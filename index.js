const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000; // Choose your desired port

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Function to update leaderboard
async function updateLeaderboard(username) {
  try {
    // Fetch random score message from pastebin
    let response = await fetch('https://pastebin.com/raw/8rU0x7yk');
    let scoreData = await response.json();
    let randomScore = scoreData[Math.floor(Math.random() * scoreData.length)];

    // Update leaderboard (example: save to another pastebin)
    // Here, you would fetch current leaderboard, update it, and save back to pastebin
    // Example: updating a leaderboard pastebin
    let leaderboardResponse = await fetch('https://pastebin.com/raw/fHLEUtxX');
    let leaderboardData = await leaderboardResponse.json();
    
    // Example: Update leaderboard data with username and random score
    leaderboardData.push({ username, score: randomScore.score });

    // Example: Save updated leaderboard data back to pastebin
    await fetch('https://pastebin.com/api/your-update-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers or tokens here
      },
      body: JSON.stringify(leaderboardData),
    });

    console.log(`Leaderboard updated for ${username} with score ${randomScore.score}`);
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

// Handle POST requests to /update-leaderboard endpoint
app.post('/update-leaderboard', (req, res) => {
  // Extract username from Nightbot command payload
  const username = req.body.username;

  // Call your function to update leaderboard here
  updateLeaderboard(username);

  // Send a response back to Nightbot (optional)
  res.status(200).send('Leaderboard updated successfully');
});

// Function to fetch and display leaderboard
async function displayLeaderboard() {
  try {
    // Fetch leaderboard data from pastebin
    let response = await fetch('https://pastebin.com/raw/fHLEUtxX');
    let leaderboardData = await response.json();

    // Sort leaderboard data by score (assuming scores are numeric)
    leaderboardData.sort((a, b) => b.score - a.score);

    // Prepare leaderboard message
    let leaderboardMessage = 'Leaderboard:\n';
    for (let i = 0; i < Math.min(leaderboardData.length, 10); i++) {
      leaderboardMessage += `${i + 1}. ${leaderboardData[i].username}: ${leaderboardData[i].score}\n`;
    }

    // Output leaderboard message to console (for testing) or Twitch chat (via Twitch bot)
    console.log(leaderboardMessage);
    // For Twitch chat, you would send this message using your Twitch bot or integration

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

// Example usage (for testing)
// displayLeaderboard();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
