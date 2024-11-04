import { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import profileImage from '../../assets/images/user.png';
import { useDispatch } from "react-redux";
import { logout } from "../../utils/redux/authSlice";
import './index.css';

const Header = () => {
    const dispatch = useDispatch();
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

    return (
        <div onMouseEnter={showHeader} onMouseLeave={hideHeader}>
            <Navbar fixed="top" expand="lg" className={`bg-body-tertiary ${isVisible ? 'visible' : 'hidden'}`}>
                <Container>
                    <Navbar.Brand href="#home">Sat Nirankari Mission</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href="/device-list">Device List</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" className="bg-transparent border-0">
                            <img src={profileImage} alt="Profile" className="rounded-circle" width="40" height="40" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;
