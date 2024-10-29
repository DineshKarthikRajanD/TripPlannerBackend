import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dbconnect from "./database/db.js"; 
import {
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
  paymentDetails,
  packageDetails,
  loginEmail,
} from './controller/control.js';

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

// Database connection
dbconnect();

// Middleware setup
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

app.use(express.json()); // For parsing application/json
app.use(bodyParser.json()); // For parsing application/json (optional if using express.json)

// API routes
app.post("/api/auth/register", registerUser);
app.post("/api/auth/login", loginUser);
app.post("/customer", coustmer_details); 
app.get("/userdata", userData);
app.get("/api/user",loginEmail);          
app.delete("/userDelete/:email", userDelete); 
app.put("/userUpdate/:email", updateData);    

app.post("/api/places", addPlace); 
app.get("/api/places", getAllPlaces); 
app.put("/api/places/:id", updatePlace); 
app.delete("/api/places/:id", deletePlace);
app.get("/api/places/search", searchPlaces); 

app.post('/api/packages', addPackage);
app.get("/api/packages", getPackagesByPlace);
app.post("/api/reviews", addReview);
app.get("/api/booked/:name", bookedcont);
app.get('/api/reviews', dispReview);
app.put('/api/packages/:id', updatePackage);
app.post("/payment", coustmer_details);
app.get("/payment",paymentDetails);
app.get("/packages",packageDetails);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
