/*para funcionar o SEEDERDOGS tenho que seguir alguns passos:
  caso não denha data alguma (no caso de um seederUsers -d), preciso primeiro usar o SeederUsers;
  na sequencia preciso substituir os ids falsos pelos que estão no Mongodb.
  só então conse
*/
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Dog = require('./models/Dog');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON file
const dogs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/dogs.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Dog.create(dogs);
    console.log('Dogs Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Dog.deleteMany();
    console.log('Dogs Destroyed...'.red.inverse);
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