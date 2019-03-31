import dbConnect from '../database';
import mongoose from 'mongoose';
import validator from 'validator';

let formSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => {
      return validator.isURL(value);
    }
  },
  count: Number,
  params: [],
  date: Date
})

export default mongoose.model('Medium', formSchema);