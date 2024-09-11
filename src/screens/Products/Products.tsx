import React, { FC } from 'react';
import './Products.css';

interface ProductsProps {param1:number}

const Products: FC<ProductsProps> = ({param1:number}) => (
  <div className=''>
    Products Component
  </div>
);

export default Products;
