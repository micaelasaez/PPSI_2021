import React, { useEffect, useState } from 'react';
import '../styles.css';
import { Loading } from '../Loading';
import CarouselHome from '../CarouselHome';
import { Footer } from '../Footer';
import Categories from '../Categories';

export default function Home({ carritoTotal, isLogged, ...props }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [])

    return (
        <>
            {isLoading
                ? <div className="loading-spinner">
                    <Loading /> <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                </div>
                : <div>
                    <div style={{ marginTop: "20px"}}>
                        <CarouselHome />
                    </div>
                    <div style={{ marginTop: "80px", marginBottom: "30px"}}>
                        <h1>Categorías</h1>
                    </div>
                    <Categories />
                    <div style={{ marginTop: "20px"}}>
                        <Footer />
                    </div>
                </div>
            }
        </>
    )
}