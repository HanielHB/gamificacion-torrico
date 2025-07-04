import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Alert
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
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
    setUserRole(localStorage.getItem('role'));
  }, []);

  const fetchRecompensas = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:3000/recompensas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecompensas(data);
    } catch (err) {
      setError('Error al cargar las recompensas');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3000/recompensas/${selectedRecompensa.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowDeleteModal(false);
      fetchRecompensas();
    } catch {
      setError('Error al eliminar la recompensa');
    }
  };

  const handleCanjear = async (recompensa) => {
    if (!window.confirm(`¿Canjear "${recompensa.nombre}" por ${recompensa.costo_puntos} puntos?`)) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        usuario_id: /* tu ID de usuario, p.e.: */ JSON.parse(atob(token.split('.')[1])).id,
        recompensa_id: recompensa.id
      };
      const { data } = await axios.post(
        'http://localhost:3000/recompensas/canjear',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Recompensa canjeada. Nuevo saldo: ${data.nuevo_saldo} puntos`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al canjear');
    }
  };

  return (
    <Container fluid className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col><h2>Lista de Recompensas</h2></Col>
        {userRole === 'empleado' && (
          <Col xs="auto">
            <Button variant="success" onClick={() => handleShowFormRecompensa()}>
              <FaPlus className="me-2" /> Nueva Recompensa
            </Button>
          </Col>
        )}
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Nivel Requerido</th>
            <th>Costo</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recompensas.map(r => (
            <tr key={r.id}>
              <td>{r.nombre}</td>
              <td>{r.nivel_requerido}</td>
              <td>{r.costo_puntos}</td>
              <td>{r.descripcion || '-'}</td>
              <td>
                {/* Ver siempre */}
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedRecompensa(r);
                    setShowDetailsModal(true);
                  }}
                >
                  <FaEye />
                </Button>

                {/* Si es usuario normal, solo Canjear */}
                {userRole !== 'empleado' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleCanjear(r)}
                  >
                    Canjear
                  </Button>
                )}

                {/* Si es empleado, Editar y Eliminar */}
                {userRole === 'empleado' && (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowFormRecompensa(r.id)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedRecompensa(r);
                        setShowDeleteModal(true);
                      }}
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

      {/* Detalles Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Recompensa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecompensa && (
            <>
              <p><strong>Nombre:</strong> {selectedRecompensa.nombre}</p>
              <p><strong>Nivel Requerido:</strong> {selectedRecompensa.nivel_requerido}</p>
              <p><strong>Costo:</strong> {selectedRecompensa.costo_puntos}</p>
              <p><strong>Descripción:</strong> {selectedRecompensa.descripcion || '-'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Eliminar Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Eliminar la recompensa "{selectedRecompensa?.nombre}"?
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
