const colors = require('colors');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


//require('dotenv').config({ path: './config/config.env' });

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Calendar = require('./models/Calendar');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON file
const calendars = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/calendar.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Calendar.create(calendars);
    console.log('calendar Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Calendar.deleteMany();
    console.log('Calendar Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}