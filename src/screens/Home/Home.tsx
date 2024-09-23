import React, {FC, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Home.css';
import Shop from "../Shop/Shop";
import TopSellers from "../../components/TopSellers/TopSellers";
import Mist from "../../components/Mist/Mist";

interface HomeProps {
    param1: number
}

const Home: FC<HomeProps> = ({param1: number}) => {
    const [products, setProducts] =  useState<any[]>([])

    const saveProducts = (products: any[])=> {
        setProducts(products);
    }
    
    return (
        <div className='home'>
            {/*<Mist side={'left'} param1={1}/>*/}
            {/*<Mist side={'right'} param1={1}/>*/}
            <div className='left-border' />
            <div className='right-border' />
            <div className='background'>
                <div className='content'>
                    <div className="nav-bar-container">
                        <a  className="nav-item">Home</a>
                        <a href={`#shop-section`} className="nav-item">Shop</a>
                        <a className="nav-item">Us</a>
                        <a className="nav-item">Contact Us</a>
                    </div>
                    <TopSellers products={products} param1={1}/>
                    <a href={`#shop-section`} className="view-more">View more</a>
                </div>
            </div>
            <Shop saveProducts={saveProducts}  param1={1}/>
        </div>
    );
};

export default Home;
