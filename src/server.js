const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});