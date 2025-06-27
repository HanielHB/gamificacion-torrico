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
        beneficio: '',
        disponible: true
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
            const response = await axios.get(`http://localhost:3000/recompensas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const recompensa = response.data;
            setFormData({
                nombre: recompensa.nombre,
                descripcion: recompensa.descripcion,
                nivel_requerido: recompensa.nivel_requerido || '1',
                beneficio: recompensa.beneficio || '',
                disponible: recompensa.disponible
            });
        } catch (error) {
            setError('Error al cargar la recompensa');
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : 
                    (name === 'puntos' || name === 'stock') ? parseInt(value) || '' : 
                    value
        }));
    };

    const handleSubmit = async (e) => {
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
                    'http://localhost:3000/recompensas',
                    formData,
                    { headers }
                );
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/recompensas');
            }, 1500);

        } catch (error) {
            setError(error.response?.data?.msg || 'Error al guardar la recompensa');
            console.error('Error:', error);
        }
    };

    const validateForm = () => {
        return formData.nombre && 
               formData.descripcion && 
               formData.nivel_requerido && 
               formData.beneficio;
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>{id ? 'Editar Recompensa' : 'Nueva Recompensa'}</h2>
                        <Button variant="secondary" onClick={() => navigate('/dashboard/recompensas')}>Volver</Button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Recompensa guardada exitosamente</Alert>}

                    <Form onSubmit={handleSubmit}>
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
                                <option value="1">Nivel 1</option>
                                <option value="2">Nivel 2</option>
                                <option value="3">Nivel 3</option>
                                <option value="4">Nivel 4</option>
                                <option value="5">Nivel 5</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Beneficio</Form.Label>
                            <Form.Control
                                type="text"
                                name="beneficio"
                                value={formData.beneficio}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Disponible"
                                name="disponible"
                                checked={formData.disponible}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={!validateForm()}
                            >
                                {id ? 'Actualizar' : 'Crear'} Recompensa
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default FormRecompensa;