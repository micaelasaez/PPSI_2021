import React from 'react';
import './styles.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logoTheBarNet from "../utils/images/logo_the_bar_net.png";
import logoCarrito from "../utils/images/logo_carrito.png";

export const Header = ({ total }) => (
    <Navbar className={"header-style"}>
        <Navbar.Brand href="#home">
            <img
                alt="The Bar Net"
                src={logoTheBarNet}
                height="30"
                className="d-inline-block align-top"
            />{' '}
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
            <Nav.Link href="/home" className={"header-letters"}>INICIO</Nav.Link>
            <Nav.Link href="/not-found" className={"header-letters"}>MI CUENTA</Nav.Link>
            <Nav.Link onClick={() => console.log("close")} className={"header-letters"}>CERRAR SESIÓN</Nav.Link>
            <Nav.Link href="/not-found" className={"header-letters"}>
                <img
                    alt="The Bar Net"
                    src={logoCarrito}
                    height="30"
                    width="30"
                    className="d-inline-block align-top"
                />
                {' '}${total}
            </Nav.Link>
        </Navbar.Collapse>
    </Navbar >
)