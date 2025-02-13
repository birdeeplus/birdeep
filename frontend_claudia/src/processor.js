import React, {useEffect, useState} from 'react';
import {Card, Form, Button, Table, Row, Col, Modal} from 'react-bootstrap';

const InsertProcForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const initialFormData = {
        name_processor:'',
        model_processor: '',
        comment_processor: '',
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
            const response = await fetch('http://127.0.0.1:5000/api/v1/processors', {
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
            <Button type="submit" variant="primary" style={{ backgroundColor: '#007201' }} onClick={() => handleButtonClick()}>Insert data</Button>
            <Modal show={insertData} onHide={handleDeleteCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Insert new data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name Processor:</Form.Label>
                            <Form.Control type="text" name="name_processor" value={formData.name_processor} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Model Processor:</Form.Label>
                            <Form.Control type="text" name="model_processor" value={formData.model_processor} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment:</Form.Label>
                            <Form.Control as="textarea" name="comment_processor" value={formData.comment_processor} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{ backgroundColor: '#007201' }}>Add processor</Button>
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


const GetProcessorRecords = () => {
    /**
     * Función que controla las siguientes acciones:
     * - Realiza una petición get inicial para mostrar todos los valores de la tabla procesadores, y los devuelve
     * como tabla interactiva.
     * - Realiza la petición GET para realizar el filtrado según criterio de id_processor
     * - Permite realizar modificaciones en la tabla interactiva. Al confirmarlo, realiza una petición PUT que
     * actualiza la base de datos
     * - Permite la eliminación de registros. Para ello, gestiona la petición DELETE, así como obliga a la
     * confirmación mediante la creación de un modal
     */
    const [data, setData] = useState([]);
    const [name_processor, setNameProcessor] = useState('');
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
            const url = 'http://127.0.0.1:5000/api/v1/processors';
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

    /* Peticion para el filtrado por Nombre */
    const handleBuscarPorNombre = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/processors?name_processor=${name_processor}`);
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

    const handleIdProcessorChange = (event) => {
        setNameProcessor(event.target.value);
    };

    const handleEditButtonClick = (id_processor) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_processor]: true,
        }));
    };

    /* Almacena los cambios en DB mediante actualización (PUT) */
    const handleSaveButtonClick = async (id_processor, updatedData) => {
        try {
            const url = `http://127.0.0.1:5000/api/v1/processors/${id_processor}`;
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
                    [id_processor]: false,
                }));
            } else {
                console.error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT', error);
        }
    };

    /* Dispara la accion de borrado (muestra el modal) */
    const handleDeleteButtonClick = (id_processor) => {
        setDeleteItemId(id_processor);
        setShowDeleteConfirmation(true);
    };

    /* Realiza la petición DELETE */
    const handleDeleteConfirm = async () => {
        if (deleteItemId) {
            try {
                const url = `http://127.0.0.1:5000/api/v1/processors/${deleteItemId}`;
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
    const handleCancelEdit = (id_processor) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_processor]: false,
        }));
    };

    return (
        <Card className="my-4">
            <Card.Header>List of Processors</Card.Header>
            <Card.Body>
                <h5>Search by Name</h5>
                <Form className="d-flex flex-row align-items-center">
                    <Form.Group className="mb-3">
                        <Form.Label>Name of the processor:</Form.Label>
                        <Form.Control type="text" value={name_processor} onChange={handleIdProcessorChange} />
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
                            <tr key={object.id_processor}>
                                <td>
                                    {editableRows[object.id_processor] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.name_processor}
                                            onChange={(e) => {
                                                const updatedData = { ...object, name_processor: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_processor === object.id_processor ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.name_processor
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_processor] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.model_processor}
                                            onChange={(e) => {
                                                const updatedData = { ...object, model_processor: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_processor === object.id_processor ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.model_processor
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_processor] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.comment_processor}
                                            onChange={(e) => {
                                                const updatedData = { ...object, comment_processor: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_processor === object.id_processor ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.comment_processor
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_processor] ? (
                                        <>
                                            <Button
                                                variant="success"
                                                onClick={() => handleSaveButtonClick(object.id_processor, object)}
                                            >
                                                Save
                                            </Button>{' '}
                                            <Button variant="danger" onClick={() => handleCancelEdit(object.id_processor)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleEditButtonClick(object.id_processor)}
                                                style={{backgroundColor:'#78a8b7'}}
                                            >
                                                Edit
                                            </Button>{' '}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteButtonClick(object.id_processor)}
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


function NewProcessors(){

    return (
        <Row className="p-5">
            <Col className="col-2 offset-10 p-2">
                <InsertProcForm />
            </Col>
            <Col>
                <GetProcessorRecords />
            </Col>
        </Row>
    )

}

export {InsertProcForm, GetProcessorRecords, NewProcessors};