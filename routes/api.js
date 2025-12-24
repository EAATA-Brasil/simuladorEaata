const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;
const INTERNAL_TOKEN = process.env.X_INTERNAL_TOKEN;

if (!API_URL || !API_TOKEN || !INTERNAL_TOKEN) {
  throw new Error('Variáveis obrigatórias não definidas no .env');
}

/**
 * 🔐 BLOQUEIO TOTAL: só o NGINX pode acessar
 */
router.use((req, res, next) => {
  if (req.headers['x-internal-token'] !== INTERNAL_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

/**
 * ===== ROTAS =====
 */
router.get('/equipamentos', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/equipamentos/`, {
      headers: { Authorization: `Token ${API_TOKEN}` }
    });
    res.json(response.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

router.get('/tiposEquipamento', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/tiposEquipamento/`, {
      headers: { Authorization: `Token ${API_TOKEN}` }
    });
    res.json(response.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

router.get('/marcasEquipamento', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/marcasEquipamento/`, {
      headers: { Authorization: `Token ${API_TOKEN}` }
    });
    res.json(response.data);
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
        headers: { Authorization: `Token ${API_TOKEN}` }
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
    return res.status(err.response.status).json(err.response.data);
  }
  console.error(err);
  res.status(500).json({ error: 'Proxy error' });
}

module.exports = router;
