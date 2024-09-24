import React, {FC, useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Shop from "../Shop/Shop";
import TopSellers from "../../components/TopSellers/TopSellers";
import Modal from "../../components/Modal/Modal";

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

    useEffect(() => {
        setShowCartButton(cart.products.length > 0);
    }, [cart]);

    const saveProducts = useCallback((products: any[]) => {
        setProducts(products);
    }, []);

    const addToCart = useCallback(async (productId: number, quantity: number) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/cart', {
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

            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='home'>
            <div className='left-border' />
            <div className='right-border' />
            <div className='background'>
                <div className='content'>
                    <div className="nav-bar-container">
                        <a className="nav-item">Home</a>
                        <a href={`#shop-section`} className="nav-item">Shop</a>
                        <a className="nav-item">Us</a>
                        <a className="nav-item">Contact Us</a>
                    </div>
                    <TopSellers products={products} param1={1} />
                    <a href={`#shop-section`} className="view-more">View more</a>
                </div>
            </div>
            <Shop saveProducts={saveProducts} param1={1} addToCart={addToCart} />

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
                            <img src={item.product._previewUrl} alt={item.product._model} />
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

export default Home;