const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Serve the mock JSON payload
app.get('/api/layout', (req, res) => {
  const dataPath = path.join(__dirname, '..', 'mockData.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read payload' });
    }
    res.json(JSON.parse(data));
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Export the app for testing
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
