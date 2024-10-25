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
                        if (product.type === 'GLOVE') {
                            const gloveProduct = product as GloveProduct;
                            // Find the preview URL that corresponds to the default color code
                            const defaultPreviewUrl = data.find((p) => {
                                if (p.type === 'GLOVE') {
                                    const gloveP = p as GloveProduct;
                                    return (
                                        gloveP.id === product.id &&
                                        gloveP.colour_code === gloveProduct.default_colour_code
                                    );
                                }
                                return false;
                            })?.previewUrl || gloveProduct.previewUrl;

                            acc[uniqueKey] = {
                                id: product.id,
                                type: product.type,
                                model: product.model,
                                pattern: product.pattern,
                                price: product.price,
                                previewUrls: [gloveProduct.previewUrl],
                                colourCodes: [gloveProduct.colour_code],
                                currentPreviewUrl: defaultPreviewUrl,
                                currentColourCode: gloveProduct.default_colour_code,
                                patternElements: product.pattern_elements || [],
                            };
                        } else {
                            acc[uniqueKey] = {
                                id: product.id,
                                type: product.type,
                                model: product.model,
                                pattern: product.pattern,
                                price: product.price,
                                previewUrls: [product.previewUrl],
                                colourCodes: [],
                                currentPreviewUrl: product.previewUrl,
                                patternElements: product.pattern_elements || [],
                            };
                        }
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

    // Rest of the component remains the same...
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
            <div className="shop-tooltips-container">
                <div className="shop-tooltips">*Después de un par de lavados se estiran</div>
                <div className="shop-tooltips">*Ante la duda, comprar el talle más grande</div>
                <div className="shop-tooltips">*Lavar a mano para evitar posibles deterioros</div>
                <div className="shop-tooltips">*Estamos trabajando para conseguir una mayor variedad de talles</div>
                <div className="shop-gift">Te regalamos un service de strass gratuito hasta los 6 meses realizada tu compra</div>
            </div>
            {products.length > 0 ? <Sparkles snowflakeCount={10} /> : null}
            <div className="products-container">
                {products.map((product: ProductItem, index: number) => renderProduct(product, index))}
            </div>
            {error && <div className="error-message">{error}</div>}
            <div id="compra" className="como-comprar-container">
                <div className="como-comprar-tooltips-preguntas">¿Cómo compro?</div>
                <div className="como-comprar-tooltips-respuestas">&nbsp;Escribinos por whatsapp con el nombre / ID del producto que querés junto con sus especificaciones (por ejemplo, medias Gradient o guantes Marquise con gema de cristal en rosa)</div>
                <div className="como-comprar-tooltips-preguntas">¿Cómo pago?</div>
                <div className="como-comprar-tooltips-respuestas">&nbsp;Mediante transferencia por Mercado Pago. Una vez solicitado el pedido vía whatsapp, te enviamos la cuenta para realizar la transferencia.</div>
                <div className="como-comprar-tooltips-preguntas">¿Cómo se realiza la entrega?</div>
                <div className="como-comprar-tooltips-respuestas">&nbsp;Por el momento no contamos con delivery, los productos se entregan en mano los días sábados en la pista de hielo Margal o días a convenir en Fantasy Skate.</div>
                <div className="como-comprar-tooltips-preguntas">¿Cuánto tardo en recibir el pedido?</div>
                <div className="como-comprar-tooltips-respuestas">&nbsp;Una vez realizado el pedido, dentro de los 2 días estará listo para la entrega; el día de la entrega dependerá del día en el que se haya realizado el pedido, según el lugar de entrega al que se asista de manera más próxima.</div>
                <div className="como-comprar-tooltips-preguntas">¿Los productos tienen garantía?</div>
                <div className="como-comprar-tooltips-respuestas">&nbsp;Te regalamos un service que podés utilizar hasta los 6 meses de haber comprado el producto en el caso de que se despegue algún cristal.</div>
                <div className="como-comprar-tooltips-preguntas">¿Puedo cambiar un producto?</div>
                <div className="como-comprar-tooltips-respuestas">&nbsp;Sí, en el caso de haber comprado un par de medias y el talle no te sea cómodo, podés solicitar un cambio por otro talle, siempre y cuando sea del mismo producto. Los guantes no tienen cambio ya que son talle ÚNICO.</div>
            </div>
            <div id="contact-us-section" className='contact-section'>
                <div className="contact-title">Contacto</div>
                <div className="whassap-container">
                    <a href={`https://wa.me/541141414912`} target="_blank" rel="noopener noreferrer" style={styles.container}>
                        <FaWhatsapp size={24} style={styles.icon} />
                        <span style={{ fontSize: '4vh', fontFamily: 'Moderne Fraktur' }}>+54 11 4141 4912</span>
                    </a>
                </div>
            </div>
            <div className="footer" />
            {productDescription && (
                <Modal isOpen={isDescriptionModalOpen} onClose={closeModal}>
                    <div className="modal-content description">
                        <div className='description-img-container'>
                            <img src={productDescription.currentPreviewUrl} alt={productDescription.model} />
                        </div>
                        <div className='description-container'>
                            <div className='inline-model'>
                                <div className="product-id-pattern-description">#G{productDescription.id} {productDescription.pattern}</div>
                                <div className="product-model-description">{productDescription.model}</div>
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