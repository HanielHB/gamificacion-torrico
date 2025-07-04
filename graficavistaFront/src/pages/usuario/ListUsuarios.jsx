import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

const ListUsuarios = () => {
  // ② recibimos handleShowFormUsuario del Dashboard
    const { handleShowFormUsuario } = useOutletContext();
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchUsuarios();
        const role = localStorage.getItem('role');
        setUserRole(role);
    }, []);

    const fetchUsuarios = async () => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/usuarios', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsuarios(response.data);
        } catch (err) {
        setError('Error al cargar los usuarios');
        console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/usuarios/${selectedUsuario.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setShowDeleteModal(false);
        fetchUsuarios();
        } catch (err) {
        setError('Error al eliminar el usuario');
        console.error(err);
        }
    };

    const handleShowDelete = (usuario) => {
        setSelectedUsuario(usuario);
        setShowDeleteModal(true);
    };

    const handleShowDetails = (usuario) => {
        setSelectedUsuario(usuario);
        setShowDetailsModal(true);
    };

    return (
    <Container fluid className="py-4">
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-3">
                <Col>
                <h2>Lista de Usuarios</h2>
                </Col>

                {/* ③ Solo admins ven el botón, y al hacer clic llama a handleShowFormUsuario() */}
                {userRole === 'empleado' && (
                <Col xs="auto">
                    <Button
                    variant="primary"
                    onClick={() => handleShowFormUsuario()}
                    >
                    <FaPlus className="me-2" />
                    Nuevo Usuario
                    </Button>
                </Col>
                )}
            </Row>

            <div className="table-responsive">
                <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Puntos</th>
                    <th>Nivel</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                    <tr key={usuario.id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.tipo}</td>
                        <td>{usuario.puntos}</td>
                        <td>{usuario.nivel}</td>
                        <td>
                        <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowDetails(usuario)}
                        >
                            <FaEye />
                        </Button>

                        {userRole === 'admin' && (
                            <>
                            <Button
                                variant="warning"
                                size="sm"
                                className="me-2"
                                onClick={() => handleShowFormUsuario(usuario.id)}
                            >
                                <FaEdit />
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleShowDelete(usuario)}
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
                    <Modal.Title>Detalles del Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUsuario && (
                        <>
                            <p><strong>Nombre:</strong> {selectedUsuario.nombre}</p>
                            <p><strong>Email:</strong> {selectedUsuario.email}</p>
                            <p><strong>Tipo:</strong> {selectedUsuario.tipo}</p>
                            <p><strong>Puntos:</strong> {selectedUsuario.puntos}</p>
                            <p><strong>Nivel:</strong> {selectedUsuario.nivel}</p>
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
                    ¿Está seguro que desea eliminar el usuario "{selectedUsuario?.nombre}"?
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

export default ListUsuarios;