// src/app/general/recordings_general/page.js

'use client';

//Imports de librerias
import { useState, useEffect } from "react";
import { Card, Form, Button, Table, Row, Col, Modal } from 'react-bootstrap';
import moment from "moment";
//import SpectrogramPlayer from "react-audio-spectrogram-player";
import { decode } from "wav-decoder";
import { useDropzone } from "react-dropzone";

//Imports de componentes

function RecordingsGeneral() {
    const [grabaciones, setGrabaciones] = useState(null);
    const [mensaje, setMensaje] = useState('');

    // Petición al backend cuando el componente se monta
    useEffect(() => {
        const cargarAudios = async () => {
            try {
                const response = await fetch('/api/recordings_general', { method: "GET" });
                const data = await response.json();
                setGrabaciones(data.datos || []);
            } catch (error) {
                console.error("Error al cargar las grabaciones:", error);
                setMensaje("Error al cargar las grabaciones"); // Aquí establecemos el mensaje de error
            }
        };
        cargarAudios();
    }, []); // El array vacío asegura que la petición se haga solo una vez cuando el componente se monte

    return (
        <div id="cliente">
            <h1>Bienvenido a la página de grabaciones</h1>
            {mensaje && <div>Error: {mensaje}</div>} {/* Muestra el mensaje de error si existe */}
            {grabaciones ? (
                <div>
                    <h2>Datos recibidos:</h2>
                    <pre>{JSON.stringify(grabaciones, null, 2)}</pre> {/* Muestra los datos de grabaciones */}
                </div>
            ) : (
                <div>Cargando...</div> // Muestra "Cargando..." mientras se cargan los datos
            )}
        </div>
    );
}

export default RecordingsGeneral;
