import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { format } from 'date-fns';
import { useOutletContext } from 'react-router-dom';

const ListTemporada = () => {
    const { handleShowFormTemporada } = useOutletContext();
    const [temporadas, setTemporadas] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTemporada, setSelectedTemporada] = useState(null);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setIsAdmin(payload.tipo === 'empleado');
        }
        fetchTemporadas();
    }, []);

    const fetchTemporadas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/temporadas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTemporadas(response.data);
        } catch (error) {
            setError('Error al cargar las temporadas');
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/temporadas/${selectedTemporada.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteModal(false);
            fetchTemporadas();
        } catch (error) {
            setError('Error al eliminar la temporada');
            console.error('Error:', error);
        }
    };

    const handleShowDetails = (temporada) => {
        setSelectedTemporada(temporada);
        setShowDetailsModal(true);
    };

    return (
        <Container fluid>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-3">
                <Col>
                    <h2>Lista de Temporadas</h2>
                </Col>
                {isAdmin && (
                    <Col xs="auto">
                        <Button variant="primary" onClick={() => handleShowFormTemporada()}>
                            Nueva Temporada
                        </Button>
                    </Col>
                )}
            </Row>

            {isMobile ? (
                <div className="d-flex flex-column gap-3">
                    {temporadas.map(temporada => (
                        <Card key={temporada.id}>
                            <Card.Body>
                                <Card.Title>{temporada.nombre}</Card.Title>
                                <Card.Text>
                                    <strong>Inicio:</strong> {format(new Date(temporada.fecha_inicio), 'dd/MM/yyyy')}<br/>
                                    <strong>Fin:</strong> {format(new Date(temporada.fecha_fin), 'dd/MM/yyyy')}<br/>
                                    <strong>Estado:</strong> {temporada.activa ? 'Activa' : 'Inactiva'}
                                </Card.Text>
                                <div className="d-flex gap-2">
                                    <Button variant="info" size="sm" onClick={() => handleShowDetails(temporada)}>Ver Detalles</Button>
                                    {isAdmin && (
                                        <>
                                            <Button variant="warning" size="sm" onClick={() => handleShowFormTemporada(temporada.id)}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => {
                                                setSelectedTemporada(temporada);
                                                setShowDeleteModal(true);
                                            }}>Eliminar</Button>
                                        </>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temporadas.map(temporada => (
                            <tr key={temporada.id}>
                                <td>{temporada.nombre}</td>
                                <td>{format(new Date(temporada.fecha_inicio), 'dd/MM/yyyy')}</td>
                                <td>{format(new Date(temporada.fecha_fin), 'dd/MM/yyyy')}</td>
                                <td>{temporada.activa ? 'Activa' : 'Inactiva'}</td>
                                <td>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleShowDetails(temporada)}>
                                        Ver Detalles
                                    </Button>
                                    {isAdmin && (
                                        <>
                                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowFormTemporada(temporada.id)}>
                                                Editar
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => {
                                                setSelectedTemporada(temporada);
                                                setShowDeleteModal(true);
                                            }}>
                                                Eliminar
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal de Detalles */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de la Temporada</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTemporada && (
                        <>
                            <p><strong>Nombre:</strong> {selectedTemporada.nombre}</p>
                            <p><strong>Fecha de Inicio:</strong> {format(new Date(selectedTemporada.fecha_inicio), 'dd/MM/yyyy')}</p>
                            <p><strong>Fecha de Fin:</strong> {format(new Date(selectedTemporada.fecha_fin), 'dd/MM/yyyy')}</p>
                            <p><strong>Meta Comunitaria:</strong> {selectedTemporada.meta_comunitaria}</p>
                            <p><strong>Estado:</strong> {selectedTemporada.activa ? 'Activa' : 'Inactiva'}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro que desea eliminar la temporada "{selectedTemporada?.nombre}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListTemporada;