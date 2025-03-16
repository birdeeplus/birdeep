import React, { useState} from 'react';
import {Card, Row, Form, Button, Modal} from 'react-bootstrap';

const FileUploader = () => {
    const [formData, setFormData] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const handleFileChange = (e) => {
        const files = e.target.files;
        for (let i=0; i < files.length; i++) {
            if (files[i].type.match('text/plain')) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target.result;
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        [file.name]: content,
                    }));
                };

                reader.readAsText(file);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowConfirmation(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/upload_singevent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('¡Petición POST exitosa!');
                setShowConfirmation(true);
            } else {
                console.error('Error en la petición POST');
            }
        } catch (error) {
            console.error('Error en la petición POST:', error);
        }
    };

    return (
        <Card className="mx-auto my-5" style={{ maxWidth: '1000px' }}>
            <Card.Header>Insert New Folder</Card.Header>
            <Card.Body>
                <Row>
                    <h3>Insert a folder containing .txt with the following structure</h3>
                    <p>Each .txt has to have it's name structured like this: modelname_date_time.WAV.txt</p>
                    <p>Inside the .txt, the columns have to be the following:</p>
                    <p>Selection	View	Channel	Begin Time (s)	End Time (s)	Low Freq (Hz)	High Freq (Hz)	species</p>
                    <p>Here is an example of how the lines have to look:</p>
                    <p>1	1	1	5.091901	6.06548	2860.721436	5582.413907	galerida theklae</p>
                </Row>
                <Row>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <input type="file" webkitdirectory="true" directory="" onChange={handleFileChange}/>
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{ backgroundColor: '#007201' }}>Upload labels</Button>
                    </Form>
                </Row>
                <Modal show={showConfirmation} onHide={handleDeleteCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your files have been uploaded correctly</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeleteCancel}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
};

export {FileUploader};
