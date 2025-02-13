import React, {useEffect, useState} from 'react';
import {Card, Form, Button, Table, Row, Col, Modal} from 'react-bootstrap';

const InsertSpecForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const initialFormData = {
        scientific_name: '',
        spanish_name: '',
        english_name: '',
        short_name: '',
        family: '',
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
            const response = await fetch('http://127.0.0.1:5000/api/v1/species', {
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
                            <Form.Label>Scientific Name:</Form.Label>
                            <Form.Control type="text" name="scientific_name" value={formData.scientific_name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Spanish Name:</Form.Label>
                            <Form.Control type="text" name="spanish_name" value={formData.spanish_name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>English name:</Form.Label>
                            <Form.Control type="text" name="english_name" value={formData.english_name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Short Name:</Form.Label>
                            <Form.Control type="text" name="short_name" value={formData.short_name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Family:</Form.Label>
                            <Form.Control type="text" name="family" value={formData.family} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{ backgroundColor: '#708090' }}>Add specie</Button>
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


const GetSpeciesRecords = () => {
    /**
     * Función que controla las siguientes acciones:
     * - Realiza una petición get inicial para mostrar todos los valores de la tabla especie, y los devuelve
     * como tabla interactiva.
     * - Realiza la petición GET para realizar el filtrado según criterio de id_specie
     * - Permite realizar modificaciones en la tabla interactiva. Al confirmarlo, realiza una petición PUT que
     * actualiza la base de datos
     * - Permite la eliminación de registros. Para ello, gestiona la petición DELETE, así como obliga a la
     * confirmación mediante la creación de un modal
     */
    const [data, setData] = useState([]);
    const [name_specie, setNameSpecie] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
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
            const url = 'http://127.0.0.1:5000/api/v1/species';
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
            const response = await fetch(`http://127.0.0.1:5000/api/v1/species?scientific_name=${name_specie}`);
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

    const handleNameChange = (event) => {
        setNameSpecie(event.target.value);
    };


    const handleEditButtonClick = (id_specie) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_specie]: true,
        }));
    };

    /* Almacena los cambios en DB mediante actualización (PUT) */
    const handleSaveButtonClick = async (id_specie, updatedData) => {
        try {
            const url = `http://127.0.0.1:5000/api/v1/species/${id_specie}`;
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
                    [id_specie]: false,
                }));
            } else {
                console.error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT', error);
        }
    };

    /* Dispara la accion de borrado (muestra el modal) */
    const handleDeleteButtonClick = (id_specie) => {
        setDeleteItemId(id_specie);
        setShowDeleteConfirmation(true);
    };

    /* Realiza la petición DELETE */
    const handleDeleteConfirm = async () => {
        if (deleteItemId) {
            try {
                const url = `http://127.0.0.1:5000/api/v1/species/${deleteItemId}`;
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
    const handleCancelEdit = (id_specie) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_specie]: false,
        }));
    };

    return (
        <Card className="my-4">
            <Card.Header>List of Species</Card.Header>
            <Card.Body>
                <Row>
                    <h5>Search by name</h5>
                    <Form className="d-flex flex-row align-items-center">
                        <Form.Group className="mb-3">
                            <Form.Label>Scientific name:</Form.Label>
                            <Form.Control type="text" value={name_specie} onChange={handleNameChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleBuscarPorNombre} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                            Search
                        </Button>
                    </Form>
                </Row>
                <Row>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Scientific Name</th>
                            <th>Spanish Name</th>
                            <th>English Name</th>
                            <th>Short Name</th>
                            <th>Family</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((object) => (
                            <tr key={object.id_specie}>
                                <td>
                                    {editableRows[object.id_specie] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.scientific_name}
                                            onChange={(e) => {
                                                const updatedData = { ...object, scientific_name: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_specie === object.id_specie ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.scientific_name
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_specie] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.spanish_name}
                                            onChange={(e) => {
                                                const updatedData = { ...object, spanish_name: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_specie === object.id_specie ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.spanish_name
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_specie] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.english_name}
                                            onChange={(e) => {
                                                const updatedData = { ...object, english_name: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_specie === object.id_specie ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.english_name
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_specie] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.short_name}
                                            onChange={(e) => {
                                                const updatedData = { ...object, short_name: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_specie === object.id_specie ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.short_name
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_specie] ? (
                                        <Form.Control
                                            type="text"
                                            value={object.family}
                                            onChange={(e) => {
                                                const updatedData = { ...object, family: e.target.value };
                                                setData((prevData) =>
                                                    prevData.map((item) => (item.id_specie === object.id_specie ? updatedData : item))
                                                );
                                            }}
                                        />
                                    ) : (
                                        object.family
                                    )}
                                </td>
                                <td>
                                    {editableRows[object.id_specie] ? (
                                        <>
                                            <Button
                                                variant="success"
                                                onClick={() => handleSaveButtonClick(object.id_specie, object)}
                                            >
                                                Save
                                            </Button>{' '}
                                            <Button variant="danger" onClick={() => handleCancelEdit(object.id_specie)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleEditButtonClick(object.id_specie)}
                                                style={{backgroundColor:'#78a8b7'}}
                                            >
                                                Edit
                                            </Button>{' '}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteButtonClick(object.id_specie)}
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


function NewSpecies(){

    return (
        <Row className="p-5">
            <Col className="col-2 offset-10 p-2">
                <InsertSpecForm />
            </Col>
            <Col>
                <GetSpeciesRecords />
            </Col>
        </Row>
    )

}

export {InsertSpecForm, GetSpeciesRecords, NewSpecies};