import UserModel from '../models/user.js';

const register = async (req, res) => {
  const {name,email,password} = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new UserModel({ name, email, password });
    console.log(newUser)
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the user', details: error });
  }
 }

 export  {
  register
 }

//  {{base_url}}