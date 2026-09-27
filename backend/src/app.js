require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Crear cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Middlewares
app.use(cors());
app.use(express.json());

// Dashboard visual para la raíz de la API (http://localhost:3000/)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clean Valle API - Dashboard</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-6 font-sans">
      <div class="max-w-2xl w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div class="flex items-center justify-between border-b border-slate-700 pb-6 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-emerald-400">Clean Valle Software API</h1>
            <p class="text-slate-400 text-sm">Servidor Backend Node.js v22 + Express en Docker</p>
          </div>
          <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
          </span>
        </div>

        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-slate-200">Endpoints Disponibles:</h2>
          
          <div class="space-y-3">
            <a href="/api/health" target="_blank" class="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition">
              <div class="flex items-center gap-3">
                <span class="bg-blue-500/20 text-blue-400 text-xs font-mono font-bold px-2 py-1 rounded">GET</span>
                <span class="font-mono text-sm text-slate-300">/api/health</span>
              </div>
              <span class="text-xs text-slate-400">Estado básico del servidor</span>
            </a>

            <a href="/api/supabase/health" target="_blank" class="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition">
              <div class="flex items-center gap-3">
                <span class="bg-blue-500/20 text-blue-400 text-xs font-mono font-bold px-2 py-1 rounded">GET</span>
                <span class="font-mono text-sm text-slate-300">/api/supabase/health</span>
              </div>
              <span class="text-xs text-emerald-400 font-medium">Prueba Supabase DB</span>
            </a>

            <a href="/api/roles" target="_blank" class="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition">
              <div class="flex items-center gap-3">
                <span class="bg-blue-500/20 text-blue-400 text-xs font-mono font-bold px-2 py-1 rounded">GET</span>
                <span class="font-mono text-sm text-slate-300">/api/roles</span>
              </div>
              <span class="text-xs text-slate-400">Consulta de Roles</span>
            </a>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
          <span>Entorno: Docker Container</span>
          <span>Red: cleanvalle_net</span>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Ruta de prueba del backend
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'cleanvalle-api'
  });
});

// Ruta de prueba de conexión con Supabase
app.get('/api/supabase/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('role_id, role_name')
      .limit(1);

    if (error) {
      console.error('Error de Supabase:', error);

      return res.status(500).json({
        status: 'error',
        message: 'No se pudo consultar Supabase'
      });
    }

    res.json({
      status: 'ok',
      service: 'cleanvalle-api',
      supabase: 'connected',
      data
    });

  } catch (error) {
    console.error('Error inesperado:', error);

    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

app.get('/api/roles', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('role_id, role_name');

    if (error) {
      console.error('Error obteniendo roles:', error);

      return res.status(500).json({
        status: 'error',
        message: 'No se pudieron obtener los roles'
      });
    }

    res.json(data);

  } catch (error) {
    console.error('Error inesperado:', error);

    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Clean Valle API ejecutándose en http://localhost:${PORT}`);
});