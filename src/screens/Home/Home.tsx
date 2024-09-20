import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import './Home.css';

interface HomeProps {
    param1: number
}

const Home: FC<HomeProps> = ({param1: number}) => {
    const navigate = useNavigate();
    const goToShop = (event: any) => {
        event.preventDefault()
        navigate('/shop');
    }

    return (
        <div className='background'>
            <div onClick={goToShop} className="shop-btn"/>
        </div>
    );
};

export default Home;
