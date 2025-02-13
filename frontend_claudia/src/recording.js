import React, {useCallback, useEffect, useState} from 'react';
import {Card, Form, Button, Table, Row, Col, Modal} from 'react-bootstrap';
import moment from "moment";
import SpectrogramPlayer from "react-audio-spectrogram-player";
import {decode} from "wav-decoder";
import {useDropzone} from "react-dropzone";

const InsertRecordingForm = () => {

    /**
     * Función que genera un formulario dentro de un componente "Card" de Bootstrap y que, mediante un boton
     * realiza una petición POST a la API de la EBD
     */
    const initialFormData = {
        id_recorder_recordings: '',
        time_record: moment().format('YYYY-MM-DD HH:mm:ss'),
        filetype_record: '',
        bitrate_record: '',
        sample_rate_record: '',
        gain_record: '',
        duration_record: '',
        uri: '',
        device: '',
    }
    const [formData, setFormData] = useState({initialFormData});
    const [insertData, setInsertData] = useState(false);
    const [metadata, setMetadata] = useState(null);
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

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioData = await decode(arrayBuffer);
            const bitDepth = file.type === 'audio/wav' ? file.size * 8 / audioData.channelData[0].length / audioData.sampleRate : null;
            const bitRate = audioData.sampleRate * bitDepth * audioData.channelData.length;
            let maxAbsValue = 0;
            for (let i = 0; i < audioData.channelData[0].length; i++) {
                const absValue = Math.abs(audioData.channelData[0][i]);
                if (absValue > maxAbsValue) {
                    maxAbsValue = absValue;
                }
            }

            const gainValue = 20 * Math.log10(maxAbsValue);
            const metadataResult = {
                fileName: file.name,
                bitRate: bitRate,
                fileType: 'WAV',
                sampleRate: audioData.sampleRate,
                gain: gainValue,
                duration: audioData.channelData[0].length / audioData.sampleRate,
            };

            setFormData(prevFormData => ({
                ...prevFormData,
                filetype_record: metadataResult.fileType,
                bitrate_record: metadataResult.bitRate.toFixed(2),
                sample_rate_record: metadataResult.sampleRate,
                gain_record: metadataResult.gain.toFixed(2),
                duration_record: metadataResult.duration.toFixed(2),
                uri: `grabaciones/${file.name}`,
            }));

            setMetadata(metadataResult);
        } catch (error) {
            console.error('Error al extraer metadatos:', error);
            setMetadata(null);
        }
    }, [setFormData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    /* Maneja la petición post */
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(metadata)
        try {
            const response = await fetch('http://127.0.0.1:5000/api/v1/recordings', {
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
                setMetadata(null);
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
                    <div>
                        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                            <input {...getInputProps()} />
                            <p>Drop a .WAV here or click to select</p>
                        </div>
                        {metadata && (
                            <div className="metadata">
                                <h4>Metadatos:</h4>
                                <pre>{JSON.stringify(metadata, null, 2)}</pre>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>ID Recorder:</Form.Label>
                                        <Form.Control type="number" name="id_recorder_recordings" value={formData.id_recorder_recordings} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Time recorded:</Form.Label>
                                        <Form.Control type="text" name="time_record" value={formData.time_record} onChange={handleChange} required placeholder="YYYY-MM-DD HH:mm:ss" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Device:</Form.Label>
                                        <Form.Control type="text" name="device" value={formData.device} onChange={handleChange} required />
                                    </Form.Group>
                                    <Button type="submit" variant="primary" style={{ backgroundColor: '#708090' }}>Add recording</Button>
                                </Form>
                            </div>
                        )}
                    </div>
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


const GetRecordingsRecords = () => {
    /**
     * Función que controla las siguientes acciones:
     * - Realiza una petición get inicial para mostrar todos los valores de la tabla grabaciones, y los devuelve
     * como tabla interactiva.
     * - Realiza la petición GET para realizar el filtrado según criterio de id_record
     * - Permite realizar modificaciones en la tabla interactiva. Al confirmarlo, realiza una petición PUT que
     * actualiza la base de datos
     * - Permite la eliminación de registros. Para ello, gestiona la petición DELETE, así como obliga a la
     * confirmación mediante la creación de un modal
     */
    const [data, setData] = useState([]);
    const [name_recorder, setNamerecorder] = useState('');
    const [data_recorder, setDatarecorder] = useState([]);
    const [time_recording, setTimerecording] = useState(moment().format('DD/MM/YYYY HH:mm:ss'));
    const [editableRows, setEditableRows] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const [spectrogram_array, setSpectrogram_array] = useState([0]);
    const [audioUrl, setAudioUrl] = useState('');

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
            const url = 'http://127.0.0.1:5000/api/v1/recordings';
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
            const url = 'http://127.0.0.1:5000/api/v1/recorders';
            const response = await fetch(url);

            if (response.ok) {
                const jsonData = await response.json();
                setDatarecorder(jsonData);
            } else {
                console.error('Error al obtener datos de recorder');
            }
        }catch(error){
            console.error('Error en solicitud GET de recorder:', error);
        }
    };

    /* Peticion para el filtrado por Nombre */
    const handleBuscarPorNombre = async () => {
        if(name_recorder === ''){
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/v1/recordings?id_recorder_recordings=${name_recorder}`);
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    console.error('Error al obtener los datos de la consulta por nombre de grabadora');
                }
            } catch (error) {
                console.error('Error en la solicitud GET', error);
            }
        }else{
            const grabador = data_recorder.find(fila => fila.recorder_name === name_recorder);
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/v1/recordings?id_recorder_recordings=${grabador.id_recorder}`);
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    console.error('Error al obtener los datos de la consulta por nombre de grabadora');
                }
            } catch (error) {
                console.error('Error en la solicitud GET', error);
            }
        }
    };

    /* Peticion para el filtrado por Tiempo */
    const handleBuscarPorTiempo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/recordings?time_record=${time_recording}`);
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

    const handleNameChange = (event) => {
        setNamerecorder(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTimerecording(event.target.value);
    };

    const handleSelectButtonClick = (id_record) => {
        setExpandedRows((prevExpandedRows) => {
            if (prevExpandedRows.includes(id_record)) {
                return [];
            } else {
                return [id_record];
            }
        });
        setSpectrogram_array(0);
    };

    const handleEditButtonClick = (id_record) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_record]: true,
        }));
    };

    /* Almacena los cambios en DB mediante actualización (PUT) */
    const handleSaveButtonClick = async (id_record, updatedData) => {
        try {
            const url = `http://127.0.0.1:5000/api/v1/recordings/${id_record}`;
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
                    [id_record]: false,
                }));
            } else {
                console.error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT', error);
        }
    };

    /* Dispara la accion de borrado (muestra el modal) */
    const handleDeleteButtonClick = (id_record) => {
        setDeleteItemId(id_record);
        setShowDeleteConfirmation(true);
    };

    /* Realiza la petición DELETE */
    const handleDeleteConfirm = async () => {
        if (deleteItemId) {
            try {
                const url = `http://127.0.0.1:5000/api/v1/recordings/${deleteItemId}`;
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
    const handleCancelEdit = (id_record) => {
        setEditableRows((prevEditableRows) => ({
            ...prevEditableRows,
            [id_record]: false,
        }));
    };

    const downloadRecording = (route_recording) => {
        const url = `http://127.0.0.1:5000/api/v1/download_recording?route_recording=${route_recording}`;

        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = route_recording;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
            })
            .catch(error => console.error('Error en la solicitud GET:', error));
    };

    const downloadAllRecordings = () => {
        try {
            const url = 'http://127.0.0.1:5000/api/v1/download_all_recordings';
            const a = document.createElement('a');
            a.href = url;
            a.download = 'archivos.zip';
            a.setAttribute('target', '_blank');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error en la solicitud de descarga de archivos:', error);
        }
    }

    const showSpectrogram = async (uri) => {
        try {
            const url = `http://127.0.0.1:5000/api/v1/spectrogram?uri=${uri}`;
            const response = await fetch(url);

            if (response.ok) {
                const responseData = await response.json();

                const datos_csv = responseData.datos_csv;
                const audio_url = responseData.audio_url;

                const rows = datos_csv.split('\n');
                const dataList = rows.map(row => row.split(','));
                if (Array.isArray(dataList) && dataList.every(Array.isArray)) {
                    setSpectrogram_array(dataList);
                    setAudioUrl(audio_url);
                } else {
                    console.error('La respuesta no es una lista de listas.');
                }
            } else {
                console.error('Error al obtener datos de spectrogram');
            }
        } catch (error) {
            console.error('Error en solicitud GET de spectrogram:', error);
        }
    }

    return (
        <Card className="my-4">
            <Card.Header>List of Recordings</Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <h5>Search by Name</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Name of the recorder:</Form.Label>
                                <Form.Control type="text" value={name_recorder} onChange={handleNameChange} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorNombre} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                                Search
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <h5>Search by Time</h5>
                        <Form className="d-flex flex-row align-items-center">
                            <Form.Group className="mb-3">
                                <Form.Label>Time of the recording:</Form.Label>
                                <Form.Control type="text" value={time_recording} onChange={handleTimeChange} placeholder="YYYY-MM-DD HH:mm:ss"/>
                            </Form.Group>
                            <Button variant="primary" onClick={handleBuscarPorTiempo} style={{ backgroundColor: '#708090' }} className="mt-3 ms-2">
                                Search
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Form className="col-2 offset-10 p-2">
                        <Button variant="primary" onClick={downloadAllRecordings} style={{ backgroundColor: '#007201' }}>
                            Download All Recordings
                        </Button>
                    </Form>
                </Row>
                <Row>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name Recorder</th>
                            <th>Time</th>
                            <th>File type</th>
                            <th>Bit rate</th>
                            <th>Sample rate</th>
                            <th>Gain</th>
                            <th>Duration</th>
                            <th>Uri</th>
                            <th>Device</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((object) => (
                            <React.Fragment key={object.id_record}>
                                <tr key={object.id_record}>
                                    <td>
                                        <Button
                                            variant={expandedRows.includes(object.id_record) ? 'danger' : 'success'}
                                            onClick={() => handleSelectButtonClick(object.id_record)}
                                        >
                                            {expandedRows.includes(object.id_record) ? '-' : '+'}
                                        </Button>
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="text"
                                                value={data_recorder.map((name) => name.recorder_name).at(object.id_recorder_recordings)}
                                            />
                                        ) : (
                                            data_recorder.map((name) => name.recorder_name).at(object.id_recorder_recordings-1)
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="text"
                                                value={moment(object.time_record).format('DD/MM/YYYY HH:mm:ss')}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, time_record: moment(e.target.value).format('DD/MM/YYYY HH:mm:ss') };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_record === object.id_record ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            moment(object.time_record).format('DD/MM/YYYY HH:mm:ss')
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.filetype_record}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, filetype_record: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_record === object.id_record ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.filetype_record
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="number"
                                                value={object.bitrate_record}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, bitrate_record: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_record === object.id_record ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.bitrate_record
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.sample_rate_record}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, sample_rate_record: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_record === object.id_record ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.sample_rate_record
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="number"
                                                value={object.gain_record}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, gain_record: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_record === object.id_record ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.gain_record
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="number"
                                                value={object.duration_record}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, duration_record: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_record === object.id_record ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.duration_record
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.uri}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, uri: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_record === object.id_record ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.uri
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <Form.Control
                                                type="text"
                                                value={object.device}
                                                onChange={(e) => {
                                                    const updatedData = { ...object, device: e.target.value };
                                                    setData((prevData) =>
                                                        prevData.map((item) => (item.id_record === object.id_record ? updatedData : item))
                                                    );
                                                }}
                                            />
                                        ) : (
                                            object.device
                                        )}
                                    </td>
                                    <td>
                                        {editableRows[object.id_record] ? (
                                            <>
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleSaveButtonClick(object.id_record, object)}
                                                >
                                                    Save
                                                </Button>{' '}
                                                <Button variant="danger" onClick={() => handleCancelEdit(object.id_record)}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleEditButtonClick(object.id_record)}
                                                    style={{backgroundColor:'#78a8b7'}}
                                                >
                                                    Edit
                                                </Button>{' '}
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteButtonClick(object.id_record)}
                                                    style = {{ backgroundColor: '#bb131f'}}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                {expandedRows.includes(object.id_record) && (
                                    <tr>
                                        <td>
                                            <Button
                                                variant="primary"
                                                style={{backgroundColor:'#78a8b7'}}
                                                onClick={() => downloadRecording(object.uri)}>
                                                Download recording
                                            </Button>
                                        </td>
                                        <td>
                                            {parseFloat(spectrogram_array) === 0 && (
                                                <Button
                                                    variant="primary"
                                                    style={{backgroundColor:'#78a8b7'}}
                                                    onClick={() =>  showSpectrogram(object.uri)}>
                                                    Load Spectrogram
                                                </Button>
                                            )}
                                            {spectrogram_array !== undefined && parseFloat(spectrogram_array) !== 0 && (
                                                <SpectrogramPlayer
                                                    src={'http://127.0.0.1:5000/' + audioUrl}
                                                    sxx={spectrogram_array}
                                                />
                                            )}
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


function NewRecording(){


    return (
        <Row className="p-5">
            <Col className="col-2 offset-10 p-2">
                <InsertRecordingForm />
            </Col>
            <Col>
                <GetRecordingsRecords />
            </Col>
        </Row>
    )

}

export {InsertRecordingForm, GetRecordingsRecords, NewRecording};