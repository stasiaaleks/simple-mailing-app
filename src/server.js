require('dotenv').config();

const express = require('express');
const path = require('path');
const CONFIG = require('./constants/config');
const { connectDB } = require('./db/config');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const TemplateService = require('./services/templateService');

const app = express();
const PORT = CONFIG.PORT;

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    const templateCount = await new TemplateService().loadDefaultTemplates();
    console.log(`Loaded ${templateCount} email templates`);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
