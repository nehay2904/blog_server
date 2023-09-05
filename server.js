// importing the requirements

const express = require('express')
const app = express()
app.use(express.json())



const mongoose = require("mongoose")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const cors = require('cors');
const postModel = require('./post');
const userModel = require('./user');
const authorModel = require('./author')


app.use(cors())

require('dotenv').config();


 // routes/auth.js
const jwt = require('jsonwebtoken');


const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

//connection of mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('connection is success')
}).catch((err) => {
  console.log(err)
})

// post
app.get("/read-post", async (req, res) => {
  try {
    const donor = await postModel.find({});
    res.send(donor);
    console.log(donor);

  } catch (err) {
    console.log(err);
  }
});


app.post('/create-post', async (req, res) => {

  const { title, content, imageUrl } = req.body;
  const newUser = new postModel({ title, content, imageUrl });
  newUser.save()
  console.log(req.body)


});

app.post('/user_login', async (req, res) => {
  const { username, password } = req.body;

  const old_user = await userModel.findOne({ username: username, password: password });
  // Perform your own authentication logic here

  try {
    if (old_user) {
      res.status(200).json({ message: "you are logged in" });


    } else {
      res.status(401).json({ error: 'invalid username and password' });
    }
    ;


  } catch (error) {
    res.status(401).json({ error });
  }
});


app.post('/user_register', async (req, res) => {
  try {
    const { username, email, password, hint, mobile_no , hint_option} = req.body;

    // Check if the user already exists

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    // Create a new user
    const newUser = new userModel({
      username,
      email,
      password,
      hint,
      mobile_no,
      hint_option
    });

    // Save the user to the database
    await newUser.save();


    const old_user = postModel.find()
    const token = jwt.sign({ userId: old_user.id }, "secretKey", { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/profile', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
  }
  jwt.verify(token, 'your-secret-key', async (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Token verification failed' });
      }
      const user = await userModel.findOne({ email: decoded.email });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      const userProfile = {
          username: user.username,
          email: user.email
      };
      res.json(userProfile);
  });
});

app.put('/user_update', async (req, res) => {
  const { username, email, password, hint, mobile_no, hint_option } = req.body;

  try {
    // Find the old user based on a unique identifier (e.g., email)
    const old_user = await userModel.findOne({ email: email });

    if (!old_user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's information
    const updatedUser = await userModel.findByIdAndUpdate(
      old_user._id,
      { username, email, password, hint, mobile_no,  hint_option },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


app.delete('/user_delete', async (req, res) => {
  const { email } = req.body; // We only need the email to identify the user

  try {
    // Find the user based on the provided email
    const userToDelete = await userModel.findOne({ email: email });

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    const deletedUser = await userModel.findByIdAndDelete(userToDelete._id);

    res.json(deletedUser);
    console.log("sucessfully deleted user")
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// author


app.post('/create_author', async (req, res) => {
  try {
    const { author_name , bio, profile_photo } = req.body;

    // Check if the author already exists

    const existingUser = await authorModel.findOne({ author_name });
    if (existingUser) {
      return res.status(400).json({ message: 'author already exists' });
    }


    // Create a new user
    const newUser = new authorModel({
      author_name,
      bio,
      profile_photo
    });

    // Save the user to the database
    await newUser.save();


    const old_user = authorModel.find()
    const token = jwt.sign({ userId: old_user.id }, "secretKey", { expiresIn: '1h' });
    res.status(201).json({ message: 'author registered successfully', token });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/read_author", async (req, res) => {
  try {
    const user = await authorModel.find({});
    res.send(user);
    console.log(user);

  } catch (err) {
    console.log(err);
  }
});


app.put('/author_update', async (req, res) => {
  const { author_name , bio, profile_photo } = req.body;

  try {
    // Find the old user based on a unique identifier (e.g., email)
    const old_author = await userModel.findOne({ email: email });

    if (!old_author) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's information
    const updatedauthor = await userModel.findByIdAndUpdate(
      old_user._id,
      { author_name , bio, profile_photo },
      { new: true }
    );

    res.json(updatedauthor);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


app.delete('/author_delete', async (req, res) => {
  const { email } = req.body; // We only need the email to identify the user

  try {
    // Find the user based on the provided email
    const authorToDelete = await authorModel.findOne({ email: email });

    if (!authorToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    const deletedauthor = await authorModel.findByIdAndDelete(authorToDelete._id);

    res.json(deletedauthor);
    console.log("sucessfully deleted user")
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});




app.get('/', (req, res) => {
  res.send("hello world")
})


app.listen(PORT, (req, res) => {
  console.log(`server is responding on ${PORT}`)
})