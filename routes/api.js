const express = require('express');
const axios = require('axios');
require('dotenv').config();
const router = express.Router();
const cors = require('cors');

const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;


if (!API_URL || !API_TOKEN) {
  throw new Error('API_URL ou API_TOKEN não definidos no .env');
}

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  .split(',')
  .map(o => o.trim());

router.use((req, res, next) => {
  console.log('ORIGIN RECEBIDO:', req.headers.origin);
  next();
});

router.use(cors({
  origin: (origin, callback) => {

    try {
      const { hostname } = new URL(origin);

      if (ALLOWED_ORIGINS.includes(hostname)) {
        return callback(null, true);
      }
    } catch (err) {
      return callback(new Error('Invalid Origin'), false);
    }

    return callback(new Error('Origin not allowed'), false);
  }
}));




router.get('/equipamentos', async (req, res) => {
  try {
    const response = await axios.get(
      `${API_URL}/equipamentos/`,
      {
        headers: {
          Authorization: `Token ${API_TOKEN}`
        }
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});


router.get('/tiposEquipamento', async (req, res) => {
  try {
    const response = await axios.get(
      `${API_URL}/tiposEquipamento/`,
      {
        headers: {
          Authorization: `Token ${API_TOKEN}`
        }
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});


router.get('/marcasEquipamento', async (req, res) => {
  try {
    const response = await axios.get(
      `${API_URL}/marcasEquipamento/`,
      {
        headers: {
          Authorization: `Token ${API_TOKEN}`
        }
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});


router.post('/generate-pdf', async (req, res) => {
  try {
    const response = await axios.post(
      `${API_URL}/generate-pdf/`,
      req.body,
      {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Token ${API_TOKEN}`
        }
      }
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="simulacao.pdf"',
      'Content-Length': response.data.length
    });

    res.send(response.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});


function handleAxiosError(err, res) {
  if (err.response) {
    return res
      .status(err.response.status)
      .json(err.response.data);
  }

  console.error(err);
  res.status(500).json({ error: 'Proxy error' });
}

module.exports = router;
