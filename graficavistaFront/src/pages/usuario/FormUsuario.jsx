import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const FormUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        tipo: 'usuario',
        puntos: 0,
        nivel: 'Semilla'
    });
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            fetchUsuario();
        }
    }, [id]);

    const fetchUsuario = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { password, ...userData } = response.data;
            setFormData(userData);
        } catch (error) {
            setError('Error al cargar los datos del usuario');
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (isEditing) {
                // Si estamos editando y no se proporciona nueva contraseña, la eliminamos del formData
                const { password, ...updateData } = formData;
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await axios.put(`http://localhost:3000/usuarios/${id}`, updateData, { headers });
            } else {
                await axios.post('http://localhost:3000/usuarios/', formData, { headers });
            }

            navigate('/dashboard/usuarios');
        } catch (error) {
            setError(error.response?.data?.msg || 'Error al guardar el usuario');
            console.error('Error:', error);
        }
    };

    return (
        <Container className="py-4">
            <Card>
                <Card.Body>
                    <h2 className="mb-4">{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                    {error && <Alert variant="danger">{error}</Alert>}

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
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!isEditing}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                required
                            >
                                <option value="cliente">Cliente</option>
                                <option value="empleado">Empleado</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Puntos</Form.Label>
                            <Form.Control
                                type="number"
                                name="puntos"
                                value={formData.puntos}
                                onChange={handleChange}
                                min="0"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nivel</Form.Label>
                            <Form.Select
                                name="nivel"
                                value={formData.nivel}
                                onChange={handleChange}
                                required
                            >
                                <option value="Semilla">Semilla</option>
                                <option value="Brote">Brote</option>
                                <option value="Planta">Planta</option>
                                <option value="Árbol">Árbol</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                {isEditing ? 'Actualizar' : 'Crear'}
                            </Button>
                            <Button variant="secondary" onClick={() => navigate('/dashboard/usuarios')}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FormUsuario;