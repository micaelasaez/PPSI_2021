import React, { useEffect, useState, useCallback } from 'react';
import '../styles.css';
import { Loading } from '../commons/Loading';
import CarouselHome from '../CarouselHome';
import { Header } from '../Header';
import { Footer } from '../Footer';
import Categories from '../Categories';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000)
    }, [])

    const onSelectOfertas = useCallback(() => {
        console.log("ofertas")
    }, []);

    const onSelectCombos = useCallback(() => {
        console.log("combos")
    }, []);

    return (
        <>
            <Header total={0} />
            {isLoading
                ? <div className="loading-spinner">
                    <Loading />
                </div>
                : <div>
                    <div style={{ marginTop: "20px"}}>
                        <CarouselHome onSelectOfertas={onSelectOfertas} onSelectCombos={onSelectCombos} />
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