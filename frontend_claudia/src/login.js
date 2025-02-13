import React, { useState} from 'react';
import {Card, Form, Button, Row, Col} from 'react-bootstrap';

const InsertLoginForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    /* Maneja el cambio de valores a la hora de enviar */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    /* Maneja la petición post */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('¡Petición POST exitosa!');
                // Bloque para mostrar algún mensaje de confirmación
            } else {
                console.error('Error en la petición POST');
            }
        } catch (error) {
            console.error('Error en la petición POST:', error);
        }
    };

    return (
        <Card className="my-4">
            <Card.Header>Insertar Nuevo usuario</Card.Header>
            <Card.Body>
                <Col md={12}>
                    <Row>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuario:</Form.Label>
                                <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña:</Form.Label>
                                <Form.Control type="text" name="password" value={formData.password} onChange={handleChange} required />
                            </Form.Group>
                            <Button type="submit" variant="primary">Enviar</Button>
                        </Form>
                    </Row>
                </Col>
            </Card.Body>
        </Card>
    );
};

function NewUser(){

    return (
        <Row className="mt-4 align-items-start">
            <Col md={6}>
                <InsertLoginForm />
            </Col>
        </Row>
    )

}

export {InsertLoginForm, NewUser};