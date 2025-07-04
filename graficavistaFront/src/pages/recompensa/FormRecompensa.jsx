import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const FormRecompensa = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel_requerido: '1',
    costo_puntos: 0
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRecompensa();
    }
  }, [id]);

  const fetchRecompensa = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `http://localhost:3000/recompensas/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        nivel_requerido: data.nivel_requerido,
        costo_puntos: data.costo_puntos
      });
    } catch (err) {
      setError('Error al cargar la recompensa');
      console.error(err);
    }
  };

  const handleChange = e => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (id) {
        await axios.put(
          `http://localhost:3000/recompensas/${id}`,
          formData,
          { headers }
        );
      } else {
        await axios.post(
          'http://localhost:3000/recompensas/',
          formData,
          { headers }
        );
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/recompensas');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.msg || 'Error al guardar la recompensa');
      console.error(err);
    }
  };

  const validateForm = () => {
    return (
      formData.nombre.trim() !== '' &&
      formData.descripcion.trim() !== '' &&
      formData.nivel_requerido !== '' &&
      formData.costo_puntos >= 0
    );
  };

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Recompensa guardada exitosamente</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col><h2>{id ? 'Editar Recompensa' : 'Nueva Recompensa'}</h2></Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={() => navigate('/dashboard/recompensas')}>
              Volver
            </Button>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nivel Requerido</Form.Label>
          <Form.Select
            name="nivel_requerido"
            value={formData.nivel_requerido}
            onChange={handleChange}
            required
          >
            <option value="Semilla">Semilla</option>
            <option value="Brote">Brote</option>
            <option value="Planta">Planta</option>
            <option value="Árbol">Árbol</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Costo en Puntos</Form.Label>
          <Form.Control
            type="number"
            name="costo_puntos"
            value={formData.costo_puntos}
            onChange={handleChange}
            min="0"
            required
          />
        </Form.Group>

        <div className="d-grid">
          <Button
            variant="primary"
            type="submit"
            disabled={!validateForm()}
          >
            {id ? 'Actualizar' : 'Crear'} Recompensa
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormRecompensa;
