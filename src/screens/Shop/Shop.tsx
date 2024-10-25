import React, { FC, useCallback, useEffect, useState } from 'react';
import './Shop.css';
import Sparkles from "../../components/Sparkles/Sparkles";
import { FaWhatsapp } from "react-icons/fa";
import Modal from "../../components/Modal/Modal";

interface ProductsProps {
    saveProducts: (products: ProductItem[]) => void;
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
    pattern_elements: string[];
}

interface GloveProduct {
    id: number;
    type: string;
    previewUrl: string;
    colour: string;
    model: string;
    pattern: string;
    price: number;
    colour_code: string;
    default_colour_code: string;
    pattern_elements: string[];
}

type Product = TightProduct | GloveProduct;

interface ProductItem {
    id: number;
    type: string;
    model: string;
    pattern: string;
    price: number;
    previewUrls: string[];
    colourCodes: string[];
    currentPreviewUrl: string;
    currentColourCode?: string;
    patternElements: string[];
}

const Shop: FC<ProductsProps> = React.memo(({ saveProducts, addToCart }) => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [productDescription, setProductDescription] = useState<ProductItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [currentPatternElement, setCurrentPatternElement] = useState<string | null>(null);
    const [patternInterval, setPatternInterval] = useState<number | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://ice-e-commerce-back.vercel.app/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data: Product[] = await response.json();

                const groupedProducts = data.reduce((acc: Record<string, ProductItem>, product) => {
                    const uniqueKey = `${product.id}-${product.type}`;

                    if (!acc[uniqueKey]) {
                        acc[uniqueKey] = {
                            id: product.id,
                            type: product.type,
                            model: product.model,
                            pattern: product.pattern,
                            price: product.price,
                            previewUrls: [product.previewUrl],
                            colourCodes: product.type === 'GLOVE' ? [(product as GloveProduct).colour_code] : [],
                            currentPreviewUrl: product.previewUrl,
                            currentColourCode: product.type === 'GLOVE' ? (product as GloveProduct).colour_code : undefined,
                            patternElements: product.pattern_elements || [],
                        };
                    } else {
                        acc[uniqueKey].previewUrls.push(product.previewUrl);
                        if (product.type === 'GLOVE') {
                            acc[uniqueKey].colourCodes.push((product as GloveProduct).colour_code);
                        }
                    }
                    return acc;
                }, {});

                const productItems = Object.values(groupedProducts);
                setProducts(productItems);
                saveProducts(productItems.slice(-3));
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchProducts();
    }, [saveProducts]);


    const openDescriptionModal = (product: ProductItem) => {
        setProductDescription(product);
        setIsDescriptionModalOpen(true);

        if (product.patternElements.length > 1) {
            let index = 0;
            setCurrentPatternElement(product.patternElements[index]);
            const intervalId = window.setInterval(() => {
                index = (index + 1) % product.patternElements.length;
                setCurrentPatternElement(product.patternElements[index]);
            }, 1500);
            setPatternInterval(intervalId);
        } else {
            setCurrentPatternElement(product.patternElements[0]);
        }
    };

    const closeModal = () => {
        setIsDescriptionModalOpen(false);
        if (patternInterval) {
            window.clearInterval(patternInterval);
            setPatternInterval(null);
        }
        setCurrentPatternElement(null);
    };

    const changePreviewUrl = (productId: number, newUrl: string) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId && product.previewUrls.length > 1
                    ? {
                        ...product,
                        currentPreviewUrl: newUrl,
                        currentColourCode: product.colourCodes[product.previewUrls.indexOf(newUrl)]
                    }
                    : product
            )
        );
    };

    const renderProduct = useCallback((product: ProductItem, index: number) => {
        return (
            <div key={`${product.id}-${product.type}`} className="product-item">
                <div className="product-price">${product.price}</div>
                <img className={product.type === "TIGHT" ? "tight" : "glove"} src={product.currentPreviewUrl} alt={product.model} />
                <div className="bottom-product-item">
                    <div className="product-pattern-name">{product.pattern}</div>
                    <div className="add-to-cart" onClick={() => openDescriptionModal(product)}>Ver más</div>
                </div>
                {product.type === "GLOVE" && product.previewUrls.length > 1 && (
                    <div className="colors-container">
                        {product.previewUrls.map((url, i) => (
                            <div key={i} className="color-frame" onClick={() => changePreviewUrl(product.id, url)}>
                                <div className="color" style={{ backgroundImage: `url(${url})`, backgroundColor: product.colourCodes[i] }}></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }, []);

    return (
        <div id="shop-section" className='shop-background'>
            <div className="shop-title">Tienda</div>
            <div className="lace-shop"></div>
            <div className="main-tienda"></div>
            {products.length > 0 ? <Sparkles snowflakeCount={10} /> : null}
            <div className="products-container">
                {products.map((product: ProductItem, index: number) => renderProduct(product, index))}
            </div>
            {error && <div className="error-message">{error}</div>}
            <div id="contact-us-section" className='contact-section'>
                <div className="contact-title">Contacto</div>
                <div className="whassap-container">
                    <a href={`https://wa.me/541141414912`} target="_blank" rel="noopener noreferrer" style={styles.container}>
                        <FaWhatsapp size={24} style={styles.icon} />
                        <span style={styles.number}>+54 11 4141 4912</span>
                    </a>
                </div>
            </div>
            {productDescription && (
                <Modal isOpen={isDescriptionModalOpen} onClose={closeModal}>
                    <div className="modal-content description">
                        <div className='description-img-container'>
                            <img src={productDescription.currentPreviewUrl} alt={productDescription.model} />
                        </div>
                        <div className='description-container'>
                            <div>{productDescription.type}</div>
                            <div className='inline-model'>
                                <div>{productDescription.id}</div>
                                <div>{productDescription.model}</div>
                                <div>{productDescription.pattern}</div>
                            </div>
                            {productDescription.patternElements.length > 0 && (
                                <div className='elements-container'>
                                    {currentPatternElement && (
                                        <img src={currentPatternElement} alt="Pattern Element" className='pattern-image' />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-close-btn description-close-button" onClick={closeModal}>Close</div>
                </Modal>
            )}
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