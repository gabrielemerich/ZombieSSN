import React, { useEffect, useState } from 'react';

import { Route, BrowserRouter } from 'react-router-dom';
import { NewSurvivor } from './pages/NewSurvivor/NewSurvivor';
import { Menu } from './components/Menu/Menu';
import { SelectSurvivor } from './pages/SelectSurvivor/SelectSurvivor';
import { ListSurvivors } from './pages/ListSurvivors/ListSurvivors';

type Menu = {
    MenuVisible: boolean;
}

const Routes = ({ MenuVisible }: Menu) => {
    const [showMenu, setShowMenu] = useState<boolean>(MenuVisible)
    useEffect(()=>{
        setShowMenu(MenuVisible)
    },[MenuVisible])
   return(
       <BrowserRouter>
            <Menu visible={showMenu}/>
            <Route component={NewSurvivor} path="/" exact />
            <Route component={SelectSurvivor} path="/select" />
            <Route component={ListSurvivors} path="/list" />
       </BrowserRouter>
   );
}

export default Routes;