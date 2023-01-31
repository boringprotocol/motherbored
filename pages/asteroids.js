import React from 'react';
import AsteroidsGame from '../lib/asteroids/AsteroidsGame';
import {useEffect, useState} from 'react';
import styles from '../lib/asteroids/style.module.css';

const AsteroidsPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [topScore, setTopScore] = useState(0);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setIsMounted(true);
      }
    }, []);
  
    return (
      <div className={styles.AsteroidsContainer}>    
        {isMounted && <AsteroidsGame setCurrentScore={setCurrentScore} setTopScore={setTopScore} currentScore={currentScore} topScore={topScore} /> }
      </div>
    );
  }

export default AsteroidsPage;
