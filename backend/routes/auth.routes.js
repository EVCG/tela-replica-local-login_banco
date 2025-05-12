const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, empresa, whatsapp, cnpj } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new User({
      nome,
      email,
      senha: hashedPassword,
      empresa,
      whatsapp,
      cnpj,
    });

    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ message: 'Senha incorreta' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

module.exports = router;
