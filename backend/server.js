const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const authRoutes = require('./routes/auth');
const User = require('./models/User'); // modelo importado corretamente

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/admin/auth', authRoutes); // rotas externas

// MongoDB
mongoose.connect('mongodb://localhost:27017/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🟢 Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elissonvictorc@gmail.com',
    pass: 'ursr vjns whqn itnc', // 🔒 Atenção: nunca compartilhe isso publicamente!
  },
});

// Registro
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

// Login
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

// Recuperação de senha
app.post('/api/admin/auth/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await transporter.sendMail({
      from: '"Vigia System" <elissonvictorc@gmail.com>',
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <h2>Recuperação de Senha</h2>
        <p>Olá, ${user.nome},</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <a href="http://localhost:5173/reset-password?email=${encodeURIComponent(email)}" style="display: inline-block; padding: 10px 20px; background-color: #2e7d32; color: white; text-decoration: none; border-radius: 4px;">
          Redefinir Senha
        </a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    });

    return res.status(200).json({ message: 'E-mail enviado com sucesso' });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    return res.status(500).json({ message: 'Erro ao enviar e-mail' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
