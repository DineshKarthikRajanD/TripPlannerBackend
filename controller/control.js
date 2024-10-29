import user from "../model/coustmermodel.js";
import User from "../model/loginmodel.js";
import Place from "../model/placeModel.js"; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Package from "../model/packageModel.js";
import Review from "../model/reviewmodel.js";
import mongoose from "mongoose";
import PayModel from '../model/payModel.js';
import { validatePay } from '../schema/paymentSchema.js';
import UserModel from '../model/userModel.js';
import { validateUser } from '../schema/userSchema.js';
import { validateCustomer } from "../schema/customerSchema.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check for required fields
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    // Save the new user
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from the header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token is missing." });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Unauthorized: Invalid token." });

    req.user = user; // Save user information from token to request
    next(); // Call next middleware or route handler
  });
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const name = user.name;

    // Generate a token
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });
    res.json({ message: "Login successful", token, name });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const loginEmail = async (req, res) => {
  try {
    // Check if req.user exists and has the id property
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    }

    const user = await User.findById(req.user._id).select('email'); // Only select the email field
    if (!user) {
      return res.status(404).json({ message: 'User not found.' }); // Not found
    }

    res.status(200).json({ email: user.email }); // Success
  } catch (error) {
    console.error('Error fetching user email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const coustmer_details = async (req, res) => {
  try {
    // Destructure and validate input data
    const { name, mobile, email, packageTitle, paymentId, amount } = req.body;

    // Basic input validation (you can use Joi for comprehensive validation)
    if (!name || !mobile || !email || !packageTitle || !paymentId || !amount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new payment entry
    const newPayment = new PayModel({
      name,
      mobile,
      email,
      packageTitle,
      paymentId,
      amount,
    });

    // Save to the database
    await newPayment.save();

    // Respond with success
    res.status(201).json({ message: "Payment details saved successfully!" });
  } catch (error) {
    // Log error details for debugging
    console.error("Error saving payment details:", error);
    res.status(500).json({ message: "Failed to save payment details." });
  }
};

const userData = async (req, res) => {
  try {
    const data = await UserModel.find({});
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

const userDelete = async (req, res) => {
  const email = req.params.email;
  try {
    const result = await UserModel.findOneAndDelete({ email });
    if (result) {
      res.status(200).send("Deleted Successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
};

const updateData = async (req, res) => {
  const email = req.params.email;
  const { name, mobile } = req.body;
  try {
    const result = await UserModel.findOneAndUpdate({ email }, { name, mobile }, { new: true });
    if (result) {
      res.status(200).send("Updated Successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
};

const addPlace = async (req, res) => {
  try {
    const { name, coordinates } = req.body;
    const newPlace = new Place({
      name,
      location: {
        type: "Point",
        coordinates,
      },
    });

    await newPlace.save();
    res.status(201).json({ message: "Place added successfully", newPlace });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

const updatePlace = async (req, res) => {
  const { id } = req.params;
  const { name, coordinates } = req.body;

  try {
    const updatedPlace = await Place.findByIdAndUpdate(
      id,
      {
        name,
        location: {
          type: "Point",
          coordinates,
        },
      },
      { new: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place updated successfully", updatedPlace });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

const deletePlace = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlace = await Place.findByIdAndDelete(id);
    if (!deletedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

const searchPlaces = async (req, res) => {
  const { query } = req.query; 
  try {
    const results = await Place.find({ name: new RegExp(query, 'i') });
    res.json(results);
  } catch (error) {
    console.error("Error searching places:", error);
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

const addPackage = async (req, res) => {
  const packages = req.body;
  if (!Array.isArray(packages) || packages.length === 0) {
    return res.status(400).json({ error: "Request body must be a non-empty array of packages" });
  }
  for (const pkg of packages) {
    const { title, price, duration, features, place, location, imageUrl } = pkg;

    if (!title || !price || !duration || !features || !place || !location || !location.latitude || !location.longitude || !imageUrl) {
      return res.status(400).json({ error: "All fields are required for each package" });
    }
  }

  try {
    const newPackages = await Package.insertMany(packages);
    res.status(201).json({ message: "Packages added successfully", newPackages });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};


const getPackagesByPlace = async (req, res) => {
  const { place } = req.query; // Use req.query to extract the place from query parameters
  try {
    // Find all packages matching the place
    const packages = await Package.find({ place: { $regex: new RegExp(`^${place}$`, 'i') } });

    if (packages.length === 0) {
      return res.status(404).json({ message: "No packages found for this place." });
    }

    // Return all found packages
    res.json(packages); // Return the array of packages found for the place
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};


const addReview = async (req, res) => {
  const { userId, placeId, rating, comment } = req.body;

  if (!userId || !placeId || typeof rating !== "number" || !comment) {
    return res.status(400).json({ message: "All fields are required." });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    const newReview = new Review({
      userId,
      placeId,
      rating,
      comment,
      createdAt: new Date(),
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error); 
    res.status(500).json({ message: "Failed to add review. Please try again." });
  }
}

const dispReview = async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId'); 
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error retrieving reviews:", error); 
    res.status(500).json({ message: "Failed to retrieve reviews. Please try again." });
  }
}


const bookedcont = async (req, res) => {
  try {
    console.log(req.params.name);
    
    const customerData = await PayModel.find({ name: req.params.name });
    const packageData = await Package.find();

    const packageMap = packageData.reduce((map, pkg) => {
      map[pkg.title] = pkg;
      return map;
    }, {});

    const bookedPackages = customerData.map(customer => {
      const matchedPackage = packageMap[customer.packageTitle];
      return matchedPackage ? { customer, packageDetails: matchedPackage } : null;
    }).filter(pkg => pkg !== null); 

    res.json(bookedPackages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

const updatePackage = async (req, res) => {
  const { id } = req.params; // This should be the _id of the package
  const updateData = req.body; // This contains the data to update

  // Validate the ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const packageId = new mongoose.Types.ObjectId(id);

    const updatedPackage = await Package.findByIdAndUpdate(packageId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(updatedPackage);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

const savePayment = async (req, res) => {
  const { error } = validatePay(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
      const paymentDetails = req.body;
      const savedPayment = await PayModel.create(paymentDetails);
      res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error occurred:", err.message);
      console.error('Error saving payment details:', error);
      res.status(500).json({ message: "Failed to save payment details." });
  }
};


const saveCustomer = async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const customerDetails = req.body;
        const savedCustomer = await coustmer_details.create(customerDetails);
        res.status(201).json(savedCustomer);
    } catch (error) {
        console.error('Error saving customer details:', error);
        res.status(500).json({ message: "Failed to save customer details." });
    }
};

const createUser = async (req, res) => {
  try {
      const { error } = validateUser(req.body); // Validate input data
      if (error) {
          console.error("Validation error:", error.details[0].message); // Log the validation error
          return res.status(400).send(error.details[0].message);
      }

      // Create a new user instance from the validated data
      const user = new UserModel({
          username: req.body.username,
          password: req.body.password, // Consider hashing the password here
      });

      await user.save();
      // Respond with the created user, excluding sensitive information
      res.status(201).send({
          id: user._id,
          username: user.username,
          createdAt: user.createdAt,
      });
  } catch (err) {
      console.error("Error saving user details:", err); // Log the error
      res.status(500).send("Error saving user details");
  }
};

const paymentDetails = async(req,res) => {
  try{
    const payments = await PayModel.find(); 
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment data", error });
  }
}

const packageDetails = async(req,res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
}

export { 
  registerUser, 
  loginUser, 
  coustmer_details, 
  userData, 
  userDelete, 
  updateData, 
  addPlace, 
  getAllPlaces, 
  updatePlace, 
  deletePlace,
  searchPlaces,
  addPackage,
  getPackagesByPlace,
  addReview,
  bookedcont,
  dispReview,
  updatePackage,
  savePayment,
  saveCustomer,
  createUser,
  paymentDetails,
  packageDetails,
  loginEmail,
};
