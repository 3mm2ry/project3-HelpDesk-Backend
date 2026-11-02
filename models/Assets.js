const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Laptop",
        "Desktop",
        "Monitor",
        "Printer",
        "Projector",
        "Tablet",
        "Phone",
        "Accessory",
        "Other",
      ],
    },
    serialNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Available", "Borrowed", "Under Maintenance", "Retired"],
      default: "Available",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    borrowDate: {
      type: Date,
    },
    expectedReturnDate: {
      type: Date,
    },
    borrowStatus: {
      type: String,
      enum: ["Available", "Pending", "Borrowed"],
      default: "Available",
    },
  },
  { timestamps: true },
);

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
