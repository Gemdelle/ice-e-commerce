import React, {FC, useEffect, useState} from 'react';
import './Shop.css';
import Sparkles from "../../components/Sparkles/Sparkles";

interface ProductsProps {param1:number, saveProducts: any}

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

const Shop: FC<ProductsProps> = ({param1, saveProducts}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data: Product[] = await response.json();
                setProducts(data);
                saveProducts(data.slice(-3));
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchProducts();
    }, []);

    const renderProduct = (product: Product, index:number) => {
        console.log(product.model)
        if (product.type === 'TIGHT') {
            const tight = product as TightProduct;
            return (
                <div key={tight.model+index} className="product-item">
                    <img src={tight.previewUrl} alt={tight.model} />
                    {/*<p>Size: {tight.size}</p>*/}
                    {/*<p>Model: {tight.model}</p>*/}
                    {/*<p>Pattern: {tight.pattern}</p>*/}
                    {/*<p>Price: ${tight.price}</p>*/}
                    {/*<p>Stock: {tight.stock}</p>*/}
                    {/*<p>Strass Quantity: {tight.strass_quantity}</p>*/}
                    {/*<p>Strass Colour: {tight.strass_colour}</p>*/}
                </div>
            );
        } else if (product.type === 'GLOVE') {
            const glove = product as GloveProduct;
            return (
                <div key={glove.model} className="product-item">
                    <img src={glove.previewUrl} alt={glove.model} />
                    {/*<p>Colour: {glove.colour}</p>*/}
                    {/*<p>Model: {glove.model}</p>*/}
                    {/*<p>Pattern: {glove.pattern}</p>*/}
                    {/*<p>Price: ${glove.price}</p>*/}
                    {/*<p>Stock: {glove.stock}</p>*/}
                    {/*<p>Gem Stone: {glove.gem_stone}</p>*/}
                    {/*<p>Gem Colour: {glove.gem_colour}</p>*/}
                    {/*<p>Gem Opacity: {glove.gem_opacity}</p>*/}
                    {/*<p>Strass Quantity: {glove.strass_quantity}</p>*/}
                    {/*<p>Strass Colour: {glove.strass_colour}</p>*/}
                </div>
            );
        } else {
            console.log("ERROR")
        }
    };

    return (
        <div id="shop-section" className='shop background'>
            <div className="shop-title">Shop</div>
            <div className="lace-shop"></div>
            {products.length > 0 ? <Sparkles snowflakeCount={10}/> : null}
            <div className="filters-container">
                <div>Order By</div>
                <div>Tights</div>
                <div>Gloves</div>
                <div>Strass</div>
            </div>
            <div className="products-container">
                {products.map((product: Product, index:number) => {
                    return renderProduct(product, index);
                })}
            </div>
        </div>
    );
};

export default Shop;
