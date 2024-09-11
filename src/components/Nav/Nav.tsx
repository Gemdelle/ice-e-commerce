import React, { FC } from 'react';
import styles from './Nav.module.css';

interface NavProps {}

const Nav: FC<NavProps> = () => (
  <div className={styles.Nav}>
    Nav Component
  </div>
);

export default Nav;
