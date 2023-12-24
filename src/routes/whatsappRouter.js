const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/mensagens-recebidas', async (req, res) => {
  console.log('Requisição recebida post: ', req.body);

  const formattedJson = JSON.stringify(req.body, null, 2);
  console.log(formattedJson);

  try {
    await axios.post('http://localhost:3332/mensagens-recebidas-data', req.body);
    console.log('Dados encaminhados para o servidor de destino');
    res.status(200).send('Evento recebido e encaminhado!');
  } catch (error) {
    // console.error('Erro ao encaminhar dados:', error);
    console.error('Erro ao encaminhar dados');
    res.status(500).send('Erro ao encaminhar dados');
  }
});

router.get('/mensagens-recebidas', (req, res) => {
  const VERIFY_TOKEN = 'meutoken';

  console.log('Requisição recebida get:', req.body);
  
  // Parse dos parâmetros de query enviados pela verificação do webhook
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  
  // Checa se o token e o modo estão corretos
  if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          // Responde com o challenge 'hub.challenge' enviado pelo WhatsApp
          res.status(200).send(challenge);
      } else {
          // Responde com '403 Forbidden' se os tokens não batem
          res.sendStatus(403);
      }
  }
});

// Página Inicial
router.get('/', (req, res) => {
  // Renderize sua página inicial aqui
  res.send('Página Inicial');
});


module.exports = router;