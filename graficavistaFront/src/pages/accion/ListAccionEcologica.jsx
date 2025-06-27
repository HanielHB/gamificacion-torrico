import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Button, 
  Modal, 
  Alert,
  Spinner
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaUser, FaPlus } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';

const ListAccionEcologica = () => {
    const { handleShowFormAccion } = useOutletContext();
    const [acciones, setAcciones] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAccion, setSelectedAccion] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState({}); // Mapa de usuarios por ID

    useEffect(() => {
        fetchAcciones();
        fetchUsuarios();
        const user = JSON.parse(localStorage.getItem('usuario'));
        setUserRole(user?.tipo);
    }, []);

    const fetchAcciones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/acciones/list_acciones', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAcciones(response.data);
        } catch (error) {
            setError('Error al cargar las acciones ecológicas');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/usuarios', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Crear un mapa de usuarios por ID para acceso rápido
            const usuariosMap = {};
            response.data.forEach(usuario => {
                usuariosMap[usuario.id] = usuario;
            });
            setUsuarios(usuariosMap);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/acciones/${selectedAccion.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteModal(false);
            setSuccess('Acción ecológica eliminada exitosamente');
            fetchAcciones();
        } catch (error) {
            setError('Error al eliminar la acción ecológica');
            console.error('Error:', error);
        }
    };

    const handleShowDelete = (accion) => {
        setSelectedAccion(accion);
        setShowDeleteModal(true);
    };

    const handleShowDetails = (accion) => {
        setSelectedAccion(accion);
        setShowDetailsModal(true);
    };

    // Función para obtener el nombre de un usuario
    const getNombreUsuario = (usuarioId) => {
        return usuarios[usuarioId]?.nombre || 'Usuario desconocido';
    };

    return (
        <Container fluid className="py-4">
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                    {success}
                </Alert>
            )}

            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="d-flex align-items-center">
                        <FaUser className="me-2 text-primary" /> 
                        Lista de Acciones Ecológicas
                    </h2>
                    <p className="text-muted">
                        Todas las acciones registradas en el sistema
                    </p>
                </Col>
                
                {/* Botón de Nueva Acción Ecológica - SOLUCIÓN AQUÍ */}
                {userRole === 'empleado' && (
                    <Col xs="auto">
                        <Button 
                            variant="success" 
                            onClick={() => handleShowFormAccion()}
                            className="d-flex align-items-center"
                        >
                            <FaPlus className="me-2" />
                            Nueva Acción Ecológica
                        </Button>
                    </Col>
                )}
            </Row>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" className="me-2" />
                    <span>Cargando acciones ecológicas...</span>
                </div>
            ) : acciones.length === 0 ? (
                <Alert variant="info">
                    No se han registrado acciones ecológicas aún.
                </Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead className="bg-light">
                            <tr>
                                <th>Usuario</th>
                                <th>Tipo</th>
                                <th>Detalle</th>
                                <th>Puntos</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {acciones.map((accion) => (
                                <tr key={accion.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <FaUser className="me-2 text-muted" />
                                            {getNombreUsuario(accion.usuario_id)}
                                        </div>
                                    </td>
                                    <td>{accion.tipo}</td>
                                    <td>{accion.detalle || 'Sin detalles'}</td>
                                    <td className="fw-bold text-success">
                                        +{accion.puntos_otorgados}
                                    </td>
                                    <td>
                                        {moment(accion.fecha).format('DD/MM/YYYY HH:mm')}
                                    </td>
                                    <td>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowDetails(accion)}
                                            title="Ver detalles"
                                        >
                                            <FaEye />
                                        </Button>
                                        
                                        {/* Botones de Editar y Eliminar - SOLUCIÓN AQUÍ */}
                                        {userRole === 'empleado' && (
                                            <>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleShowFormAccion(accion.id)}
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleShowDelete(accion)}
                                                    title="Eliminar"
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
            )}

            {/* Modal de Detalles */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>Detalles de la Acción Ecológica</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAccion && (
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <h6 className="text-muted">Usuario</h6>
                                <p>
                                    <FaUser className="me-2" />
                                    {getNombreUsuario(selectedAccion.usuario_id)}
                                </p>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <h6 className="text-muted">Tipo</h6>
                                <p>{selectedAccion.tipo}</p>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <h6 className="text-muted">Puntos Otorgados</h6>
                                <p className="fw-bold text-success">
                                    +{selectedAccion.puntos_otorgados}
                                </p>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <h6 className="text-muted">Fecha</h6>
                                <p>
                                    {moment(selectedAccion.fecha).format('DD/MM/YYYY HH:mm')}
                                </p>
                            </div>
                            
                            <div className="col-12 mb-3">
                                <h6 className="text-muted">Detalles</h6>
                                <p className="border p-3 rounded bg-light">
                                    {selectedAccion.detalle || 'No hay detalles adicionales'}
                                </p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Eliminación - SOLUCIÓN AQUÍ */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Está seguro que desea eliminar esta acción ecológica?</p>
                    
                    {selectedAccion && (
                        <div className="mt-3">
                            <p><strong>Usuario:</strong> {getNombreUsuario(selectedAccion.usuario_id)}</p>
                            <p><strong>Tipo:</strong> {selectedAccion.tipo}</p>
                            <p><strong>Puntos:</strong> +{selectedAccion.puntos_otorgados}</p>
                            <p><strong>Fecha:</strong> {moment(selectedAccion.fecha).format('DD/MM/YYYY')}</p>
                        </div>
                    )}
                    
                    <Alert variant="warning" className="mt-3">
                        <strong>¡Advertencia!</strong> Esta acción también descontará los puntos 
                        asociados al usuario.
                    </Alert>
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

export default ListAccionEcologica;