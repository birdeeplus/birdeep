import React, {useEffect, useState} from 'react';
import {Card, Form, Button, Table, Row, Col, Modal} from 'react-bootstrap';
import moment from "moment";

const InsertEventForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const initialFormData = {
        id_diagnostic_event: '',
        scientific_name_specie: '',
        time_event: moment().format('YYYY-MM-DD HH:mm:ss'),
        start_event: '',
        end_event: '',
        overlap_event: '',
        confidence_event: '',
        sensitivity_event: '',
        quality_score_manual_event: '',
        comment:'',
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
            const response = await fetch('http://127.0.0.1:5000/api/v1/sing_events', {
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
                            <Form.Label>ID Diagnostic:</Form.Label>
                            <Form.Control type="number" name="id_diagnostic_event" value={formData.id_diagnostic_event} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name specie:</Form.Label>
                            <Form.Control type="string" name="id_specie_event" value={formData.scientific_name_specie} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Time:</Form.Label>
                            <Form.Control type="text" name="time_event" value={formData.time_event} onChange={handleChange} required placeholder="YYYY-MM-DD HH:mm:ss"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Start:</Form.Label>
                            <Form.Control type="number" name="start_event" value={formData.start_event} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>End:</Form.Label>
                            <Form.Control type="number" name="end_event" value={formData.end_event} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Overlap:</Form.Label>
                            <Form.Control type="text" name="overlap_event" value={formData.overlap_event} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confidence:</Form.Label>
                            <Form.Control type="number" name="confidence_event" value={formData.confidence_event} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sensitivity:</Form.Label>
                            <Form.Control type="number" name="sensitivity_event" value={formData.sensitivity_event} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sensitivity:</Form.Label>
                            <Form.Control type="number" name="quality_score_manual_event" value={formData.quality_score_manual_event} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment:</Form.Label>
                            <Form.Control type="text" name="comment" value={formData.comment} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{ backgroundColor: '#708090' }}>Add sing event</Button>
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


const GetEventsRecords = () => {
    /**
     * Función que controla las siguientes acciones:
     * - Realiza una petición get inicial para mostrar todos los valores de la tabla eventos de canto, y los devuelve
     * como tabla interactiva.
     * - Realiza la petición GET para realizar el filtrado según criterio de id_event
     * - Permite realizar modificaciones en la tabla interactiva. Al confirmarlo, realiza una petición PUT que
     * actualiza la base de datos
     * - Permite la eliminación de registros. Para ello, gestiona la petición DELETE, así como obliga a la
     * confirmación mediante la creación de un modal
     */
    const [data, setData] = useState([]);
    const [time_event, setTime_event] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [name_specie, setName_specie] = useState('');
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
            const url = 'http://127.0.0.1:5000/api/v1/sing_events';
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

    /* Peticion para el filtrado por especie */
    const handleBuscarPorEspecie = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/sing_events?scientific_name_specie=${name_specie}`);
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener los datos de la consulta por especie');
            }
        } catch (error) {
            console.error('Error en la solicitud GET', error);
        }
    };

    const handleNameSpecieChange = (event) => {
        setName_specie(event.target.value);
    };

    /* Peticion para el filtrado por tiempo */
    const handleBuscarPorTiempo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/sing_events?time_event=${time_event}`);
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener los datos de la consulta por tiempo');
            }
        } catch (error) {
            console.error('Error en la solicitud GET', error);
        }
    };

    const handleTimeChange = (event) => {
        setTime_event(event.target.value);
    };


    const handleEditButtonClick = (id_event) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_event]: true,
        }));
    };

    /* Almacena los cambios en DB mediante actualización (PUT) */
    const handleSaveButtonClick = async (id_event, updatedData) => {
        try {
            const url = `http://127.0.0.1:5000/api/v1/sing_events/${id_event}`;
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
                    [id_event]: false,
                }));
            } else {
                console.error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT', error);
        }
    };

    /* Dispara la accion de borrado (muestra el modal) */
    const handleDeleteButtonClick = (id_event) => {
        setDeleteItemId(id_event);
        setShowDeleteConfirmation(true);
    };

    /* Realiza la petición DELETE */
    const handleDeleteConfirm = async () => {
        if (deleteItemId) {
            try {
                const url = `http://127.0.0.1:5000/api/v1/sing_events/${deleteItemId}`;
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
    const handleCancelEdit = (id_event) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_event]: false,
        }));
    };

    return (
        <Card className="my-4">
            <Card.Header>List of Events</Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <h5>Search by specie</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Name of specie:</Form.Label>
                                <Form.Control type="text" value={name_specie} onChange={handleNameSpecieChange} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorEspecie}style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                                Search
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <h5>Search by time</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Time:</Form.Label>
                                <Form.Control type="text" value={time_event} onChange={handleTimeChange} placeholder="YYYY-MM-DD HH:mm:ss" />
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorTiempo}style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                                Search
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Name specie</th>
                            <th>Time</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Overlap</th>
                            <th>Confidence</th>
                            <th>Sensitivity</th>
                            <th>Quality score manual</th>
                            <th>Comment</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((object) => (
                            <tr key={object.id_event}>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.scientific_name_specie}
                                            onChange={(e) => {
                                                const updatedData = { ...object, scientific_name_specie: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.scientific_name_specie
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="text"
                                            value={moment(object.time_event).format('DD/MM/YYYY HH:mm:ss')}
                                            onChange={(e) => {
                                                const updatedData = { ...object, time_event: moment(e.target.value).format('DD/MM/YYYY HH:mm:ss') };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        moment(object.time_event).format('DD/MM/YYYY HH:mm:ss')
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="number"
                                            value={object.start_event}
                                            onChange={(e) => {
                                                const updatedData = { ...object, start_event: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.start_event
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="number"
                                            value={object.end_event}
                                            onChange={(e) => {
                                                const updatedData = { ...object, end_event: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.end_event
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.overlap_event}
                                            onChange={(e) => {
                                                const updatedData = { ...object, overlap_event: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.overlap_event
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="number"
                                            value={object.confidence_event}
                                            onChange={(e) => {
                                                const updatedData = { ...object, confidence_event: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.confidence_event
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="number"
                                            value={object.sensitivity_event}
                                            onChange={(e) => {
                                                const updatedData = { ...object, sensitivity_event: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.sensitivity_event
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="number"
                                            value={object.quality_score_manual_event}
                                            onChange={(e) => {
                                                const updatedData = { ...object, quality_score_manual_event: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.quality_score_manual_event
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.comment}
                                            onChange={(e) => {
                                                const updatedData = { ...object, comment: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_event === object.id_event ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.comment
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_event] ? (
                                        <>
                                            <Button
                                                variant="success"
                                                onClick={() => handleSaveButtonClick(object.id_event, object)}
                                            >
                                                Save
                                            </Button>{' '}
                                            <Button variant="danger" onClick={() => handleCancelEdit(object.id_event)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleEditButtonClick(object.id_event)}
                                                style={{backgroundColor:'#78a8b7'}}
                                            >
                                                Edit
                                            </Button>{' '}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteButtonClick(object.id_event)}
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


function NewEvent(){

    return (
        <Row className="p-5">
            <Col className="col-2 offset-10 p-2">
                <InsertEventForm />
            </Col>
            <Col>
                <GetEventsRecords />
            </Col>
        </Row>
    )

}

export {InsertEventForm, GetEventsRecords, NewEvent};