import React, { FC } from 'react';
import './Home.css';

interface HomeProps {param1:number}

const Home: FC<HomeProps> = ({param1:number}) => (
  <div className=''>
    Home Component
  </div>
);

export default Home;
