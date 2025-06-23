import React from 'react';
import styles from '../styles/Calculator.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'secondary' | 'equals';
  wide?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant, wide }) => {
  return (
    <button
      className={`${styles.button} ${variant ? styles[variant] : ''} ${wide ? styles.wide : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;