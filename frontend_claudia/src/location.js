import React, {useEffect, useState} from 'react';
import {Card, Form, Button, Table, Row, Col, Modal} from 'react-bootstrap';

const InsertLocForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const initialFormData = {
        name_location: '',
        latitude_location: '',
        longitude_location: '',
        habitat_location: '',
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
            const response = await fetch('http://127.0.0.1:8080/api/v1/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('¡Petición POST exitosa!');
                // Bloque para mostrar algún mensaje de confirmación
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
                            <Form.Label>Name Location:</Form.Label>
                            <Form.Control type="text" name="name_location" value={formData.name_location} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Latitude Location:</Form.Label>
                            <Form.Control type="number" name="latitude_location" value={formData.latitude_location} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Longitude Location:</Form.Label>
                            <Form.Control type="number" name="longitude_location" value={formData.longitude_location} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Habitat Location:</Form.Label>
                            <Form.Control type="text" name="habitat_location" value={formData.habitat_location} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{backgroundColor:'#007201'}}>Add location</Button>
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


const GetLocationRecords = () => {
    /**
     * Función que controla las siguientes acciones:
     * - Realiza una petición get inicial para mostrar todos los valores de la tabla locations, y los devuelve
     * como tabla interactiva.
     * - Realiza la petición GET para realizar el filtrado según criterio de id_location
     * - Permite realizar modificaciones en la tabla interactiva. Al confirmarlo, realiza una petición PUT que
     * actualiza la base de datos
     * - Permite la eliminación de registros. Para ello, gestiona la petición DELETE, así como obliga a la
     * confirmación mediante la creación de un modal
     */
    const [data, setData] = useState([]);
    const [name_location, setNameLocation] = useState('');
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
            const url = 'http://127.0.0.1:8080/api/v1/locations';
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

    /* Peticion para el filtrado por ID */
    const handleBuscarPorNombre = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/v1/locations?name_location=${name_location}`);
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener los datos de la consulta por nombre');
            }
        } catch (error) {
            console.error('Error en la solicitud GET', error);
        }
    };

    const handleIdLocationChange = (event) => {
        setNameLocation(event.target.value);
    };

    const handleSelectButtonClick = (id_location) => {
        setExpandedRows((prevExpandedRows) =>
            prevExpandedRows.includes(id_location)
                ? prevExpandedRows.filter((rowId) => rowId !== id_location)
                : [...prevExpandedRows, id_location]
        );
    };

    const handleEditButtonClick = (id_location) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_location]: true,
        }));
    };

    /* Almacena los cambios en DB mediante actualización (PUT) */
    const handleSaveButtonClick = async (id_location, updatedData) => {
        try {
            const url = `http://127.0.0.1:8080/api/v1/locations/${id_location}`;
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
                    [id_location]: false,
                }));
            } else {
                console.error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT', error);
        }
    };

    /* Dispara la accion de borrado (muestra el modal) */
    const handleDeleteButtonClick = (id_location) => {
        setDeleteItemId(id_location);
        setShowDeleteConfirmation(true);
    };

    /* Realiza la petición DELETE */
    const handleDeleteConfirm = async () => {
        if (deleteItemId) {
            try {
                const url = `http://127.0.0.1:8080/api/v1/locations/${deleteItemId}`;
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
    const handleCancelEdit = (id_location) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_location]: false,
        }));
    };

    return (
        <Card className="my-4">
            <Card.Header>List of Locations</Card.Header>
            <Card.Body>
                <h5>Search by Name</h5>
                <Form className="d-flex flex-row align-items-center">
                    <Form.Group className="mb-3">
                        <Form.Label>Name of the location:</Form.Label>
                        <Form.Control type="text" value={name_location} onChange={handleIdLocationChange} />
                    </Form.Group>
                    <Button variant="primary" onClick={handleBuscarPorNombre} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                        Search
                    </Button>
                </Form>
                <Row>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Habitat</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((object) => (
                            <React.Fragment key={object.id_location}>
                                <tr key={object.id_location}>
                                    <td>
                                        <Button
                                            variant={expandedRows.includes(object.id_recorder) ? 'danger' : 'success'}
                                            onClick={() => handleSelectButtonClick(object.id_location)}
                                        >
                                            {expandedRows.includes(object.id_recorder) ? '-' : '+'}
                                        </Button>
                                    </td>
                                    <td>
                                        {editableRows[object.id_location] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.name_location}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, name_location: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_location === object.id_location ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.name_location
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_location] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.latitude_location}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, latitude_location: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_location === object.id_location ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.latitude_location
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_location] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.longitude_location}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, longitude_location: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_location === object.id_location ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.longitude_location
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_location] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.habitat_location}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, habitat_location: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_location === object.id_location ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.habitat_location
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_location] ? (
                                            <>
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleSaveButtonClick(object.id_location, object)}
                                                >
                                                    Save
                                                </Button>{' '}
                                                <Button variant="danger" onClick={() => handleCancelEdit(object.id_location)}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleEditButtonClick(object.id_location)}
                                                    style={{backgroundColor:'#78a8b7'}}
                                                >
                                                    Edit
                                                </Button>{' '}
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteButtonClick(object.id_location)}
                                                    style = {{ backgroundColor: '#bb131f'}}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                {expandedRows.includes(object.id_location) && (
                                    <tr>
                                        <td></td>
                                        <td><iframe
                                            src={`https://maps.google.com/maps?q=&ll=${object.latitude_location},${object.longitude_location}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                                            allowFullScreen></iframe>
                                        </td>
                                    </tr>
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

function NewLocations(){

    return (
        <Row className="p-5">
            <Col className="col-2 offset-10 p-2">
                <InsertLocForm />
            </Col>
            <Col>
                <GetLocationRecords />
            </Col>
        </Row>
    )

}

export {InsertLocForm, GetLocationRecords, NewLocations};