import React, {FC, useCallback, useEffect, useState} from 'react';
import './Shop.css';
import Sparkles from "../../components/Sparkles/Sparkles";
import {FaWhatsapp} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";

interface ProductsProps {
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

const Shop: FC<ProductsProps> = React.memo(({saveProducts, addToCart}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productDescription, setProductDescription ] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://ice-e-commerce-back.vercel.app/api/products');
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
        addToCart(productId, quantity);
        setQuantity(1);
    }, [addToCart, quantity]);

    const openDescriptionModal = (product: Product) => {
        setProductDescription(product);
        setQuantity(1);
        setIsDescriptionModalOpen(true);
    };

    const closeModal = () => {
        setIsDescriptionModalOpen(false);
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : prev));
    };

    const changeColor = (index: number) => {
        // Generate a random width and height between 200 and 300
        const randomWidth = Math.floor(Math.random() * 100) + 200;
        const randomHeight = Math.floor(Math.random() * 100) + 200;
        const randomImageUrl = `https://picsum.photos/${randomWidth}/${randomHeight}`;

        setProducts(prevProducts =>
            prevProducts.map((product, i) =>
                i === index
                    ? { ...product, previewUrl: randomImageUrl }
                    : product
            )
        );
    };

    const renderProduct = useCallback((product: Product, index: number) => {
        return (
            <div key={product.model + index} className="product-item">
                <div className={'product-price'}>${product.price}</div>
                <img className={product.type === "TIGHT"? "tight" : "glove"} src={product.previewUrl} alt={product.model}/>
                <div className='bottom-product-item'>
                    <div className="product-pattern-name">{product.pattern}</div>
                    <div className='add-to-cart' onClick={() => openDescriptionModal(product)}>Ver más</div>
                </div>
                <div className="colors-container">
                    <div className="color red" onClick={()=> changeColor(index)}></div>
                    <div className="color blue" onClick={()=> changeColor(index)}></div>
                    <div className="color green" onClick={()=> changeColor(index)}></div>
                    <div className="color purple" onClick={()=> changeColor(index)}></div>
                </div>
            </div>
        );
    }, []);

    return (
        <div id="shop-section" className='shop-background'>
            <div className="shop-title">Tienda</div>
            <div className="lace-shop"></div>
            <div className="main-tienda"></div>
            {products.length > 0 ? <Sparkles snowflakeCount={10}/> : null}
            <div className="products-container">
                {products.map((product: Product, index: number) => renderProduct(product, index))}
            </div>
            {error && <div className="error-message">{error}</div>}
            <div id="contact-us-section" className='contact-section'>
                <div className="contact-title">Contacto</div>
                <div className="whassap-container">
                    <a href={`https://wa.me/541141414912`} target="_blank" rel="noopener noreferrer"
                       style={styles.container}>
                        <FaWhatsapp size={24} style={styles.icon}/>
                        <span style={styles.number}>+54 11 4141 4912</span>
                    </a>
                </div>
            </div>
            {(productDescription) ?
                (productDescription.type === "TIGHT") ?
                    <Modal isOpen={isDescriptionModalOpen} onClose={closeModal}>
                        <div className="modal-content description">
                            <div className='description-img-container'>
                                <img src={productDescription.previewUrl} alt={productDescription.model}/>
                            </div>
                            <div className='description-container'>
                                <div>{productDescription.type}</div>
                                <div className='inline-model'>
                                    <div>{productDescription.id}</div>
                                    <div>{productDescription.model}</div>
                                    <div>{productDescription.pattern}</div>
                                </div>
                                <div>Cantidad de Strass: {productDescription.strass_quantity}</div>
                                <div>Stock: {productDescription.stock}</div>

                                <div className='colour-section'>
                                    <div>Color de strass</div>
                                    <div className='colour'>
                                        <div className='tight-colour'>
                                            <div className='colour-crystal'></div>
                                            <div className='colour-shimmering'></div>
                                        </div>
                                    </div>
                                </div>

                                <div className='checkout-section'>
                                    <div className='quantity-section'>
                                        <div>Cantidad</div>
                                        <div className='quantity-controls'>
                                            <div onClick={decrementQuantity}>-</div>
                                            <div>{quantity}</div>
                                            <div onClick={incrementQuantity}>+</div>
                                        </div>
                                    </div>
                                    <div className='buy-section'>
                                        <div>${(productDescription.price * quantity).toFixed(2)}</div>
                                        <div className='buy-btn'
                                             onClick={() => handleAddToCart(productDescription.id)}>Agregar al Carrito
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-close-btn description-close-button" onClick={closeModal}>Close</div>
                    </Modal> :

                    <Modal isOpen={isDescriptionModalOpen} onClose={closeModal}>
                        <div className="modal-content description">
                            <div className='description-img-container'>
                                <img src={productDescription.previewUrl} alt={productDescription.model}/>
                            </div>
                            <div className='description-container'>
                                <div>{productDescription.type}</div>
                                <div className='inline-model'>
                                    <div>{productDescription.id}</div>
                                    <div>{productDescription.model}</div>
                                    <div>{productDescription.pattern}</div>
                                </div>
                                <div>Cantidad de Strass: {productDescription.strass_quantity}</div>
                                <div>Stock: {productDescription.stock}</div>

                                <div className='colour-section'>
                                    <div>Color de strass</div>
                                    <div className='colour'>
                                        <div className='tight-colour'>
                                            <div className='colour-crystal'></div>
                                            <div className='colour-shimmering'></div>
                                        </div>
                                    </div>
                                </div>

                                <div className='checkout-section'>
                                    <div className='quantity-section'>
                                        <div>Cantidad</div>
                                        <div className='quantity-controls'>
                                            <div onClick={decrementQuantity}>-</div>
                                            <div>{quantity}</div>
                                            <div onClick={incrementQuantity}>+</div>
                                        </div>
                                    </div>
                                    <div className='buy-section'>
                                        <div>${(productDescription.price * quantity).toFixed(2)}</div>
                                        <div className='buy-btn'
                                             onClick={() => handleAddToCart(productDescription.id)}>Agregar al Carrito
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-close-btn description-close-button" onClick={closeModal}>Close</div>
                    </Modal> : null
            }
        </div>
    );
});


const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#e3e6d9',
    },
    icon: {
        marginRight: '8px',
    },
    number: {
        fontSize: '4vh',
    },
};

export default Shop;