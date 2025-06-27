import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaLeaf, FaGift, FaCalendarAlt, FaTrophy } from 'react-icons/fa';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token) {
            navigate('/');
        }

        setUserRole(role);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    // Funciones para navegación de temporadas
    const handleShowListTemporada = () => {
        navigate('/dashboard/temporadas');
    };

    const handleShowFormTemporada = (temporadaId = null) => {
        navigate(temporadaId ? `/dashboard/temporadas/editar/${temporadaId}` : '/dashboard/temporadas/nuevo');
    };

    // Funciones para navegación de recompensas
    const handleShowListRecompensa = () => {
        navigate('/dashboard/recompensas');
    };

    const handleShowFormRecompensa = (recompensaId = null) => {
        navigate(recompensaId ? `/dashboard/recompensas/editar/${recompensaId}` : '/dashboard/recompensas/nuevo');
    };

    // Funciones para navegación de acciones ecológicas
    const handleShowListAccion = () => {
        navigate('/dashboard/acciones');
    };

    const handleShowFormAccion = (accionId = null) => {
        navigate(accionId ? `/dashboard/acciones/editar/${accionId}` : '/dashboard/acciones/nuevo');
    };

    // Funciones para navegación de usuarios
    const handleShowListUsuario = () => {
        navigate('/dashboard/usuarios');
    };

    const handleShowFormUsuario = (usuarioId = null) => {
        navigate(usuarioId ? `/dashboard/usuarios/editar/${usuarioId}` : '/dashboard/usuarios/nuevo');
    };

    return (
        <Container fluid>
            <Row>
                {/* Sidebar */}
                <Col md={2} className="bg-dark text-white py-3 min-vh-100">
                    <h3 className="text-center mb-4">EcoRank</h3>
                    <Nav className="flex-column">
                        {userRole === 'empleado' && (
                            <>
                                <Nav.Link 
                                    className={`text-white mb-2 ${isActive('/dashboard/temporadas') ? 'active' : ''}`}
                                    onClick={handleShowListTemporada}
                                >
                                    <FaCalendarAlt className="me-2" />
                                    Temporadas
                                </Nav.Link>

                                <Nav.Link 
                                    className={`text-white mb-2 ${isActive('/dashboard/recompensas') ? 'active' : ''}`}
                                    onClick={handleShowListRecompensa}
                                >
                                    <FaGift className="me-2" />
                                    Recompensas
                                </Nav.Link>

                                <Nav.Link 
                                    className={`text-white mb-2 ${isActive('/dashboard/acciones') ? 'active' : ''}`}
                                    onClick={handleShowListAccion}
                                >
                                    <FaLeaf className="me-2" />
                                    Acciones Ecológicas
                                </Nav.Link>

                                <Nav.Link 
                                    className={`text-white mb-2 ${isActive('/dashboard/usuarios') ? 'active' : ''}`}
                                    onClick={handleShowListUsuario}
                                >
                                    <FaUsers className="me-2" />
                                    Usuarios
                                </Nav.Link>
                            </>
                        )}

                        <Nav.Link 
                            className={`text-white mb-2 ${isActive('/dashboard/ranking') ? 'active' : ''}`}
                            onClick={() => navigate('/dashboard/ranking')}
                        >
                            <FaTrophy className="me-2" />
                            Ranking
                        </Nav.Link>
                    </Nav>

                    <div className="mt-auto">
                        <Button 
                            variant="outline-light" 
                            className="w-100"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </Button>
                    </div>
                </Col>

                {/* Contenido principal */}
                <Col md={10} className="py-3">
                    <Outlet context={{
                        handleShowFormTemporada,
                        handleShowFormRecompensa,
                        handleShowFormAccion,
                        handleShowFormUsuario
                    }} />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;