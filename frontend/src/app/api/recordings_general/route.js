// const db = require('path/to/your/database'); // Si necesitas una base de datos

//Imports de librerias
const express = require('express');
const fs = require('fs');
const path = require('path');

// Crear el servidor Express
const app = express();

// Ruta para obtener los audios
app.get('/api/recordings_general', (req, res) => {
    const folderPath = path.join(__dirname, '..', '..', 'datos_audios');  // Ruta a 'datos_audios' fuera de 'backend'
    const result = [];

    // Queremos leer todos los audios que estan dentro de la carpeta audio_data y dentro hay subcarpetas numeradas del 1 al 9
    fs.readdir(folderPath, (err, folders) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer las carpetas' });
        }

        // Filtra para asegurarse de que solo se incluyan carpetas numéricas
        folders = folders.filter(folder => !isNaN(folder));

        // Lee todos los archivos carpeta por carpta
        folders.forEach(folder => {
            const audioFolderPath = path.join(folderPath, folder);
            const audioFiles = fs.readdirSync(audioFolderPath).filter(file => file.endsWith('.mp3') || file.endsWith('.wav')); // Filtra los archivos de audio

            // Añade los archivos de audio a la respuesta
            if (audioFiles.length > 0) {
                result.push({
                    folder,
                    audios: audioFiles.map(file => ({
                        name: file,
                        path: `/datos_audios/${folder}/${file}`,  // Devuelve la URL para acceder al archivo
                    })),
                });
            }
        });

        // Responde con los datos de los audios
        res.json({ datos: result });
    });
});

// Servir archivos estáticos desde la carpeta datos_audios
app.use('/datos_audios', express.static(path.join(__dirname, '..', '..', 'datos_audios')));  // Ruta relativa a 'datos_audios'

// Puerto en el que el servidor escuchará
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
