const express = require('express');
const multer = require('multer');
const cors =require('cors'); 
const path = require('path');
const upload =multer ({dest: 'uploads/'}); 
const app = express();

const port =3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let citas = [];

app.post('/citas', upload.single('autorizacion'), (req, res) => {
  const { cc, fecha } = req.body;

  if (!cc || !fecha || !req.file) {
    return res.status(400).send('Faltan datos: cédula, fecha o autorización');
  }

  const codigo = Date.now();

  const nuevaCita = {
    codigo, 
    cc,     
    fecha,  
    autorizacion: req.file.path, 
    cancelada: false  
  };
  citas.push(nuevaCita);
  res.json({ codigo });
});


app.get('/citas', (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).send('Debe proporcionar una fecha de inicio y una fecha de fin');
  }

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);


  const citasFiltradas = citas.filter(cita => {
    const fechaCita = new Date(cita.fecha);
    return fechaCita >= inicio && fechaCita <= fin;
  });

  res.json(citasFiltradas);
});

app.delete('/citas/:codigo', (req, res) => {
  const codigo = parseInt(req.params.codigo);

  
  const cita = citas.find(c => c.codigo === codigo);

  if (cita) {
    cita.cancelada = true;  
    res.json({ message: 'Cita cancelada' });
  } else {
    res.status(404).json({ error: 'Cita no encontrada' });
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto: ${port}`);
  });
