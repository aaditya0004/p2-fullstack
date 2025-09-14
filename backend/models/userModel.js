const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This is the blueprint for a user in our database.
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: false, // Not every user might provide this initially
    },
    // We can add the other fields from our design doc later.
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// This is a special function that runs BEFORE a user is saved.
// We use it to "hash" the password, which is a critical security step.
// We never store plain text passwords!
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compares entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
