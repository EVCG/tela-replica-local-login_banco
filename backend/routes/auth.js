const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Configurar o transporte do nodemailer com Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'elissonvictorc@gmail.com',
        pass: 'ursr vjns whqn itnc', // senha de app
      },
    });

    const mailOptions = {
      from: 'elissonvictorc@gmail.com',
      to: email,
      subject: 'Recuperação de Senha',
      text: `Olá ${user.nome},\n\nClique no link abaixo para redefinir sua senha:\n\nhttps://seusite.com/resetar-senha?email=${email}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ message: 'Erro ao enviar e-mail' });
  }
});

module.exports = router;
