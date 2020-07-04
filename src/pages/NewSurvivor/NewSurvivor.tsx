import React, { useEffect, useState } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';

import NewSurvivorActive from '../../assets/menu/NewSurvivorActive.svg';

import Male from '../../assets/avatar/male.svg';
import Female from '../../assets/avatar/female.svg';
import './NewSurvivor.scss';
import { Item } from '../../models/Item';
import { People, Gender } from '../../models/People';
import { LeafletMouseEvent } from 'leaflet';
import { useForm } from "react-hook-form";
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
export const NewSurvivor = () => {

  const [people, setPeople] = useState<People>();

  const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);

  const [selectedItems, setselectedItems] = useState<number[]>([]);

  const [latLong, setlatLong] = useState<[number, number]>([0, 0]);

  const { register, handleSubmit, errors, setValue } = useForm<People>();

  const [loading, setLoading] = useState<boolean>(false);

  let peopleStorage = localStorage.getItem('peopleId');

  function updatePeople(data: FormData) {
    setLoading(true);

    axios.patch(`${peopleStorage}`, data).then(res => {
      toast(`${res.data.name} updated successfully!`, {
        type: 'dark',
        progressStyle: {
          background: '#41A10A'
        }
      })
      setLoading(false);
    }).catch(error => {

      let key = Object.keys(error.response.data)[0];
      toast(`${key} - ${error.response.data[key]}`, {
        type: 'dark',
        progressStyle: {
          background: 'indianred'
        }
      })
    })
  }
  function savePeople(data: FormData) {
    setLoading(true);
    api.post('people', data).then(res => {
      setLoading(false)
      toast(`${res.data.name} registered successfully!`, {
        type: 'dark',
        progressStyle: {
          background: '#41A10A'
        }
      })
    }).catch(error => {
      console.log(error.response)
      let key = Object.keys(error.response.data)[0];
      toast(`${key} - ${error.response.data[key]}`, {
        type: 'dark',
        progressStyle: {
          background: 'indianred'
        }
      })

      setLoading(false)
    })
  }

  const onSubmit = (dataValidate: People) => {
    const data = new FormData();
    data.append('person[name]', String(dataValidate.name));
    data.append('person[age]', String(dataValidate.age));
    data.append('person[gender]', String(dataValidate.gender));
    data.append('person[lonlat]', `Point(${latLong[1]} ${latLong[0]})`)
    data.append('items', 'Water:1;Food:1')

    if (peopleStorage && peopleStorage !== '0') {
      updatePeople(data)
    } else {
      savePeople(data)
    }

  };

  useEffect(() => {
    register("gender", { required: true });
  }, [register])

  const items: Item[] = [
    { id: 1, description: 'Water', value: 'Water:1', icon: require('../../assets/inventory/water.svg') },
    { id: 2, description: 'Food', value: 'Food:1', icon: require('../../assets/inventory/food.svg') },
    { id: 3, description: 'Medication', value: 'Medication:1', icon: require('../../assets/inventory/medication.svg') },
    { id: 4, description: 'Ammunition', value: 'Ammunition:1', icon: require('../../assets/inventory/ammunition.svg') },
  ];

  function handleSelectGender(gender: Gender) {
    setPeople({ ...people, gender: gender });
    setValue("gender", gender);
  }

  function loadPeople(location: string) {
    setLoading(true);
    axios.get(location).then(
      res => {
        //POINT (-19.447573915867903 -44.24413204193115)
        let replace = res.data.lonlat.replace('POINT (', '').replace(')', '')
        let longlat = replace.split(' ');

        setlatLong([longlat[1], longlat[0]])
        setPeople(res.data)

        setValue("gender", res.data.gender);
        setLoading(false)
      }, err => {
        setLoading(false);
        localStorage.removeItem('peopleId');
      })
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setPeople({ ...people, lonlat: `${event.latlng.lat} ${event.latlng.lng}` })
    setlatLong([event.latlng.lat, event.latlng.lng]);
  }


  function handleSelectItem(id: number) {

    const alreadySelected = selectedItems.findIndex(item => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setselectedItems(filteredItems);
    } else {
      setselectedItems([...selectedItems, id]);
    }

  }

  useEffect(() => {
   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        setinitialPosition([latitude, longitude]);

        if (peopleStorage && peopleStorage !== '0') {
          loadPeople(peopleStorage)
        }
      }, error => {
        setinitialPosition([-19.4622079, -44.25054816])
      })
    }
    // eslint-disable-next-line
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
            <img width="30" height="30" src={NewSurvivorActive} alt="NewSurvivor" />
          </div>
          <div className="description">
            <h1>New/Load Survivor</h1>
            <h5>Fill in the fields below to register or load a survivor.</h5>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field-group">
            <div className="field">
              <label htmlFor="name">NAME</label>
              <input
                type="text"
                name="name"
                id="name"
                ref={register({ required: true })}
                value={people?.name || ''}
                onChange={e => setPeople({ ...people, name: e.target.value })}
                autoComplete="off"
              />

              {
                errors.name &&
                <div className="validation">
                  <span className="error">This field is required</span>
                </div>
              }

            </div>
            <div className="field">
              <label htmlFor="age">AGE</label>
              <input
                type="number"
                name="age"
                id="age"
                value={people?.age || ''}
                onChange={e => setPeople({ ...people, age: Number(e.target.value) })}
                ref={register({ required: true })}
                autoComplete="off"
              />
              {
                errors.age &&
                <div className="validation">
                  <span className="error">This field is required</span>
                </div>
              }

            </div>
          </div>
          <div className="field">
            <label htmlFor="age">INVENTORY</label>
            <ul className="items-grid">
              {
                items.map(item => (
                  <li key={item.id} onClick={() => { handleSelectItem(item.id) }} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                    <img width="50" height="50" src={item.icon} alt="Water" />
                    <span>{item.description}</span>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="field avatars">
            <label htmlFor="age">AVATAR/GENDER</label>
            <ul className="items-grid">
              <li className={people?.gender === 'M' ? 'avatar selected' : 'avatar'} onClick={() => { handleSelectGender('M') }}>
                <img width="60" height="60" src={Male} alt="Male" />
              </li>
              <li className={people?.gender === 'F' ? 'avatar selected' : 'avatar'} onClick={() => { handleSelectGender('F') }}>
                <img width="60" height="60" src={Female} alt="Female" />
              </li>
            </ul>
            {
              errors.gender &&
              <div className="validation">
                <span className="error">Select a gender is required</span>
              </div>
            }
          </div>
          <button type="submit">
            FINISH
              </button>

        </form>
      </div>

      <div className="column map">
        <div className="location">
          <label htmlFor="name">CURRENT LOCATION</label>
          <Map onclick={handleMapClick} center={initialPosition} style={{ height: "400px", width: "100%", border: "7px solid #1D2E3B", borderRadius: '4px' }} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={latLong} />
          </Map>
        </div>

      </div>

    </section>

  );
};

