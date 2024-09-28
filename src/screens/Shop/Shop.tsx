import React, {FC, useCallback, useEffect, useState} from 'react';
import './Shop.css';
import Sparkles from "../../components/Sparkles/Sparkles";

interface ProductsProps {
    param1: number;
    saveProducts: (products: Product[]) => void;
    addToCart: (productId: number, quantity: number) => Promise<void>;
}

interface TightProduct {
    id: number;
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
    id: number;
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

const Shop: FC<ProductsProps> = React.memo(({ param1, saveProducts, addToCart }) => {
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
    }, [saveProducts]);

    const handleAddToCart = useCallback((productId: number) => {
        addToCart(productId, 1);
    }, [addToCart]);

    const renderProduct = useCallback((product: Product, index: number) => {
        return (
            <div key={product.model + index} className="product-item">
                <img src={product.previewUrl} alt={product.model} />
                <div className='bottom-product-item'>
                    <div>Model: {product.model}</div>
                    <div>Price: ${product.price}</div>
                    <div className='add-to-cart' onClick={() => handleAddToCart(product.id)}>Add to Cart</div>
                </div>
            </div>
        );
    }, [handleAddToCart]);

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
                {products.map((product: Product, index: number) => renderProduct(product, index))}
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
});

export default Shop;