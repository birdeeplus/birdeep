import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const MyNavbar = () => {
    return (
        <Navbar style={{ backgroundColor: '#708090' }} variant="dark" expand="lg">
            <Navbar.Brand href="/" style={{ lineHeight: '50px' }}>
                <img src="/images/logo.png" alt='logo' width="100" height="50" className="d-inline-block align-top"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Inicio</Nav.Link>
                    <Nav.Link href="/Microphones" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Microphones</Nav.Link>
                    <Nav.Link href="/Locations" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Locations</Nav.Link>
                    <Nav.Link href="/Processors" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Processors</Nav.Link>
                    <Nav.Link href="/Recorders" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Recorders</Nav.Link>
                    <Nav.Link href="/Recordings" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Recordings</Nav.Link>
                    <Nav.Link href="/Diagnostics" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Diagnostics</Nav.Link>
                    <Nav.Link href="/Species" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Species</Nav.Link>
                    <Nav.Link href="/SingEvents" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Sing Events</Nav.Link>
                    <Nav.Link href="/Upload_singEvent" style={{ lineHeight: '50px', color: 'white', fontWeight: 'bold' }}>Upload Labels</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default MyNavbar;