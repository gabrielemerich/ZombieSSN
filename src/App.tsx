import React, { useState, useEffect } from 'react';
import './styles/App.scss';
import MenuToggle from './assets/menu/MenuToggle.svg';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';

function App() {

  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  function handleMenu(flag: Boolean) {
    if (flag)
      setShowMenu(false)
    else
      setShowMenu(true)
  }

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  function closeMenu() {
    if (windowDimensions.width < 1300) {
      setShowMenu(false)
    }
  }

  useEffect(() => {
    if (windowDimensions.width < 1300) {
      setShowMenu(false)
    } else {
      setShowMenu(true)
    }
  }, [windowDimensions]);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="menu-toggle" style={{ display: showMenu ? 'none' : 'block' }}>
        <img onClick={() => handleMenu(showMenu)} width="40" height="40" src={MenuToggle} alt="NewSurvivor" />
      </div>

      <main className="animate__animated animate__fadeInLeft" onClick={() => closeMenu()}>
        <Routes MenuVisible={showMenu} />
      </main>

      <ToastContainer />
    </>
  );
}

export default App;
