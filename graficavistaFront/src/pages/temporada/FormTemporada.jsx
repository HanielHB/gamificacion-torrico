import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const FormTemporada = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        meta_comunitaria: '',
        activa: true
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTemporada();
        }
    }, [id]);

    const fetchTemporada = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/temporadas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const temporada = response.data;
            setFormData({
                nombre: temporada.nombre,
                fecha_inicio: new Date(temporada.fecha_inicio).toISOString().split('T')[0],
                fecha_fin: new Date(temporada.fecha_fin).toISOString().split('T')[0],
                meta_comunitaria: temporada.meta_comunitaria,
                activa: temporada.activa
            });
        } catch (error) {
            setError('Error al cargar la temporada');
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
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
                    `http://localhost:3000/temporadas/${id}`,
                    formData,
                    { headers }
                );
            } else {
                await axios.post(
                    'http://localhost:3000/temporadas',
                    formData,
                    { headers }
                );
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/temporadas');
            }, 1500);

        } catch (error) {
            setError(error.response?.data?.msg || 'Error al guardar la temporada');
            console.error('Error:', error);
        }
    };

    const validateForm = () => {
        return formData.nombre && 
                formData.fecha_inicio && 
                formData.fecha_fin && 
                formData.meta_comunitaria && 
                new Date(formData.fecha_inicio) <= new Date(formData.fecha_fin);
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>{id ? 'Editar Temporada' : 'Nueva Temporada'}</h2>
                        <Button variant="secondary" onClick={() => navigate('/dashboard/temporadas')}>
                            Volver
                        </Button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">
                        {id ? 'Temporada actualizada correctamente' : 'Temporada creada correctamente'}
                    </Alert>}

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
                            <Form.Label>Fecha de Inicio</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha_inicio"
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Fin</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha_fin"
                                value={formData.fecha_fin}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Meta Comunitaria</Form.Label>
                            <Form.Control
                                type="number"
                                name="meta_comunitaria"
                                value={formData.meta_comunitaria}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Temporada Activa"
                                name="activa"
                                checked={formData.activa}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={!validateForm()}
                            >
                                {id ? 'Actualizar' : 'Crear'}
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={() => navigate('/dashboard/temporadas')}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default FormTemporada;