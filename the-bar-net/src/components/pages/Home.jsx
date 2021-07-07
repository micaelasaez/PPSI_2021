import React, { useContext, useEffect, useState } from 'react';
import '../styles.css';
import { Loading } from '../Loading';
import CarouselHome from '../CarouselHome';
import { Footer } from '../Footer';
import Categories from '../Categories';
import { TheNetBar } from '../context/TheNetBarContext';
import { useHistory } from 'react-router-dom';

export default function Home({ carritoTotal, isLogged, ...props }) {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(TheNetBar.Context);
    const history = useHistory();

    useEffect(() => {
        console.log(user)
        // setTimeout(() => {
        //     setIsLoading(false);
        // }, 1000)
        let route = '';
        switch (user.tipo) {
            case 'admin':
                route = "/home-admin";
                break;
            case 'encargado':
                route = "/home-encargado";
                break;
            case 'empleado':
                route = "/home-empleado";
                break;
            case 'repartidor':
                route = "/home-repartidor";
                break;
            case 'cliente':
                route = "/home";
                break;

            default:
                route = "/home";
                break;
        }
        history.push(route);
    }, [history, user])

    return (
        <div style={{ miHeight: "100%" }}>
            {isLoading
                ? <div className="loading-spinner">
                    <Loading />
                    {/* <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /> */}
                </div>
                : <div>
                    <div style={{ marginTop: "20px" }}>
                        <CarouselHome />
                    </div>
                    <div style={{ marginTop: "80px", marginBottom: "30px" }}>
                        <h1 className="tittle-style">
                            CATEGORÍAS
                        </h1>
                        <Categories />
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <Footer />
                    </div>
                </div>
            }
        </div>
    )
}