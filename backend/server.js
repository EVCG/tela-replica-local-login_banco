const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🟢 Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Schema e modelo de usuário
const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  whatsapp: String,
  empresa: String,
  cnpj: String,
  senha: String,
});

const User = mongoose.model('User', userSchema);

// Rota de registro
app.post('/api/admin/auth/register', async (req, res) => {
  try {
    const { nome, email, whatsapp, empresa, cnpj, senha } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new User({
      nome,
      email,
      whatsapp,
      empresa,
      cnpj,
      senha: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    return res.status(500).json({ message: 'Erro interno ao registrar' });
  }
});

// Rota de login
app.post('/api/admin/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }

    return res.status(200).json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    return res.status(500).json({ message: 'Erro interno ao fazer login' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
