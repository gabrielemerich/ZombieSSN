import React, { useState, useEffect } from 'react';

import './SelectSurvivor.scss';

import Male from '../../assets/avatar/male.svg';
import Female from '../../assets/avatar/female.svg';
import Water from '../../assets/inventory/water.svg';
import Food from '../../assets/inventory/food.svg';
import Medication from '../../assets/inventory/medication.svg';
import Ammunition from '../../assets/inventory/ammunition.svg';
import ChangeActive from '../../assets/menu/ChangeActive.svg';
import { People } from '../../models/People';
import { api } from '../../services/api';

export const SelectSurvivor = () => {

    const [peoplesList, setPeoplesList] = useState<People[]>([]);
    const [people, setPeople] = useState<People>();

    let peopleStorage = localStorage.getItem('peopleId');

    async function loadPeople(location: string) {
        localStorage.setItem('peopleId', location);

        let filter = peoplesList.filter(element => {
            return element.location === location;
        })[0]
       
        setPeople(filter);
    }
    useEffect(() => {
        api.get('people').then(res => {
            setPeoplesList(res.data)
        }).catch(err => {
            console.log(err);
        })
    }, [])

    useEffect(()=>{
        if(peopleStorage){
            loadPeople(peopleStorage)
        }
        // eslint-disable-next-line
    },[peoplesList])

    return (
        <section className="container">
            <div className="column">
                <div className="title">
                    <div className="icon">
                        <img width="28" height="28" src={ChangeActive} alt="NewSurvivor" />
                    </div>
                    <div className="description">
                        <h1>Select Survivor</h1>
                        <h5>Select a person to start your survival journey.</h5>
                    </div>
                </div>
                <aside className="content">
                    <article className="profile">
                        <label htmlFor="select">SELECT SURVIVOR</label>
                        <select value={people?.location} onChange={e => loadPeople(e.target.value)} className="dropdown" name="survivor">
                            <option value="0">Select Survivor</option>
                            {
                                peoplesList.map(people => (
                                    <option key={people.location} value={people.location}>{people.name}</option>
                                ))
                            }
                        </select>
                        <div className="avatar" style={people ? { display: 'block' } : { display: 'none' }}>
                            <img width="60" height="60" src={people?.gender === 'M' ? Male : Female} alt="avatar" />
                        </div>
                        <div className="info" style={people ? { display: 'block' } : { display: 'none' }}>
                            <label htmlFor="name">NAME</label>
                            <h1>{people?.name}</h1>
                            <div className={people?.infected ? 'status infected' : 'status'}>{people?.infected ? 'INFECTED' : 'HUMAN'}</div>
                        </div>
                    </article>
                    <article className="inventory">
                        <h1>INVENTORY</h1>
                        <ul className="items">
                            <li><img width="90" height="90" src={Water} alt="water" /></li>
                            <li><img width="90" height="90" src={Food} alt="food" /></li>
                            <li><img width="90" height="90" src={Medication} alt="med" /></li>
                            <li><img width="90" height="90" src={Ammunition} alt="ammunition" /></li>
                        </ul>
                    </article>
                </aside>
            </div>
        </section>
    );
};

