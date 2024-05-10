const express = require("express")
const mongoose =require("mongoose")
const UserRouter = require("./routes/user")

const mongoUser = process.env.DATABASE_USER;
const mongoPassword = process.env.DATABASE_PASSWORD;
const mongoHost = process.env.DATABASE_HOST;
const mongoDatabase = process.env.DATABASE_NAME;

const connectionString = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}`;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName:mongoDatabase
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

//

const app = express();

app.use("/users", UserRouter)


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Catch-all middleware for unmatched routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
/*

const { Client } = pg;

const client = new Client({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: '1234',
  port: 5432,
});
client.connect().then(() => console.log('Connected to PostgreSQL'))
.catch(err => console.error('Error connecting to PostgreSQL', err));;

const createTable = async () => { 
    await client.query(`CREATE TABLE IF NOT EXISTS users 
    (id serial PRIMARY KEY, name VARCHAR (255) UNIQUE NOT NULL, 
    email VARCHAR (255) UNIQUE NOT NULL, age INT NOT NULL);`)
  };
  
  createTable();

  const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => res.send('Hello World!'));

app.get('/api/all', async (req, res) => {
    try {
      const response = await client.query(`SELECT * FROM users`);
      
      if(response){
        res.status(200).send(response.rows);
      }
      
    } catch (error) {
      res.status(500).send('Error');
      console.log(error);
    } 
  });

  app.post('/api/form', async (req, res) => {
    try {
        const { name, email, age } = req.body;

        const queryText = 'INSERT INTO users(name, email, age) VALUES ($1, $2, $3)';
        const values = [name, email, age];

        const response = await client.query(queryText, values);
        if (response) {
            res.status(200).send(req.body);
        }
    } catch (error) {
        console.error(error); // Log the error to the console for debugging

        // Send a more informative error message in the response
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

  app.listen(3000, () => console.log(`App running on port 3000.`));*/