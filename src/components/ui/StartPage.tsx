import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Root = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100dvh;
  overflow: hidden;
  background: #2c3e50;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: white; cursor: pointer;

  .text-presents {
    font-family: 'DotGothic16', sans-serif;
    color: #f1c40f;
    font-size: clamp(22px, 5vh, 45px);
    text-shadow: 3px 3px 0px black;
    text-transform: uppercase;
    margin: 0;
    text-align: center;
    letter-spacing: 2px;
  }
`;

export default function StartPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/main-menu", { replace: true });
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const skipIntro = () => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        console.warn("Bloqueo de orientación no soportado.");
      });
    }
    
    navigate("/main-menu", { replace: true });
  };

  return (
    <Root
      as={motion.div}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }} 
      transition={{ duration: 0.7 }}
      onClick={skipIntro}
    >
      <motion.h2
        className="text-presents"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Dr. Plasmadrid presents...
      </motion.h2>
    </Root>
  );
}