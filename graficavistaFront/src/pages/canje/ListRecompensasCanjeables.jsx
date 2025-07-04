import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const ListRecompensasCanjeables = () => {
    const [recompensas, setRecompensas] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1) Leer token y obtener userId
    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
    }

    useEffect(() => {
        if (!token || !userId) {
        setError('Tienes que iniciar sesión');
        setLoading(false);
        return;
        }

        const fetchData = async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };

            // 2) Traer datos del usuario (para nivel y puntos)
            const { data: u } = await axios.get(
            `http://localhost:3000/usuarios/${userId}`,
            { headers }
            );
            setUsuario(u);

            // 3) Traer todas las recompensas
            const { data: all } = await axios.get(
            'http://localhost:3000/recompensas',
            { headers }
            );

            // 4) Filtrar solo las canjeables
            const disponibles = all.filter(r =>
            r.nivel_requerido === u.nivel &&
            u.puntos >= r.costo_puntos
            );
            setRecompensas(disponibles);
        } catch (err) {
            setError('Error cargando datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [token, userId]);

    const handleCanjear = async (recompensaId) => {
        try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post(
            'http://localhost:3000/recompensas/canjear',
            { usuario_id: userId, recompensa_id: recompensaId },
            { headers }
        );
        // Refrescar datos tras el canje
        setRecompensas(prev => prev.filter(r => r.id !== recompensaId));
        setUsuario(u => ({ ...u, puntos: u.puntos - recompensas.find(r=>r.id===recompensaId).costo_puntos }));
        Alert.success('Recompensa canjeada con éxito');
        } catch (err) {
        Alert.error(err.response?.data?.msg || 'Error al canjear');
        }
    };

    if (loading) {
        return <div className="text-center my-5"><Spinner animation="border" /></div>;
    }
    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }
    if (!recompensas.length) {
        return <Alert variant="info">No hay recompensas canjeables en este momento.</Alert>;
    }

    return (
        <>
        <h3 className="mb-4">
            Recompensas que puedes canjear (Tienes {usuario.puntos} puntos, Nivel {usuario.nivel})
        </h3>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Costo (puntos)</th>
                <th>Canjear</th>
            </tr>
            </thead>
            <tbody>
            {recompensas.map(r => (
                <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{r.descripcion || '—'}</td>
                <td>{r.costo_puntos}</td>
                <td>
                    <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleCanjear(r.id)}
                    >
                    Canjear
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
        </>
    );
};

export default ListRecompensasCanjeables;
