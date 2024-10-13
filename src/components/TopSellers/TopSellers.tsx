import React, {useState, useEffect, FC} from 'react';
import './TopSellers.css';
import {animated, useTransition} from "@react-spring/web";

const CARD_WIDTH = 250;
const X_TRANSITION = 150;

interface HomeProps {
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

const TopSellers: FC<HomeProps> = ({products}) => {

    const [topSellersProducts, setTopSellersProducts] = useState(getDataFromIndex(products, 0));

    useEffect(() => {
        let index = 1;
        const interval = setInterval(() => {
            setTopSellersProducts(getDataFromIndex(products, index));
            index++;
            if (index >= products.length) {
                index = 0;
            }
        }, 2500);

        return () => clearInterval(interval); // Cleanup the interval
    }, [products]);

    const transitions = useTransition(
        topSellersProducts.map((item, i) => ({
            ...item,
            x: i * CARD_WIDTH,
            scale: i !== 1 ? 0.8 : 1,
        })),
        {
            from: ({x}) => ({x: x + X_TRANSITION, opacity: 0, scale: 0.6}),
            enter: ({x, scale}) => ({x, opacity: 1, scale}),
            leave: ({x}) => ({x: x - X_TRANSITION, opacity: 0, scale: 0.6}),
            update: ({x, scale}) => ({x, scale}),
            keys: ({index}) => index,
        }
    );

    return (
        <div className="cards">
            {transitions((style, item) => (
                <animated.div
                    className="card"
                    style={{'--url': `url(${item.imageURL})`, ...style} as any}
                />
            ))}
        </div>
    );
};

const getDataFromIndex = (products: any, initialIndex: any) => {
    const productsData = products.map((product: Product, index: number) => {
        return {
            index: index,
            imageURL: product.previewUrl
        }
    });
    const result = [];
    let index = initialIndex;
    for (let i = 0; i < productsData.length; i++) {
        if (index >= productsData.length) {
            index = 0;
        }
        result.push(productsData[index]);
        if (result.length === 3) {
            break;
        }
        index++;
    }

    return result;
};

export default TopSellers;

