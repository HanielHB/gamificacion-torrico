import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Row,
    Col,
    Table,
    Card,
    Alert,
    Form
} from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { FaTrophy } from 'react-icons/fa';

const TopUsuariosPorTemporada = () => {
    const [temporadas, setTemporadas] = useState([]);
    const [selectedTemp, setSelectedTemp] = useState('');
    const [ranking, setRanking] = useState([]);
    const [error, setError] = useState(null);
    const isMobile = useMediaQuery({ maxWidth: 768 });

  // 1) Traer lista de temporadas
    useEffect(() => {
        const fetchTemporadas = async () => {
        try {
            const token = localStorage.getItem('token');
            const resp = await axios.get(
            'http://localhost:3000/temporadas',
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setTemporadas(resp.data);
        } catch (err) {
            setError('No se pudieron cargar las temporadas');
        }
    };
    fetchTemporadas();
    }, []);

  // 2) Cuando cambia la temporada seleccionada, traer su ranking
    useEffect(() => {
        if (!selectedTemp) {
        setRanking([]);
        return;
        }

        const fetchRanking = async () => {
        try {
            const token = localStorage.getItem('token');
            const resp = await axios.get(
            `http://localhost:3000/temporadas/${selectedTemp}/ranking`,
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setRanking(resp.data);
        } catch (err) {
            setError('Error al cargar el ranking de la temporada');
        }
        };
        fetchRanking();
    }, [selectedTemp]);

    const getTrophyColor = (index) => {
        switch (index) {
        case 0: return '#FFD700'; // Oro
        case 1: return '#C0C0C0'; // Plata
        case 2: return '#CD7F32'; // Bronce
        default: return '#000000';
        }
    };

    return (
        <Container fluid>
        <Row className="mb-4">
            <Col md={6}>
            <h2>Ranking por Temporada</h2>
            </Col>
            <Col md={6}>
            <Form.Group>
                <Form.Label>Seleccione Temporada:</Form.Label>
                <Form.Select
                value={selectedTemp}
                onChange={e => {
                    setError(null);
                    setSelectedTemp(e.target.value);
                }}
                >
                <option value="">-- elige una temporada --</option>
                {temporadas.map(t => (
                    <option key={t.id} value={t.id}>
                    {t.nombre} ({new Date(t.fecha_inicio).toLocaleDateString()} – {new Date(t.fecha_fin).toLocaleDateString()})
                    </option>
                ))}
                </Form.Select>
            </Form.Group>
            </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {!selectedTemp && (
            <Alert variant="info">Por favor selecciona una temporada para ver su ranking.</Alert>
        )}

        {selectedTemp && (
            isMobile
            ? (
                <div className="d-flex flex-column gap-3">
                {ranking.map((r, idx) => (
                    <Card key={r.usuario.id}>
                    <Card.Body>
                        <div className="d-flex align-items-center gap-3">
                        <FaTrophy size={24} color={getTrophyColor(idx)} />
                        <div>
                            <h5 className="mb-0">{r.usuario.nombre}</h5>
                            <p className="mb-0 text-muted">
                            Nivel: {r.usuario.nivel}
                            </p>
                            <p className="mb-0">
                            <strong>Puntos:</strong> {r.puntos_temporada}
                            </p>
                            {r.insignia && (
                            <p className="mb-0">
                                <strong>Insignia:</strong> {r.insignia}
                            </p>
                            )}
                        </div>
                        </div>
                    </Card.Body>
                    </Card>
                ))}
                </div>
            )
            : (
                <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Posición</th>
                    <th>Usuario</th>
                    <th>Nivel</th>
                    <th>Puntos</th>
                    <th>Insignia</th>
                    </tr>
                </thead>
                <tbody>
                    {ranking.map((r, idx) => (
                    <tr key={r.usuario.id}>
                        <td className="text-center">
                        <FaTrophy color={getTrophyColor(idx)} />
                        <span className="ms-2">{r.puesto}</span>
                        </td>
                        <td>{r.usuario.nombre}</td>
                        <td>{r.usuario.nivel}</td>
                        <td>{r.puntos_temporada}</td>
                        <td>{r.insignia || '-'}</td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            )
        )}
        </Container>
    );
};

export default TopUsuariosPorTemporada;
