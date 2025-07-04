import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    Button,
    Modal,
    Container,
    Row,
    Col,
    Card,
    Alert
} from 'react-bootstrap';
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
        const { data } = await axios.get('http://localhost:3000/temporadas', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTemporadas(data);
        } catch (err) {
        setError('Error al cargar las temporadas');
        console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
        const token = localStorage.getItem('token');
        await axios.delete(
            `http://localhost:3000/temporadas/${selectedTemporada.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setShowDeleteModal(false);
        fetchTemporadas();
        } catch (err) {
        setError('Error al eliminar la temporada');
        console.error(err);
        }
    };

    const handleFinalize = async (temporada) => {
        if (!window.confirm(`¿Finalizar "${temporada.nombre}"? Esto generará su ranking.`)) return;
        try {
        const token = localStorage.getItem('token');
        await axios.post(
            `http://localhost:3000/temporadas/${temporada.id}/finalizar`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchTemporadas();
        } catch (err) {
        setError('Error al finalizar la temporada');
        console.error(err);
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
            <Col><h2>Lista de Temporadas</h2></Col>
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
            {temporadas.map(t => (
                <Card key={t.id}>
                <Card.Body>
                    <Card.Title>{t.nombre}</Card.Title>
                    <Card.Text>
                    <strong>Inicio:</strong> {format(new Date(t.fecha_inicio), 'dd/MM/yyyy')}<br/>
                    <strong>Fin:</strong>    {format(new Date(t.fecha_fin),   'dd/MM/yyyy')}<br/>
                    <strong>Estado:</strong> {t.activa ? 'Activa' : 'Inactiva'}
                    </Card.Text>
                    <div className="d-flex gap-2">
                    <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowDetails(t)}
                    >
                        Ver Detalles
                    </Button>

                    {isAdmin && t.activa && (
                        <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleFinalize(t)}
                        >
                        Finalizar
                        </Button>
                    )}

                    {isAdmin && (
                        <>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleShowFormTemporada(t.id)}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                            setSelectedTemporada(t);
                            setShowDeleteModal(true);
                            }}
                        >
                            Eliminar
                        </Button>
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
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {temporadas.map(t => (
                <tr key={t.id}>
                    <td>{t.nombre}</td>
                    <td>{format(new Date(t.fecha_inicio), 'dd/MM/yyyy')}</td>
                    <td>{format(new Date(t.fecha_fin), 'dd/MM/yyyy')}</td>
                    <td>{t.activa ? 'Activa' : 'Inactiva'}</td>
                    <td className="d-flex flex-wrap gap-1">
                    <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowDetails(t)}
                    >
                        Ver
                    </Button>

                    {isAdmin && t.activa && (
                        <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleFinalize(t)}
                        >
                        Finalizar
                        </Button>
                    )}

                    {isAdmin && (
                        <>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleShowFormTemporada(t.id)}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                            setSelectedTemporada(t);
                            setShowDeleteModal(true);
                            }}
                        >
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