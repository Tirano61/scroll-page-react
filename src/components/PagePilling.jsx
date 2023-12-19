

import React, { useState, Children, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion";


const variants = {
  inicial: ({ direction, duration }) =>({
    y: direction === 'increment' ? 0 : -1024,
    transition: {
      duration
    },
  }),
  entrada: ({ duration }) =>({
    y: 0,
    transition: {
      duration
    },
  }),
  salida: ({ direction, duration }) =>{
    return { 
      y: direction === 'decrement' ? -1 : -1024,
      zIndex:  direction === 'increment' ? 100 : 0,
      transition: {
        duration
      },
    }
  },
}

export const PagePilling = ({ children }) => {

  const [pageState, setPageState] = useState(0);
  const [directionState, setDirectionState] = useState('');

  const animando = useRef(false);

  const pages = Children.map(children, (child) => child);

  const detectarScroll = (e) => {
    const { deltaY } = e;
    if (!animando.current) {
      animando.current = true;
      if(deltaY > 0){
        setPageState(pageState => pageState +1);
        setDirectionState('increment');
      }else{
        setPageState(pageState => pageState -1);
        setDirectionState('decrement');
      }
    }

  }

  useEffect(() => {
    document.addEventListener( 'wheel', detectarScroll );      
    return () =>{
      document.removeEventListener( 'wheel', detectarScroll );
    }
  }, []);

  return (
    <AnimatePresence
    initial={false}
      custom={{
        direction: directionState,
        duration: 2.2 
      }}
    >
      <motion.div 
        key={pageState}
        className='container' 
        variants={ variants }
        custom={{
          direction: directionState,
          duration: 2.2 
        }}
        initial="inicial"
        animate="entrada"
        exit="salida"
        onAnimationComplete={( definition )=>{
          if (definition === 'salida') {
            animando.current = false;
          }
          console.log(definition);
        }}
      >
        { pages[ Math.abs( pageState ) % pages.length ] }
      </motion.div>
    </AnimatePresence>
    
  )
}
