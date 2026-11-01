const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["Employee", "IT Staff", "Admin"],
      default: "Employee"
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location"
    }
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;