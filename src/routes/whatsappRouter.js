const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/mensagens-recebidas', async (req, res) => {
  console.log('Requisição recebida post: ', req.body);

  const formattedJson = JSON.stringify(req.body, null, 2);
  console.log(formattedJson);
  console.log('\n');
  console.log(
    '--------------------------------------------------------------------------------------'
  );
  console.log('\n');

  const { changes } = req.body.entry[0] || [];
  console.log('changes', changes);
  const { value } = req.body.entry[0].changes[0] || [];
  // const idNumberClient = console.log("VAlue: ", value);
  const { messages, message_echoes, contacts } = value;
  let { statuses } = value;
  statuses = statuses?.map((statusmsg) => {
    let newStatus = { ...statusmsg };
    newStatus.messageId = newStatus.id;
    delete newStatus.id;
    return newStatus;
  });
  const chatId = `${value.metadata?.phone_number_id}_${
    contacts && contacts.length > 0
      ? contacts[0].wa_id
      : message_echoes && message_echoes.length > 0
      ? message_echoes[0]?.to
      : statuses && statuses.length > 0
      ? statuses[0]?.recipient_id
      : 'Id_Indefinido'
  }`;

  const chat = {
    chatId: chatId,
    messages: [
      {
        from:
          messages && messages.length > 0
            ? messages[0].from
            : message_echoes && message_echoes.length > 0
            ? message_echoes[0].from
            : 'Erro no objeto From',
        messageId:
          messages && messages.length > 0
            ? messages[0].id
            : message_echoes && message_echoes.length > 0
            ? message_echoes[0].id
            : 'Erro no Objeto messageId',
        timestamp:
          messages && messages.length > 0
            ? messages[0].timestamp
            : message_echoes && message_echoes.length > 0
            ? message_echoes[0].timestamp
            : 'Erro no Objeto timestamp',
        text:
          messages && messages.length > 0
            ? messages[0].text
            : message_echoes && message_echoes.length > 0
            ? message_echoes[0].text
            : 'text',
        type:
          messages && messages.length > 0
            ? messages[0].type
            : message_echoes && message_echoes.length > 0
            ? message_echoes[0].type
            : 'type',
        contact_name:
          contacts && contacts.length > 0
            ? contacts[0].profile?.name || 'Sem nome'
            : 'Sem Nome',
        contact_number:
          contacts && contacts.length > 0
            ? contacts[0].wa_id || 'Sem número Definido'
            : undefined,
      },
    ],
    field: changes[0].field,
  };

  const chatStatus = {
    chatId: chatId,
    statuses,
  };

  // console.log("Result:" ,result)
  if (!statuses) {
    try {
      await axios.post('http://localhost:3332/menssages', chat);
      console.log('Dados encaminhados para o servidor de destino');
      res.status(200).send('Evento recebido e encaminhado!');
    } catch (error) {
      // console.error('Erro ao encaminhar dados:', error);
      console.error('Erro ao encaminhar dados');
      res
        .status(500)
        .send({ message: 'Erro ao encaminhar dados', error: error.toString() });
    }
  } else {
    try {
      await axios.post('http://localhost:3332/statuses', chatStatus);
      console.log('Status encaminhados para o servidor de destino');
      res.status(200).send('Evento recebido e encaminhado!');
    } catch (error) {
      console.error('Erro ao encaminhar status');
      res
        .status(500)
        .send({ message: 'Erro ao encaminhar dados', error: error.toString() });
    }
  }
});

router.get('/mensagens-recebidas', (req, res) => {
  //Token de verificação criada no painel do WhatsApp
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
