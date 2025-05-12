const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  whatsapp: String,
  empresa: String,
  cnpj: String,
  senha: String,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
