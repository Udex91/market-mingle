const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {objectId} = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      default: "+234", // Default country code for Nigeria
      match: [
        /^\+?[1-9]\d{1,14}$/, // Regex for valid international phone numbers
        "Please provide a valid phone number",
      ],
    },
    address: {
      type: String,
      required: false, // Optional field
    },
    photo: {
      type: String, // URL to the photo
      default: "https://via.placeholder.com/150", // Placeholder for default photo
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Encrypt password before saving to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
