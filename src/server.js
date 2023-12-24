const dotenv = require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3333;
const whatsappRouter = require('./routes/whatsappRouter');

app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulários
// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/whatsapp', whatsappRouter);

// Iniciar o servidor
app.listen(PORT, () => {
//    console.log(`Servidor rodando na porta ${PORT}`);
});