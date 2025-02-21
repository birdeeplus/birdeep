import React, {useEffect, useState} from 'react';
import {Card, Form, Button, Table, Row, Col, Modal} from 'react-bootstrap';
import moment from "moment";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import markerIcon from './icono.png';
import L from 'leaflet';

const InsertRecorderForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const initialFormData = {
        recorder_name:'',
        id_location_recorder: '',
        id_microphone_recorder: '',
        id_processor_recorder: '',
        status:moment().format('YYYY-MM-DD HH:mm:ss'),
        installation_date: moment().format('YYYY-MM-DD HH:mm:ss'),
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
            const response = await fetch('http://127.0.0.1:8080/api/v1/recorders', {
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
                            <Form.Label>Name of recorder:</Form.Label>
                            <Form.Control type="text" name="recorder_name" value={formData.recorder_name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ID Microphone:</Form.Label>
                            <Form.Control type="number" name="id_microphone_recorder" value={formData.id_microphone_recorder} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ID Location:</Form.Label>
                            <Form.Control type="number" name="id_location_recorder" value={formData.id_location_recorder} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ID Processor:</Form.Label>
                            <Form.Control type="number" name="id_processor_recorder" value={formData.id_processor_recorder} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status:</Form.Label>
                            <Form.Control type="text" name="status" value={formData.status} onChange={handleChange} placeholder="YYYY-MM-DD HH:mm:ss" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Instalation date:</Form.Label>
                            <Form.Control type="text" name="installation_date" value={formData.installation_date} onChange={handleChange} placeholder="YYYY-MM-DD HH:mm:ss" required />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{ backgroundColor: '#007201' }}>Add recorder</Button>
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


const GetRecorderRecords = () => {
    /**
     * Función que controla las siguientes acciones:
     * - Realiza una petición get inicial para mostrar todos los valores de la tabla grabadoras, y los devuelve
     * como tabla interactiva.
     * - Realiza la petición GET para realizar el filtrado según criterio de id_recorder
     * - Permite realizar modificaciones en la tabla interactiva. Al confirmarlo, realiza una petición PUT que
     * actualiza la base de datos
     * - Permite la eliminación de registros. Para ello, gestiona la petición DELETE, así como obliga a la
     * confirmación mediante la creación de un modal
     */
    const [data, setData] = useState([]);
    const [dataproc, setDataproc] = useState([]);
    const [datamic, setDatamic] = useState([]);
    const [dataloc, setDataloc] = useState([]);
    const [name_recorder, setNameRecorder] = useState('');
    const [name_location, setNameLocation] = useState('');
    const [editableRows, setEditableRows] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [status, setStatus] = useState('');
    const [idProc, setIdProc] = useState(0);
    const [idMic, setIdMic] = useState(0);
    const [idLoc, setIdLoc] = useState(0);
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
            const url = 'http://127.0.0.1:8080/api/v1/recorders';
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
        try{
            const url = 'http://127.0.0.1:8080/api/v1/processors';
            const response = await fetch(url);

            if (response.ok) {
                const jsonData = await response.json();
                setDataproc(jsonData);
            } else {
                console.error('Error al obtener datos de procesador');
            }
        }catch(error){
            console.error('Error en solicitud GET de procesador:', error);
        }
        try{
            const url = 'http://127.0.0.1:8080/api/v1/microphones';
            const response = await fetch(url);

            if (response.ok) {
                const jsonData = await response.json();
                setDatamic(jsonData);
            } else {
                console.error('Error al obtener datos del microfono');
            }
        }catch(error){
            console.error('Error en solicitud GET del microfono:', error);
        }
        try{
            const url = 'http://127.0.0.1:8080/api/v1/locations';
            const response = await fetch(url);

            if (response.ok) {
                const jsonData = await response.json();
                setDataloc(jsonData);
            } else {
                console.error('Error al obtener datos de la localizacion');
            }
        }catch(error){
            console.error('Error en solicitud GET de la localizacion:', error);
        }
    };

    const handleBuscarPorNombreGrabadora = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/v1/recorders?recorder_name=${name_recorder}`);
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            } else {
                console.error('Error al obtener los datos de la consulta por nombre de grabadora');
            }
        } catch (error) {
            console.error('Error en la solicitud GET', error);
        }
    };

    const handleBuscarPorNombreLocalizacion = async () => {
        if(name_location === '') {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/v1/recorders?id_location_recorder=${name_location}`);
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    console.error('Error al obtener los datos de la consulta por nombre de localizacion');
                }
            } catch (error) {
                console.error('Error en la solicitud GET', error);
            }
        }else{
            const grabador = dataloc.find(fila => fila.name_location === name_location);
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/v1/recorders?id_location_recorder=${grabador.id_location}`);
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    console.error('Error al obtener los datos de la consulta por nombre de localizacion');
                }
            } catch (error) {
                console.error('Error en la solicitud GET', error);
            }
        }
    };

    const handleNameRecorderChange = (event) => {
        setNameRecorder(event.target.value);
    };
    const handleNameLocationChange = (event) => {
        setNameLocation(event.target.value);
    };

    const handleSelectButtonClick = (id_recorder,statusIs, idProcessor, idMicrofono, idLocation) => {
        setExpandedRows((prevExpandedRows) => {
            if (prevExpandedRows.includes(id_recorder)) {
                return [];
            } else {
                return [id_recorder];
            }
        });

        setIdProc(idProcessor - 1);
        setIdMic(idMicrofono - 1);
        setIdLoc(idLocation - 1);
        if (statusIs === "activada") {
            setStatus("spinner-grow text-success");
        } else {
            setStatus("spinner-grow text-danger");
        }
    };

    const handleEditButtonClick = (id_recorder) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_recorder]: true,
        }));
    };

    /* Almacena los cambios en DB mediante actualización (PUT) */
    const handleSaveButtonClick = async (id_recorder, updatedData) => {
        try {
            const url = `http://127.0.0.1:8080/api/v1/recorders/${id_recorder}`;
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
                    [id_recorder]: false,
                }));
            } else {
                console.error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT', error);
        }
    };

    /* Dispara la accion de borrado (muestra el modal) */
    const handleDeleteButtonClick = (id_recorder) => {
        setDeleteItemId(id_recorder);
        setShowDeleteConfirmation(true);
    };

    /* Realiza la petición DELETE */
    const handleDeleteConfirm = async () => {
        if (deleteItemId) {
            try {
                const url = `http://127.0.0.1:8080/api/v1/recorders/${deleteItemId}`;
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
    const handleCancelEdit = (id_recorder) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_recorder]: false,
        }));
    };

    return (
        <Card className="my-4">
            <Card.Header>List of Recorders</Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <h5>Search by Name</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Name of the recorder:</Form.Label>
                                <Form.Control type="text" value={name_recorder} onChange={handleNameRecorderChange} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorNombreGrabadora} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                                Search
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <h5>Search by Location</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Name of the location:</Form.Label>
                                <Form.Control type="text" value={name_location} onChange={handleNameLocationChange} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorNombreLocalizacion} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
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
                            <th>Recorder Name</th>
                            <th>Name Microphone</th>
                            <th>Name Location</th>
                            <th>Name Processor</th>
                            <th>Status</th>
                            <th>Instalation Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((object) => (
                            <React.Fragment key={object.id_recorder}>
                                <tr key={object.id_recorder}>
                                    <td>
                                        <Button
                                            variant={expandedRows.includes(object.id_recorder) ? 'danger' : 'success'}
                                            onClick={() => handleSelectButtonClick(object.id_recorder,object.status,object.id_processor_recorder,object.id_microphone_recorder, object.id_location_recorder)}
                                        >
                                            {expandedRows.includes(object.id_recorder) ? '-' : '+'}
                                        </Button>
                                    </td>
                                    <td>
                                        {editableRows[object.id_recorder] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.recorder_name}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, recorder_name: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_recorder === object.id_recorder ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.recorder_name
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_recorder] ? (
                                            <Form.Control
                                                type="text"
                                                value={datamic.map((name) => name.name_microphone).at(object.id_microphone_recorder-1)}
                                                onChange={(e) => {}}
                                            />
                                        ) : (
                                            datamic.map((name) => name.name_microphone).at(object.id_microphone_recorder-1)
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_recorder] ? (
                                            <Form.Control
                                                type="text"
                                                value={dataloc.map((name) => name.name_location).at(object.id_location_recorder-1)}
                                                onChange={(e) => {}}
                                            />
                                        ) : (
                                            dataloc.map((name) => name.name_location).at(object.id_location_recorder-1)
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_recorder] ? (
                                            <Form.Control
                                                type="text"
                                                value={dataproc.map((name) => name.name_processor).at(object.id_processor_recorder-1)}
                                                onChange={(e) => {}}
                                            />
                                        ) : (
                                            dataproc.map((name) => name.name_processor).at(object.id_processor_recorder-1)
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_recorder] ? (
                                            <Form.Control
                                                type="text"
                                                value={moment(object.status).format('DD-MM-YYYY HH:mm:ss')}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, status: moment(e.target.value).toISOString()};
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_recorder === object.id_recorder ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            moment(object.status).format('DD-MM-YYYY HH:mm:ss')
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_recorder] ? (
                                            <Form.Control
                                                type="text"
                                                value={moment(object.installation_date).format('DD-MM-YYYY HH:mm:ss')}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, installation_date: moment(e.target.value).toISOString()};
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_recorder === object.id_recorder ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            moment(object.installation_date).format('DD-MM-YYYY HH:mm:ss')
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_recorder] ? (
                                            <>
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleSaveButtonClick(object.id_recorder, object)}
                                                >
                                                    Save
                                                </Button>{' '}
                                                <Button variant="danger" onClick={() => handleCancelEdit(object.id_recorder)}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleEditButtonClick(object.id_recorder)}
                                                    style={{backgroundColor:'#78a8b7'}}
                                                >
                                                    Edit
                                                </Button>{' '}
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteButtonClick(object.id_recorder)}
                                                    style = {{ backgroundColor: '#bb131f'}}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                {expandedRows.includes(object.id_recorder) && (
                                    <tr>
                                        <td>
                                            <div className={status} role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                        <td>{dataproc.map((procesador) => procesador.model_processor).at(idProc)}</td>
                                        <td>{dataproc.map((procesador) => procesador.comment_processor).at(idProc)}</td>
                                        <td>{datamic.map((microfone) => microfone.model_microphone).at(idMic)}</td>
                                        <td>{datamic.map((microfone) => microfone.comment_microphone).at(idMic)}</td>
                                        <td><iframe
                                            src={`https://maps.google.com/maps?q=&ll=${dataloc.map((location) => location.latitude_location).at(idLoc)},${dataloc.map((location) => location.longitude_location).at(idLoc)}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
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

const Mapa = () => {
    const center = [37.0427289, -6.7393173];
    const [dataloc, setDataloc] = useState([]);

    const customIcon = L.icon({
        iconUrl: markerIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    useEffect(() => {
        fetchData().then(response =>{
            console.log('Acceso correcto a la base de datos')
        }).catch(error => {
            console.error("Error en la peticion")
        })
    }, []);
    const fetchData = async () => {
        try{
            const url = 'http://127.0.0.1:8080/api/v1/locations';
            const response = await fetch(url);

            if (response.ok) {
                const jsonData = await response.json();
                setDataloc(jsonData);
            } else {
                console.error('Error al obtener datos de la localizacion');
            }
        }catch(error){
            console.error('Error en solicitud GET de la localizacion:', error);
        }
    }
    return (
        <div style={{ width: '650px', height: '580px' }}>
            <MapContainer center={center} zoom={10} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {dataloc.map((object) => (
                    <React.Fragment key={object.id_location}>
                        <Marker position={[object.latitude_location,object.longitude_location]} icon={customIcon}>
                            <Popup>
                                {object.name_location}
                            </Popup>
                        </Marker>
                    </React.Fragment>
                ))}
            </MapContainer>
        </div>
    );
};
function NewRecorders(){

    return (
        <Row className="p-5">
            <Col className="col-2 offset-10 p-2">
                <InsertRecorderForm />
            </Col>
            <Col className="my-4">
                <Mapa />
            </Col>
            <Col className="col-7">
                <GetRecorderRecords />
            </Col>
        </Row>
    )

}

export {InsertRecorderForm, GetRecorderRecords, NewRecorders};