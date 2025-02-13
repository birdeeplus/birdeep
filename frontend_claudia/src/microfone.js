import React, {useEffect, useState} from 'react';
import {Card, Form, Button, Table, Row, Col, Modal} from 'react-bootstrap';

const InsertMicForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const initialFormData = {
        name_microphone:'',
        model_microphone: '',
        comment_microphone: '',
    }
    const [formData, setFormData] = useState({initialFormData});
    const [insertData, setInsertData] = useState(false);

    /* Maneja el cambio de valores a la hora de enviar */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleButtonClick = () => {
        setInsertData(true);
    }

    const handleDeleteCancel = () => {
        setInsertData(false);
        setFormData(initialFormData);
    };

    /* Maneja la petición post */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/v1/microphones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('¡Petición POST exitosa!');
                setInsertData(false);
                setFormData(initialFormData);
            } else {
                console.error('Error en la petición POST');
            }
        } catch (error) {
            console.error('Error en la petición POST:', error);
        }
    };

    return (
        <Card>
            <Button type="submit" variant="primary" style={{backgroundColor:'#007201'}} onClick={() => handleButtonClick()}>Insert data</Button>
            <Modal show={insertData} onHide={handleDeleteCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Insert new data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name Microphone:</Form.Label>
                            <Form.Control type="text" name="name_microphone" value={formData.name_microphone} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Model Microphone:</Form.Label>
                            <Form.Control type="text" name="model_microphone" value={formData.model_microphone} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment:</Form.Label>
                            <Form.Control as="textarea" name="comment_microphone" value={formData.comment_microphone} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{backgroundColor:'#007201'}}>Add microphone</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel} style = {{ backgroundColor: '#bb131f'}}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};


const GetMicrophoneRecords = () => {
    /**
     * Función que controla las siguientes acciones:
     * - Realiza una petición get inicial para mostrar todos los valores de la tabla microfonos, y los devuelve
     * como tabla interactiva.
     * - Realiza la petición GET para realizar el filtrado según criterio de nombre
     * - Permite realizar modificaciones en la tabla interactiva. Al confirmarlo, realiza una petición PUT que
     * actualiza la base de datos
     * - Permite la eliminación de registros. Para ello, gestiona la petición DELETE, así como obliga a la
     * confirmación mediante la creación de un modal
     */
    const [data, setData] = useState([]);
    const [name_microphone, setNameMicrophone] = useState('');
    const [editableRows, setEditableRows] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    /* Lanza función para realizar la primera carga en base de datos */
    useEffect(() => {
        fetchData().then(response =>{
            console.log('Acceso correcto a la base de datos')
        }).catch(error => {
            console.error("Error en la peticion")
        })
    }, []);

    /* Peticion para la adquisición de todos los valores */
    const fetchData = async () => {
        try {
            const url = 'http://127.0.0.1:5000/api/v1/microphones';
            const response = await fetch(url);

            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener datos');
            }
        } catch (error) {
            console.error('Error en solicitud GET:', error);
        }
    };

    /* Peticion para el filtrado por nombre */
    const handleBuscarPorNombre = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/microphones?name_microphone=${name_microphone}`);
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener los datos de la consulta por id');
            }
        } catch (error) {
            console.error('Error en la solicitud GET', error);
        }
    };

    const handleIdMicrophoneChange = (event) => {
        setNameMicrophone(event.target.value);
    };

    const handleEditButtonClick = (id_microphone) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_microphone]: true,
        }));
    };

    /* Almacena los cambios en DB mediante actualización (PUT) */
    const handleSaveButtonClick = async (id_microphone, updatedData) => {
        try {
            const url = `http://127.0.0.1:5000/api/v1/microphones/${id_microphone}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                fetchData();
                setEditableRows((prevEditableRows) => ({
                    ...prevEditableRows,
                    [id_microphone]: false,
                }));
            } else {
                console.error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT', error);
        }
    };

    /* Dispara la accion de borrado (muestra el modal) */
    const handleDeleteButtonClick = (id_microphone) => {
        setDeleteItemId(id_microphone);
        setShowDeleteConfirmation(true);
    };

    /* Realiza la petición DELETE */
    const handleDeleteConfirm = async () => {
        if (deleteItemId) {
            try {
                const url = `http://127.0.0.1:5000/api/v1/microphones/${deleteItemId}`;
                const response = await fetch(url, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fetchData();
                } else {
                    console.error('Error al eliminar la fila');
                }
            } catch (error) {
                console.error('Error en la solicitud DELETE', error);
            }
        }

        setDeleteItemId(null);
        setShowDeleteConfirmation(false);
    };

    /* Oculta el modal y define el item a borrar como 0 */
    const handleDeleteCancel = () => {
        setDeleteItemId(null);
        setShowDeleteConfirmation(false);
    };

    /* Devuelve el valor anterior en caso de no querer editar más */
    const handleCancelEdit = (id_microphone) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_microphone]: false,
        }));
    };

    return (
        <Card>
            <Card.Header>List of Microphones</Card.Header>
            <Card.Body>
                <h5>Search by Name</h5>
                <Form className="d-flex flex-row align-items-center">
                    <Form.Group className="mb-3">
                        <Form.Label>Name of the microphone:</Form.Label>
                        <Form.Control type="text" value={name_microphone} onChange={handleIdMicrophoneChange} />
                    </Form.Group>
                    <Button variant="primary" onClick={handleBuscarPorNombre} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                        Search
                    </Button>
                </Form>
                <Row>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Model</th>
                            <th>Comment</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((object) => (
                            <tr key={object.id_microphone}>
                                <td>
                                    {editableRows[object.id_microphone] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.name_microphone}
                                            onChange={(e) => {
                                                const updatedData = { ...object, name_microphone: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_microphone === object.id_microphone ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.name_microphone
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_microphone] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.model_microphone}
                                            onChange={(e) => {
                                                const updatedData = { ...object, model_microphone: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_microphone === object.id_microphone ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.model_microphone
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_microphone] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.comment_microphone}
                                            onChange={(e) => {
                                                const updatedData = { ...object, comment_microphone: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_microphone === object.id_microphone ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.comment_microphone
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_microphone] ? (
                                        <>
                                            <Button
                                                variant="success"
                                                onClick={() => handleSaveButtonClick(object.id_microphone, object)}
                                            >
                                                Save
                                            </Button>{' '}
                                            <Button variant="danger" onClick={() => handleCancelEdit(object.id_microphone)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleEditButtonClick(object.id_microphone)}
                                                style={{backgroundColor:'#78a8b7'}}
                                            >
                                                Edit
                                            </Button>{' '}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteButtonClick(object.id_microphone)}
                                                style = {{ backgroundColor: '#bb131f'}}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Row>

                {/* Modal de confirmación para eliminar */}
                <Modal show={showDeleteConfirmation} onHide={handleDeleteCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Are you shure you want to delete this element?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeleteCancel}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
};


function NewMicrophones(){

    return (
        <Row className="p-5">
            <Col className="col-2 offset-10 p-2">
                <InsertMicForm />
            </Col>
            <Col>
                <GetMicrophoneRecords />
            </Col>
        </Row>
    )

}

export {InsertMicForm, GetMicrophoneRecords, NewMicrophones};