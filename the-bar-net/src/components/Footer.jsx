import React from 'react';
import './styles.css';
import Navbar from 'react-bootstrap/Navbar';
import footerImg from "../utils/images/footer_bebidas.jpg";
import theNetBarLogoWhite from "../utils/images/logo_the_bar_net_white.PNG";
import Sucursal from './Sucursal';

export const Footer = () => (
    <div>
        <Navbar className={"footer-style"}>
            <Navbar.Brand href="#home" style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
                <div style={{ width: "40%" }}>
                    <img
                        alt="The Bar Net"
                        src={footerImg}
                        height="50"
                        width="80%"
                        className="d-inline-block align-top"
                    />
                </div>
                <div style={{ width: "20%" }}>
                    <img
                        alt="The Bar Net"
                        src={theNetBarLogoWhite}
                        height="30"
                        className="d-inline-block align-top"
                    />
                </div>
                <div style={{ width: "40%" }}>
                    <img
                        alt="The Bar Net"
                        src={footerImg}
                        height="50"
                        width="80%"
                        className="d-inline-block align-top"
                    />
                </div>
            </Navbar.Brand>
        </Navbar>
        <Navbar className={"footer-style"} style={{ marginTop: '0px' }}>
            <Sucursal style={{ width: '100%' }} />
        </Navbar>
    </div>
)