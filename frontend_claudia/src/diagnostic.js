import React, {useEffect, useState} from 'react';
import {Card, Form, Button, Table, Row, Col, Modal} from 'react-bootstrap';
import moment from 'moment';

const InsertDiagForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const initialFormData = {
        id_record_diagnostic: '',
        time_executed: moment().format('YYYY-MM-DD HH:mm:ss'),
        used_model: '',
        model_version: '',
        pretreatment: '',
        created_by: '',
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
            const response = await fetch('http://127.0.0.1:8080/api/v1/diagnostics', {
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
                            <Form.Label>ID recordings:</Form.Label>
                            <Form.Control type="number" name="id_record_diagnostic" value={formData.id_record_diagnostic} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Time executed:</Form.Label>
                            <Form.Control type="text" name="time_executed" value={formData.time_executed} onChange={handleChange} placeholder="YYYY-MM-DD HH:mm:ss" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Model used:</Form.Label>
                            <Form.Control type="text" name="used_model" value={formData.used_model} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Model version:</Form.Label>
                            <Form.Control type="text" name="model_version" value={formData.model_version} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pretreatment:</Form.Label>
                            <Form.Control type="text" name="pretreatment" value={formData.pretreatment} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Created by:</Form.Label>
                            <Form.Control type="text" name="created_by" value={formData.created_by} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{ backgroundColor: '#708090' }}>Add diagnostic</Button>
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


const GetDiagnosticsRecords = () => {
    /**
     * Función que controla las siguientes acciones:
     * - Realiza una petición get inicial para mostrar todos los valores de la tabla diagnosticos, y los devuelve
     * como tabla interactiva.
     * - Realiza la petición GET para realizar el filtrado según criterio de id_diagnostics
     * - Permite realizar modificaciones en la tabla interactiva. Al confirmarlo, realiza una petición PUT que
     * actualiza la base de datos
     * - Permite la eliminación de registros. Para ello, gestiona la petición DELETE, así como obliga a la
     * confirmación mediante la creación de un modal
     */
    const [data, setData] = useState([]);
    const [create_diagnostic, setCreatediagnostic] = useState('');
    const [model_diagnostic, setModeldiagnostic] = useState('');
    const [time_diagnostic, setTimediagnostic] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [datasing, setDatasing] = useState([]);
    const [datarecord, setDatarecord] = useState([]);
    const [editableRows, setEditableRows] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);

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
            const url = 'http://127.0.0.1:8080/api/v1/diagnostics';
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
        try {
            const url = 'http://127.0.0.1:8080/api/v1/sing_events';
            const response = await fetch(url);

            if (response.ok) {
                const jsonData = await response.json();
                setDatasing(jsonData);
            } else {
                console.error('Error al obtener datos');
            }
        } catch (error) {
            console.error('Error en solicitud GET:', error);
        }
        try {
            const url = 'http://127.0.0.1:8080/api/v1/recordings';
            const response = await fetch(url);

            if (response.ok) {
                const jsonData = await response.json();
                setDatarecord(jsonData);
            } else {
                console.error('Error al obtener datos');
            }
        } catch (error) {
            console.error('Error en solicitud GET:', error);
        }
    };

    /* Peticion para el filtrado por Creador */
    const handleBuscarPorCreator = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/v1/diagnostics?created_by=${create_diagnostic}`);
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener los datos de la consulta por creador');
            }
        } catch (error) {
            console.error('Error en la solicitud GET', error);
        }
    };

    const handleBuscarPorModelo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/v1/diagnostics?used_model=${model_diagnostic}`);
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener los datos de la consulta por modelo');
            }
        } catch (error) {
            console.error('Error en la solicitud GET', error);
        }
    };

    const handleBuscarPorTiempo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/v1/diagnostics?time_executed=${time_diagnostic}`);
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

    const handleCreatorChange = (event) => {
        setCreatediagnostic(event.target.value);
    };

    const handleModelChange = (event) => {
        setModeldiagnostic(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTimediagnostic(event.target.value);
    };

    const handleSelectButtonClick = (id_diagnostic) => {
        setExpandedRows((prevExpandedRows) =>
            prevExpandedRows.includes(id_diagnostic)
                ? prevExpandedRows.filter((rowId) => rowId !== id_diagnostic)
                : [...prevExpandedRows, id_diagnostic]
        );
    };

    const handleEditButtonClick = (id_diagnostic) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_diagnostic]: true,
        }));
    };

    /* Almacena los cambios en DB mediante actualización (PUT) */
    const handleSaveButtonClick = async (id_diagnostic, updatedData) => {
        try {
            const url = `http://127.0.0.1:8080/api/v1/diagnostics/${id_diagnostic}`;
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
                    [id_diagnostic]: false,
                }));
            } else {
                console.error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT', error);
        }
    };

    /* Dispara la accion de borrado (muestra el modal) */
    const handleDeleteButtonClick = (id_diagnostic) => {
        setDeleteItemId(id_diagnostic);
        setShowDeleteConfirmation(true);
    };

    /* Realiza la petición DELETE */
    const handleDeleteConfirm = async () => {
        if (deleteItemId) {
            try {
                const url = `http://127.0.0.1:8080/api/v1/diagnostics/${deleteItemId}`;
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
    const handleCancelEdit = (id_diagnostic) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_diagnostic]: false,
        }));
    };

    return (
        <Card className="my-4">
            <Card.Header>List of Diagnostics</Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <h5>Search by creation</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Created by:</Form.Label>
                                <Form.Control type="text" value={create_diagnostic} onChange={handleCreatorChange} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorCreator} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                                Search
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <h5>Search by model</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Model used:</Form.Label>
                                <Form.Control type="text" value={model_diagnostic} onChange={handleModelChange} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorModelo} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                                Search
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <h5>Search by date</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Time:</Form.Label>
                                <Form.Control type="text" value={time_diagnostic} onChange={handleTimeChange} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorTiempo} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                                Search
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name recordings</th>
                            <th>Time executed</th>
                            <th>Used model</th>
                            <th>Model version</th>
                            <th>Pretreatment</th>
                            <th>Created by</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((object) => (
                            <React.Fragment key={object.id_diagnostic}>
                                <tr key={object.id_diagnostic}>
                                    <td>
                                        <Button
                                            variant={expandedRows.includes(object.id_diagnostic) ? 'danger' : 'success'}
                                            onClick={() => handleSelectButtonClick(object.id_diagnostic)}
                                        >
                                            {expandedRows.includes(object.id_diagnostic) ? '-' : '+'}
                                        </Button>
                                    </td>
                                    <td>
                                        {editableRows[object.id_diagnostic] ? (
                                            <Form.Control
                                                type="text"
                                                value={datarecord.map((event) => event.uri).at(object.id_record_diagnostic-1)}
                                                onChange={(e) => {}}
                                            />
                                        ) : (
                                            datarecord.map((event) => event.uri).at(object.id_record_diagnostic-1)
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_diagnostic] ? (
                                            <Form.Control
                                                type="text"
                                                value={moment(object.time_executed).format('DD/MM/YYYY HH:mm:ss')}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, time_executed: moment(e.target.value).format('DD/MM/YYYY HH:mm:ss') };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_diagnostic === object.id_diagnostic ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            moment(object.time_executed).format('DD/MM/YYYY HH:mm:ss')
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_diagnostic] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.used_model}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, used_model: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_diagnostic === object.id_diagnostic ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.used_model
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_diagnostic] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.model_version}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, model_version: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_diagnostic === object.id_diagnostic ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.model_version
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_diagnostic] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.pretreatment}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, pretreatment: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_diagnostic === object.id_diagnostic ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.pretreatment
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_diagnostic] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.created_by}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, created_by: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_diagnostic === object.id_diagnostic ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.created_by
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_diagnostic] ? (
                                            <>
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleSaveButtonClick(object.id_diagnostic, object)}
                                                >
                                                    Save
                                                </Button>{' '}
                                                <Button variant="danger" onClick={() => handleCancelEdit(object.id_diagnostic)}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleEditButtonClick(object.id_diagnostic)}
                                                    style={{backgroundColor:'#78a8b7'}}
                                                >
                                                    Edit
                                                </Button>{' '}
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteButtonClick(object.id_diagnostic)}
                                                    style = {{ backgroundColor: '#bb131f'}}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                {expandedRows.includes(object.id_diagnostic) && (
                                    datasing.filter(event => event.id_diagnostic_event === object.id_diagnostic)
                                    .map(event => (
                                        <tr key={event.id_event}>
                                            <td>{event.scientific_name_specie}</td>
                                            <td>{event.time_event}</td>
                                            <td>{event.start_event}</td>
                                            <td>{event.end_event}</td>
                                            <td>{event.overlap_event}</td>
                                            <td>{event.confidence_event}</td>
                                            <td>{event.sensitivity_event}</td>
                                            <td>{event.quality_score_manual_event}</td>
                                            <td>{event.comment}</td>
                                        </tr>
                                    ))
                                )}
                            </React.Fragment>
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


function NewDiagnostic(){

    return (
        <Row className="p-5">
            <Col className="col-2 offset-10 p-2">
                <InsertDiagForm />
            </Col>
            <Col>
                <GetDiagnosticsRecords />
            </Col>
        </Row>
    )

}

export {InsertDiagForm, GetDiagnosticsRecords, NewDiagnostic};