const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FavoritesSchema = new Schema({
    userId: {
    type: 'String',
    ref: 'User',
    required: true,
    path: '_id'
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  }
  
});

module.exports = mongoose.model('Favorite', FavoritesSchema);