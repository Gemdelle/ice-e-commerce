import React, { FC, useState, useEffect, useCallback } from 'react';
import './Home.css';
import TopSellers from "../../components/TopSellers/TopSellers";
import Modal from "../../components/Modal/Modal";
import Shop from "../Shop/Shop";
import { logEvent } from "../../services/amplitude";

interface HomeProps {
    param1: number;
}

interface CartProduct {
    product: {
        _id: number;
        _model: string;
        _price: number;
        _previewUrl: string;
    };
    quantity: number;
    total_price: number;
}

interface CartState {
    products: CartProduct[];
    total_price: number;
}

const Home: FC<HomeProps> = ({ param1 }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<CartState>({ products: [], total_price: 0 });
    const [showCartButton, setShowCartButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log(products)
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('https://ice-e-commerce-back.vercel.app/api/cart');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const cartData: CartState = await response.json();
                logEvent('Cart Loaded', {
                    total_items: cartData.products.length,
                    total_price: cartData.total_price,
                    products: cartData.products.map(item => ({
                        product_id: item.product._id,
                        product_model: item.product._model,
                        quantity: item.quantity,
                        total_price: item.total_price
                    }))
                });
                setCart(cartData);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        setShowCartButton(cart.products.length > 0);
    }, [cart]);

    const saveProducts = useCallback((products: any[]) => {
        setProducts(products);
        logEvent('Page Viewed', { page: 'Home' });
    }, []);

    const addToCart = useCallback(async (productId: number, quantity: number) => {
        try {
            const response = await fetch('https://ice-e-commerce-back.vercel.app/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            logEvent('Added Product To Cart', {
                product_id: productId,
                quantity: quantity,
            });
            const data = await response.json();
            setCart(data);
        } catch (error) {
            logEvent('Error Adding Product To Cart', {
                product_id: productId,
                quantity: quantity,
            });
            console.error('Error adding product to cart:', error);
        }
    }, []);

    // const removeFromCart = useCallback(async (productId: number) => {
    //     try {
    //         const response = await fetch('https://ice-e-commerce-back.vercel.app/api/cart', {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 product_id: productId,
    //             }),
    //         });
    //
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         logEvent('Removed Product From Cart', {
    //             product_id: productId,
    //         });
    //         const data = await response.json();
    //         setCart(data);
    //     } catch (error) {
    //         logEvent('Error Removing Product From Cart', {
    //             product_id: productId,
    //         });
    //         console.error('Error removing product from cart:', error);
    //     }
    // }, []);

    const openModal = () => {
        setIsModalOpen(true);
        logEvent('Open Cart Modal', {
            total_items: cart.products.length,
            total_price: cart.total_price,
            products: cart.products.map(item => ({
                product_id: item.product._id,
                product_model: item.product._model,
                quantity: item.quantity,
                total_price: item.total_price
            }))
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        logEvent('Close Cart Modal');
    };

    return (
        <div className='home'>
            <div className='background'>
                <div className='content'>
                    <div id="inicio" className="nav-bar-container">
                        <a href={"#inicio"} className="nav-item">Inicio</a>
                        <a href={`#shop-section`} className="nav-item">Tienda</a>
                        <a href={"#compra"} className="nav-item">Comprar</a>
                        <a href={'#contact-us-section'} className="nav-item">Contacto</a>
                    </div>
                    <TopSellers products={mockedProducts}/>
                    <a href={`#shop-section`} className="view-more">Ver más</a>
                </div>
            </div>
            <Shop saveProducts={saveProducts} addToCart={addToCart}/>

            <div className={`cart-button-container ${showCartButton ? 'show' : ''}`}>
                <button className="cart-button" onClick={openModal}>
                    <span>{cart.products.length}</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2 className="cart-title">- Your Cart -</h2>
                <div className="modal-content">
                    {cart.products.map((item) => (
                        <div key={item.product._id} className="cart-item">
                            <img src={item.product._previewUrl} alt={item.product._model}/>
                            <div className="cart-item-description">
                                <div>{item.product._model}</div>
                                <div>Quantity: {item.quantity}</div>
                                <div>Price: ${item.total_price.toFixed(2)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <p><strong className="total-txt">Total: ${cart.total_price.toFixed(2)}</strong></p>
                <div className="modal-close-btn" onClick={closeModal}>Close</div>
            </Modal>
        </div>
    );
};

//TODO: Pasar a TopSellers los productos reales y no los mockeados.
const mockedProducts = [
    {
        id: 1,
        model: "stirrup",
        pattern: "Sprinkle",
        previewUrl: "https://drive.google.com/thumbnail?id=1HtmsNM_HMIBzgpLtQ6P-2N-Yf5bpjgGQ&sz=w1000&format=png",
        price: 12531,
        size: 10,
        stock: 1,
        strass_colour: "shimmering",
        strass_quantity: 80,
        type: "TIGHT"
    },
    {
        id: 1,
        model: "stirrup",
        pattern: "Sprinkle",
        previewUrl: "https://drive.google.com/thumbnail?id=1J_dAhbklNfBVXeC379i6nwivl-BJF0bB&sz=w1000&format=png",
        price: 12531,
        size: 10,
        stock: 1,
        strass_colour: "shimmering",
        strass_quantity: 80,
        type: "TIGHT"
    },
    {
        id: 1,
        model: "stirrup",
        pattern: "Sprinkle",
        previewUrl: "https://drive.google.com/thumbnail?id=1hxAY4cxvRDUFIP9HlnOXsFJmBagJO5rn&sz=w1000&format=png",
        price: 12531,
        size: 10,
        stock: 1,
        strass_colour: "shimmering",
        strass_quantity: 80,
        type: "TIGHT"
    },
    {
        id: 1,
        model: "stirrup",
        pattern: "Sprinkle",
        previewUrl: "https://drive.google.com/thumbnail?id=1Z8WI1PP8JXGxYPYvtWcxdciQmHEwuN50&sz=w1000&format=png",
        price: 12531,
        size: 10,
        stock: 1,
        strass_colour: "shimmering",
        strass_quantity: 80,
        type: "TIGHT"
    }
]

export default Home;
