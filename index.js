const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://Micheo_Music:Mm01015679@chatcluster.zgmlabf.mongodb.net/micheo_chat?retryWrites=true&w=majority&appName=ChatCluster')

.then(() => {
  console.log("✅ Conectado a MongoDB Atlas");
})
.catch(err => {
  console.error("❌ Error al conectar a MongoDB:", err);
});

// 📄 Modelo de mensaje
const Message = mongoose.model('Message', {
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

// 📥 Guardar mensaje
app.post('/chat-message', async (req, res) => {
  const { name, email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Correo o mensaje faltante' });
  }

  try {
    const msg = new Message({ name, email, message });
    await msg.save();
    console.log("📩 Mensaje guardado:", msg);
    res.json({ status: 'Mensaje guardado' });
  } catch (err) {
    console.error("❌ Error al guardar mensaje:", err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// 📤 Buscar mensajes por correo
app.get('/messages/:email', async (req, res) => {
  const email = req.params.email;
  if (!email) return res.status(400).json({ error: 'Correo requerido' });

  try {
    const messages = await Message.find({ email }).sort({ timestamp: 1 });
    if (!messages.length) {
      return res.status(404).json({ error: 'No se encontraron mensajes' });
    }
    res.json(messages);
  } catch (err) {
    console.error("❌ Error al buscar mensajes:", err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Servir el dashboard y archivos estáticos
app.use(express.static(path.join(__dirname)));

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
