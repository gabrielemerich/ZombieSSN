import React, { useEffect, useState } from 'react';
import './ListSurvivors.scss';
import ListActive from '../../assets/menu/ListActive.svg';
import { api } from '../../services/api';
import { People } from '../../models/People';
import BiohazardIcon from '../../assets/icons/biohazard.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Toasts } from '../../styles/Toasts';
import ClipLoader from "react-spinners/ClipLoader";

import { useHistory } from "react-router-dom";

export const ListSurvivors = () => {

    const [peoplesList, setPeoplesList] = useState<People[]>([]);
    const peopleStorage = localStorage.getItem('peopleId');
    const [loading, setLoading] = useState<boolean>(false);
    const history = useHistory();
    async function reportInfected(infected: People) {
        
        if (peopleStorage && peopleStorage !== '0') {
            setLoading(true)

            const data = new FormData();
            const id = await axios.get(String(infected.location)).then(res => {
                return res.data.id;
            })
            data.append('infected', id)

            axios.post(`${peopleStorage}/report_infection`, data).then(res => {
                toast('Successfully reported!', Object(Toasts.SUCCESS))
                setLoading(false)
            }).catch(error => {
                let key = Object.keys(error.response.data)[0];
                toast(`${key} - ${error.response.data[key]}`, Object(Toasts.DANGER))
                setLoading(false)
            })
        } else {
            toast('Select a survivor before reporting', Object(Toasts.DANGER))
            history.push('/Select')
        }
    }

    useEffect(() => {
        setLoading(true)
        api.get('people').then(res => {
            setPeoplesList(res.data)
            setLoading(false)
        }).catch(err => {
            console.log(err);
            setLoading(false)
        })
    }, [])

    return (
        <section className="container">
            <div className="column">
                <div className="loading" style={loading ? { display: 'flex' } : { display: 'none' }}>
                    <ClipLoader

                        size={150}
                        color={"#41A10A"}
                        loading={loading}
                    />
                </div>
                <div className="title">
                    <div className="icon">
                        <img width="28" height="28" src={ListActive} alt="NewSurvivor" />
                    </div>
                    <div className="description">
                        <h1>List of Survivors</h1>
                        <h5>View and report survivors.</h5>
                    </div>
                </div>
                <div className="list">
                    <table>
                        <thead>
                            <tr className="header-table">
                                <th scope="col">Name</th>
                                <th scope="col">Age</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Infected</th>
                                <th scope="col">Report Infected</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                peoplesList.map(people =>
                                    (
                                        <tr key={people.location}>
                                            <td data-label="Name">{people.name}</td>
                                            <td data-label="Age">{people.age}</td>
                                            <td data-label="Gender">{people.gender}</td>
                                            <td data-label="Infected">{people.infected ? 'YES' : 'NO'}</td>
                                            <td data-label="Report Infected">
                                                <span className="report" onClick={() => reportInfected(people)}><img width="20" height="20s" src={BiohazardIcon} alt="Report" /></span>
                                            </td>
                                        </tr>
                                    ))
                            }


                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

