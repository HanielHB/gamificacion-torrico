import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

const ListRecompensa = () => {
    const { handleShowFormRecompensa } = useOutletContext();
    const [recompensas, setRecompensas] = useState([]);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRecompensa, setSelectedRecompensa] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchRecompensas();
        const role = localStorage.getItem('role');
        setUserRole(role);
    }, []);

    const fetchRecompensas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/recompensas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecompensas(response.data);
        } catch (error) {
            setError('Error al cargar las recompensas');
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/recompensas/${selectedRecompensa.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteModal(false);
            fetchRecompensas();
        } catch (error) {
            setError('Error al eliminar la recompensa');
            console.error('Error:', error);
        }
    };

    const handleShowDelete = (recompensa) => {
        setSelectedRecompensa(recompensa);
        setShowDeleteModal(true);
    };

    const handleShowDetails = (recompensa) => {
        setSelectedRecompensa(recompensa);
        setShowDetailsModal(true);
    };

    return (
        <Container fluid>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-3">
                <Col>
                    <h2>Lista de Recompensas</h2>
                </Col>
                {userRole === 'empleado' && (
                    <Col xs="auto">
                        <Button variant="primary" onClick={() => handleShowFormRecompensa()}>
                            Nueva Recompensa
                        </Button>
                    </Col>
                )}
            </Row>

            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Puntos</th>
                            <th>Stock</th>
                            <th>Disponible</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recompensas.map((recompensa) => (
                            <tr key={recompensa.id}>
                                <td>{recompensa.nombre}</td>
                                <td>{recompensa.puntos}</td>
                                <td>{recompensa.stock}</td>
                                <td>{recompensa.disponible ? 'Sí' : 'No'}</td>
                                <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowDetails(recompensa)}
                                    >
                                        <FaEye />
                                    </Button>
                                    {userRole === 'empleado' && (
                                        <>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleShowFormRecompensa(recompensa.id)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleShowDelete(recompensa)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal de Detalles */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de la Recompensa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRecompensa && (
                        <>
                            <p><strong>Nombre:</strong> {selectedRecompensa.nombre}</p>
                            <p><strong>Descripción:</strong> {selectedRecompensa.descripcion}</p>
                            <p><strong>Puntos:</strong> {selectedRecompensa.puntos}</p>
                            <p><strong>Stock:</strong> {selectedRecompensa.stock}</p>
                            <p><strong>Disponible:</strong> {selectedRecompensa.disponible ? 'Sí' : 'No'}</p>
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
                    ¿Está seguro que desea eliminar la recompensa "{selectedRecompensa?.nombre}"?
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

export default ListRecompensa;