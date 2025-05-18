const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return this.provider !== 'google'; // Only require password for non-Google users
    },
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  role: {
    type: String,
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
