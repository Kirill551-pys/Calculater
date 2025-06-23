import React, { useState, useEffect } from 'react';
import Button from './Button';
import styles from '../styles/Calculator.module.scss';

type Operator = '+' | '-' | '*' | '/' | null;

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const clearAll = () => {
    setDisplay('0');
    setCurrentValue(0);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleNumberInput = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleSignChange = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(formatNumber(newValue));
  };

  const formatNumber = (num: number): string => {
    const fixedNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return fixedNum.replace('.', ',');
  };

  const parseFormattedNumber = (str: string): number => {
    return parseFloat(str.replace(/\s/g, '').replace(',', '.'));
  };

  const performCalculation = () => {
    const current = parseFormattedNumber(display);
    let newValue = previousValue ?? 0;

    switch (operator) {
      case '+':
        newValue += current;
        break;
      case '-':
        newValue -= current;
        break;
      case '*':
        newValue *= current;
        break;
      case '/':
        if (current === 0) {
          setDisplay('Error');
          return;
        }
        newValue /= current;
        break;
    }

    setDisplay(formatNumber(newValue));
    setCurrentValue(newValue);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleOperator = (nextOperator: Operator) => {
    const inputValue = parseFormattedNumber(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      performCalculation();
      setPreviousValue(parseFormattedNumber(display));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key;

    if (/[0-9]/.test(key)) {
      handleNumberInput(key);
    } else if (key === '.') {
      handleDecimal();
    } else if (key === '=' || key === 'Enter') {
      if (operator) performCalculation();
    } else if (key === 'Escape') {
      clearAll();
    } else if (['+', '-', '*', '/'].includes(key)) {
      handleOperator(key as Operator);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, operator, previousValue]);

  return (
    <div className={`${styles.calculator} ${styles[theme]}`}>
      <div className={styles.themeToggle} onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </div>

      <div className={styles.display}>{display}</div>

      <div className={styles.buttons}>
        <Button onClick={clearAll} variant="secondary">AC</Button>
        <Button onClick={handleSignChange} variant="secondary">+/-</Button>
        <Button onClick={() => handleOperator('/')} variant="secondary">÷</Button>
        <Button onClick={() => handleOperator('*')} variant="secondary">×</Button>

        <Button onClick={() => handleNumberInput('7')}>7</Button>
        <Button onClick={() => handleNumberInput('8')}>8</Button>
        <Button onClick={() => handleNumberInput('9')}>9</Button>
        <Button onClick={() => handleOperator('-')} variant="secondary">−</Button>

        <Button onClick={() => handleNumberInput('4')}>4</Button>
        <Button onClick={() => handleNumberInput('5')}>5</Button>
        <Button onClick={() => handleNumberInput('6')}>6</Button>
        <Button onClick={() => handleOperator('+')} variant="secondary">+</Button>

        <Button onClick={() => handleNumberInput('1')}>1</Button>
        <Button onClick={() => handleNumberInput('2')}>2</Button>
        <Button onClick={() => handleNumberInput('3')}>3</Button>
        <Button onClick={performCalculation} variant="equals">=</Button>

        <Button onClick={() => handleNumberInput('0')} wide>0</Button>
        <Button onClick={handleDecimal}>,</Button>
      </div>
    </div>
  );
};

export default Calculator;