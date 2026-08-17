const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Jesu Star Restaurant Backend is Running!");
});

// ===============================
// Reservation Schema
// ===============================

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

// ===============================
// Book a Table API
// ===============================

app.post("/api/reservations", async (req, res) => {
  try {
    const { name, phone, date, time, guests } = req.body;

    const reservation = new Reservation({
      name,
      phone,
      date,
      time,
      guests,
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: "Table reserved successfully!",
      reservation,
    });
  } catch (error) {
    console.error("Reservation Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to reserve table",
    });
  }
});
// ===============================
// Get All Reservations - Admin
// ===============================

app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.error("Get Reservations Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get reservations",
    });
  }
});
// ===============================
// Contact Schema
// ===============================

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

// ===============================
// Contact Form API
// ===============================

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = new Contact({
      name,
      email,
      message,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      contact,
    });
  } catch (error) {
    console.error("Contact Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// ===============================
// Get All Contact Messages - Admin
// ===============================

app.get("/api/contact", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get messages",
    });
  }
});

// ===============================
// Order Schema
// ===============================

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

// ===============================
// Place Order API
// ===============================

app.post("/api/orders", async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = new Order({
      items,
      total,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Order Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
});
// ===============================
// Get All Orders - Admin
// ===============================

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
});

// ===============================
// MongoDB Connection
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);
  });