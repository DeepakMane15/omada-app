import { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import profileImage from '../../assets/images/user.png';
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUserData } from "../../utils/redux/authSlice";
import './index.css';
import store from "../../utils/redux/store";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const dispatch = useDispatch();
    const userData = selectUserData(store.getState());
    const [isVisible, setIsVisible] = useState(false); // State to control visibility

    const handleLogout = () => {
        dispatch(logout());
    };

    // Functions to handle mouse events
    const showHeader = () => {
        setIsVisible(true);
    };

    const hideHeader = () => {
        setIsVisible(false);
    };

    const location = useLocation();

    const isLinkActive = (path) => location.pathname === path ? 'activated' : '';

    return (
        <div onMouseEnter={showHeader} onMouseLeave={hideHeader}>
            <Navbar fixed="top" expand="lg" className={`bg-body-tertiary ${isVisible ? 'visible' : 'hidden'}`}>
                <Container>
                    <Navbar.Brand href="#home">Sant Nirankari Mission</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/home" className={isLinkActive('/home')}>Home</Nav.Link>
                            <Nav.Link as={Link} to="/device-list" className={isLinkActive('/device-list')}>Device List</Nav.Link>
                            {/* <Nav.Link as={Link} to="/prtg" className={isLinkActive('/prtg')}>PRTG Map</Nav.Link> */}
                            <Nav.Link as={Link} to="/prtg-list" className={isLinkActive('/prtg-list')}>PRTG List</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" className="bg-transparent border-0">
                            <img src={profileImage} alt="Profile" className="rounded-circle" width="40" height="40" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <p className="usertype-help-text">{userData?.user_type}</p>
                            <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;
