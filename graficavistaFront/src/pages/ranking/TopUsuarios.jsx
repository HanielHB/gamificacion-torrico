import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Card, Alert } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { FaTrophy } from 'react-icons/fa';

const TopUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        fetchTopUsuarios();
    }, []);

    const fetchTopUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/usuarios?sort=puntos&limit=10', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(response.data);
        } catch (error) {
            setError('Error al cargar el ranking de usuarios');
            console.error('Error:', error);
        }
    };

    const getTrophyColor = (index) => {
        switch(index) {
            case 0: return '#FFD700'; // Oro
            case 1: return '#C0C0C0'; // Plata
            case 2: return '#CD7F32'; // Bronce
            default: return '#000000'; // Negro para el resto
        }
    };

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Top 10 Usuarios</h2>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {isMobile ? (
                <div className="d-flex flex-column gap-3">
                    {usuarios.map((usuario, index) => (
                        <Card key={usuario.id}>
                            <Card.Body>
                                <div className="d-flex align-items-center gap-3">
                                    <FaTrophy size={24} color={getTrophyColor(index)} />
                                    <div>
                                        <h5 className="mb-0">{usuario.nombre}</h5>
                                        <p className="mb-0 text-muted">
                                            {usuario.tipo === 'empleado' ? 'Empleado' : 'Usuario'}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Puntos:</strong> {usuario.puntos}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Nivel:</strong> {usuario.nivel}
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Usuario</th>
                            <th>Tipo</th>
                            <th>Puntos</th>
                            <th>Nivel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario.id}>
                                <td className="text-center">
                                    <FaTrophy color={getTrophyColor(index)} />
                                    <span className="ms-2">{index + 1}</span>
                                </td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.tipo === 'empleado' ? 'Empleado' : 'Usuario'}</td>
                                <td>{usuario.puntos}</td>
                                <td>{usuario.nivel}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default TopUsuarios;