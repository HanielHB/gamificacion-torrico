import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaLeaf, FaGift, FaCalendarAlt, FaTrophy, FaBars, FaExchangeAlt} from 'react-icons/fa';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [userRole, setUserRole] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setUserRole(role)

        if (!token) {
        navigate('/');
        return;
        }
        setUserRole(role);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const isActive = (path) => location.pathname.includes(path);

    // Navegación...
    const handleShowListTemporada = () =>
        navigate('/dashboard/temporadas');
    const handleShowFormTemporada = (id = null) =>
        navigate(id ? `/dashboard/temporadas/editar/${id}` : '/dashboard/temporadas/nuevo');

    const handleShowListRecompensa = () =>
        navigate('/dashboard/recompensas');
    const handleShowFormRecompensa = (id = null) =>
        navigate(id ? `/dashboard/recompensas/editar/${id}` : '/dashboard/recompensas/nuevo');

    const handleShowCanjeables = () =>
+       navigate('/dashboard/recompensas/canjeables');

    const handleShowListAccion = () =>
        navigate('/dashboard/acciones');
    const handleShowFormAccion = (id = null) =>
        navigate(id ? `/dashboard/acciones/editar/${id}` : '/dashboard/acciones/nuevo');

    const handleShowListUsuario = () =>
        navigate('/dashboard/usuarios');
    const handleShowFormUsuario = (id = null) =>
        navigate(id ? `/dashboard/usuarios/editar/${id}` : '/dashboard/usuarios/nuevo');

    return (
        <Container fluid>
        <Row>
            {/* Sidebar col (toggleable) */}
            {showSidebar && (
            <Col
                md={2}
                className="bg-dark text-white py-3 min-vh-100 d-flex flex-column"
            >
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
                        className={`text-white mb-2 ${isActive('/dashboard/recompensas') ? 'active' : ''}`}
                        onClick={handleShowListRecompensa}
                    >
                        <FaGift className="me-2" />
                        Recompensas
                    </Nav.Link>
                <Nav.Link
                    className={`text-white mb-2 ${isActive('/dashboard/ranking') ? 'active' : ''}`}
                    onClick={() => navigate('/dashboard/ranking')}
                >
                    <FaTrophy className="me-2" />
                    Ranking
                </Nav.Link>
                <Nav.Link
                    className={`text-white mb-2 ${isActive('/dashboard/recompensas/canjeables') ? 'active' : ''}`}
                    onClick={handleShowCanjeables}
                    >
                    <FaExchangeAlt className="me-2" />
                    Canjeables
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
            )}
            {/* Main content */}
            <Col md={showSidebar ? 10 : 12} className="py-3">
            <div className="d-flex mb-3">
                <Button
                variant="secondary"
                onClick={() => setShowSidebar(v => !v)}
                >
                <FaBars /> {showSidebar ? 'Ocultar' : 'Mostrar'} menú
                </Button>
            </div>
            <Outlet context={{
                handleShowFormTemporada,
                handleShowFormRecompensa,
                handleShowFormAccion,
                handleShowFormUsuario,
                userRole
            }} />
            </Col>
        </Row>
        </Container>
    );
};

export default Dashboard;
