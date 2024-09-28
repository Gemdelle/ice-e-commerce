import React, {useState, useEffect, FC} from 'react';
import './TopSellers.css';
import {useNavigate} from "react-router-dom";
interface HomeProps {
    param1: number,
    products: any
}
interface TightProduct {
    type: string;
    previewUrl: string;
    size: string;
    model: string;
    pattern: string;
    price: number;
    stock: number;
    strass_quantity: number;
    strass_colour: string;
}

interface GloveProduct {
    type: string;
    previewUrl: string;
    colour: string;
    model: string;
    pattern: string;
    price: number;
    stock: number;
    gem_stone: string;
    gem_colour: string;
    gem_opacity: number;
    strass_colour: string;
    strass_quantity: number;
}
type Product = TightProduct | GloveProduct;
const TopSellers: FC<HomeProps> = ({param1, products}) => {
    const renderProduct = (product: Product, index:number) => {
        console.log(product.model)
        if (product.type === 'TIGHT') {
            const tight = product as TightProduct;
            return (
                <div key={tight.model+index} id={index == 1 ? "middle-product" : ""} className="top-seller-product-item">
                    <img src={tight.previewUrl} alt={tight.model} />
                </div>
            );
        } else if (product.type === 'GLOVE') {
            const glove = product as GloveProduct;
            return (
                <div key={glove.model} id={index == 1 ? "middle-product" : ""} className="top-seller-product-item">
                    <img src={glove.previewUrl} alt={glove.model} />
                </div>
            );
        } else {
            console.log("ERROR")
        }
    };
    return (
        <div className='top-sellers-background'>
            {products.map((product: Product, index:number) => {
                return renderProduct(product, index);
            })}
        </div>
    );
};

export default TopSellers;