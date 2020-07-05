import React, { useEffect, useState } from 'react';
import NewSurvivor from '../../assets/menu/NewSurvivor.svg';

import NewSurvivorActive from '../../assets/menu/NewSurvivorActive.svg';
import Change from '../../assets/menu/Change.svg';
import ChangeActive from '../../assets/menu/ChangeActive.svg';
import List from '../../assets/menu/List.svg';
import ListActive from '../../assets/menu/ListActive.svg';
import logo from '../../assets/logo.svg';
import './Menu.scss';
import { NavLink, useLocation } from 'react-router-dom';

type MenuVisible = {
    visible: boolean,
}
export const Menu = ({ visible }: MenuVisible) => {
    const [showMenu, setShowMenu] = useState<boolean>(visible);
    useEffect(() => {
        setShowMenu(visible);
    }, [visible])

    let location = useLocation();
    const isActive = (path: string) => {
        return path === location.pathname;
    };


    return (
        <div>
            <nav className={showMenu ? 'show animate__animated animate__fadeInLeft' : 'hide'}>
                <div className="logo"><img width="55" height="55" src={logo} alt="ZombieSSN" /></div>

                <NavLink
                    activeClassName="selected-item"
                    className="item-menu" to="/"
                    exact
                >

                    <img width="40" height="40" src={isActive('/') ? NewSurvivorActive : NewSurvivor} alt="NewSurvivor" />

                </NavLink>
                <NavLink
                    activeClassName="selected-item"
                    className="item-menu" to="/Select"
                >
                    <img width="37" height="37" src={isActive('/Select') ? ChangeActive : Change} alt="SelectSurvivor" />
                </NavLink>

                <NavLink
                    activeClassName="selected-item"
                    className="item-menu" to="/list"
                >
                    <img width="37" height="37" src={isActive('/list') ? ListActive : List} alt="ListSurvivors" />
                </NavLink>



            </nav>
        </div>
    );
};
