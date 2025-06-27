import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FormAccionEcologica = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tipo: '',
        puntos_otorgados: '',
        temporada_id: '',
        usuario_id: '',
        detalle: ''  // Nuevo campo añadido
    });
    const [temporadas, setTemporadas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [tipoPersonalizado, setTipoPersonalizado] = useState(''); // Para el tipo "otro"

    useEffect(() => {
        fetchTemporadas();
        fetchUsuarios();
    }, []);

    const fetchTemporadas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/temporadas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const temporadasActivas = response.data.filter(temp => temp.activa);
            setTemporadas(temporadasActivas);
        } catch (error) {
            setError('Error al cargar las temporadas');
            console.error('Error:', error);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/usuarios', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(response.data);
        } catch (error) {
            setError('Error al cargar los usuarios');
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Manejar cambio de tipo especial
        if (name === 'tipo' && value === 'otro') {
            setFormData(prevState => ({
                ...prevState,
                tipo: tipoPersonalizado
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: name === 'puntos_otorgados' ? parseInt(value) || '' : value
            }));
        }
    };

    const handleTipoPersonalizadoChange = (e) => {
        const value = e.target.value;
        setTipoPersonalizado(value);
        setFormData(prevState => ({
            ...prevState,
            tipo: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validar tipo personalizado
        if (formData.tipo === '' && tipoPersonalizado === '') {
            setError('Por favor ingresa un tipo de acción');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Si seleccionó "otro" y no escribió nada
            if (formData.tipo === 'otro' && tipoPersonalizado === '') {
                setError('Por favor ingresa el tipo de acción');
                return;
            }

            // Si seleccionó "otro", usar el valor personalizado
            const dataToSend = {
                ...formData,
                tipo: formData.tipo === 'otro' ? tipoPersonalizado : formData.tipo
            };

            await axios.post(
                'http://localhost:3000/acciones/registrar',
                dataToSend,
                { headers }
            );

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/acciones');
            }, 1500);

        } catch (error) {
            setError(error.response?.data?.msg || 'Error al registrar la acción ecológica');
            console.error('Error:', error);
        }
    };

    const validateForm = () => {
        return formData.tipo && 
                formData.puntos_otorgados > 0 && 
                formData.temporada_id &&
                formData.usuario_id;
    };

    // Tipos de acción alineados con el backend
    const tiposAccion = [
        'bolsa_reutilizable',
        'reciclaje_plastico',
        'compra_local',
        'taller_ecologico',
        'desafio_comunitario',
        'otro' // Para tipos personalizados
    ];

    // Traducciones para mostrar tipos de acción más amigables
    const tipoLabels = {
        'bolsa_reutilizable': 'Uso de bolsa reutilizable',
        'reciclaje_plastico': 'Reciclaje de plástico',
        'compra_local': 'Compra de productos locales',
        'taller_ecologico': 'Participación en taller ecológico',
        'desafio_comunitario': 'Completar desafío comunitario',
        'otro': 'Otro tipo de acción'
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-md-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="mb-0">Registrar Acción Ecológica</h2>
                                <Button variant="outline-secondary" onClick={() => navigate('/dashboard/acciones')}>
                                    Volver
                                </Button>
                            </div>

                            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                            {success && <Alert variant="success" className="mb-4">
                                Acción ecológica registrada exitosamente
                            </Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Usuario</Form.Label>
                                            <Form.Select
                                                name="usuario_id"
                                                value={formData.usuario_id}
                                                onChange={handleChange}
                                                required
                                                className="py-2"
                                            >
                                                <option value="">Seleccione un usuario</option>
                                                {usuarios.map(usuario => (
                                                    <option key={usuario.id} value={usuario.id}>
                                                        {usuario.nombre} - {usuario.email}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Temporada</Form.Label>
                                            <Form.Select
                                                name="temporada_id"
                                                value={formData.temporada_id}
                                                onChange={handleChange}
                                                required
                                                className="py-2"
                                            >
                                                <option value="">Seleccione una temporada</option>
                                                {temporadas.map(temporada => (
                                                    <option key={temporada.id} value={temporada.id}>
                                                        {temporada.nombre} 
                                                        {temporada.meta_comunitaria && ` (${temporada.meta_comunitaria})`}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo de Acción</Form.Label>
                                            <Form.Select
                                                name="tipo"
                                                value={formData.tipo}
                                                onChange={handleChange}
                                                required
                                                className="py-2"
                                            >
                                                <option value="">Seleccione un tipo</option>
                                                {tiposAccion.map((tipo, index) => (
                                                    <option key={index} value={tipo}>
                                                        {tipoLabels[tipo] || tipo}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        
                                        {/* Campo para tipo personalizado */}
                                        {formData.tipo === 'otro' && (
                                            <Form.Group className="mb-3">
                                                <Form.Label>Especificar tipo de acción</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Describe el tipo de acción"
                                                    value={tipoPersonalizado}
                                                    onChange={handleTipoPersonalizadoChange}
                                                    required
                                                    className="py-2"
                                                />
                                            </Form.Group>
                                        )}
                                    </Col>
                                    
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Puntos Otorgados</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="puntos_otorgados"
                                                value={formData.puntos_otorgados}
                                                onChange={handleChange}
                                                min="1"
                                                required
                                                className="py-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Campo de descripción añadido */}
                                <Form.Group className="mb-4">
                                    <Form.Label>Descripción (Detalles de la acción)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="detalle"
                                        value={formData.detalle}
                                        onChange={handleChange}
                                        placeholder="Describe la acción realizada, materiales reciclados, cantidad, etc."
                                        className="py-2"
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button 
                                        variant="success" 
                                        type="submit"
                                        size="lg"
                                        disabled={!validateForm()}
                                        className="py-2"
                                    >
                                        Registrar Acción Ecológica
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormAccionEcologica;