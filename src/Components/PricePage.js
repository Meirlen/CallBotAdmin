import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import Navbar from './Common/Navbar';
import bootstrap from 'bootstrap';
import HeaderComponent from './Common/HeaderComponent';
import { defaultStylesheet } from './Style/Style';
import { fOrderService } from './Services/FOrderService';
import { where, orderBy, limit, startAfter, endBefore, limitToLast } from "firebase/firestore";

const auth = getAuth();

const stylesheet = `
    .brand-color {
        background: #10122E!important;
    }
`

export default function PricePage() {

    const [priceCollection, setPriceCollection] = useState([]);
    const [regionCollection, setRegionCollection] = useState([]);
    const [lastElemnt, setLastElement] = useState(null);
    const [prevElement, setPrevElement] = useState(null);
    const [fromFilterRegion, setFromFilterRegion] = useState(null);
    const [toFilterRegion, setToFilerRegion] = useState(null);
    const [regionList, setRegionList] = useState(null);

    const [changePrice, setChangePrice] = useState(null);
    const [createPriceValue, setCreatePriceValue] = useState('');
    const [createText, setCreateText] = useState('');
    const [createToText, setCreateToText] = useState('');
    const [currentPrice, setCurrentPrice] = useState(null);
    const [isInitedFilters, setIsInitedFilters] = useState(false);

    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                apllyFilters();
                sessionStorage.setItem("user", user);
                setUser(user);
                getRegions();
            } else {
                // No user is signed in.
            }
        });
    }, []);

    const createPrice = async () => {
        let data = {
            price: createPriceValue,
            region_name: createText,
            region_to_name: createToText,
        }
        fOrderService.fCreate("price_collection", data);
        setCreateText('');
        setCreateToText('');
        setCreatePriceValue('');
        document.getElementById("createCloseModal").click();
    }

    const saveCurrentPrice = async () => {
        let updated = currentPrice;
        updated.data.price = createPriceValue;
        updated.data.region_name = createText;
        setCurrentPrice(updated);
        fOrderService.fUpdate("price_collection", updated.key, updated.data);
    }

    const setPriceCollectionAndMakeFilters = async (collection) => {
        setPriceCollection(collection);
        if (!isInitedFilters) {
            let filter = [];
            for (let i = 0; i < collection.length; i++) {
                if (collection[i].data.region_name != undefined && collection[i].data.region_name != "") {
                    filter = checkIfInside(filter, collection[i].data.region_name);
                }
                if (collection[i].data.region_to_name != undefined && collection[i].data.region_to_name != "") {
                    filter = checkIfInside(filter, collection[i].data.region_to_name);
                }

            }
            console.log(filter);
            setRegionList([...filter]);
            setIsInitedFilters(true);
        }
    }

    const checkIfInside = (collection, name) => {
        for (let i = 0; i < collection.length; i++) {
            if (collection[i] === name) {
                return collection;
            }
        }
        collection.push(name);
        return collection;
    }

    //TODO: тут должны быть queryConstrains
    const apllyFilters = async (type = null) => {
        await fOrderService.fSelectWithQueryConstraints("price_collection", setPriceCollectionAndMakeFilters, getQueryConstaints(type), setLastElement, setPrevElement);
    }

    const getRegions = async (type = null) => {
        await fOrderService.fSelectWithQueryConstraints("regions", setRegionCollection, getQueryConstaints(type), null, null);
    }

    const getQueryConstaints = (type = null) => {
        let query = [];
        if (fromFilterRegion != null && fromFilterRegion !== '') {
            query.push(where("region_name", "==", fromFilterRegion));
        }
        if (toFilterRegion != null && toFilterRegion !== '') {
            query.push(where("region_to_name", "==", toFilterRegion));
        }
        if (type === 'next' && lastElemnt !== undefined && lastElemnt != null) {
            query.push(startAfter(lastElemnt.data().created));
        }
        if (type === 'prev' && prevElement !== undefined && prevElement != null) {
            query.push(endBefore(prevElement.data().created));
        }
        console.log('query ', query);
        return query;
    }

    const selectItem = async (item) => {
        setCurrentPrice(item);
        setCreatePriceValue(item.data.price);
        setCreateText(item.data.region_name);
        setCreateToText(item.data.region_to_name);
        console.log('Selected item ', currentPrice, item);
    }

    const updateDocs = async () => {
        let changePriceInt = parseInt(changePrice)
        console.log('price int ', changePriceInt);
        if (!isNaN(changePriceInt)) {
            for (let i = 0; i < priceCollection.length; i++) {
                let price = priceCollection[i];
                price.data.price = parseInt(price.data.price) + parseInt(changePrice);
                console.log('price ', price, changePrice);
                fOrderService.fUpdate("price_collection", price.key, price.data);
            }
        }
        //console.log('New collection ', priceList);
    }

    const getClass = (status) => {
        //console.log(status);
        let className = '';
        switch (status) {
            case 'new':
                className = 'b-brand-color-white';
                break;
            case 'accept':
                className = 'b-brand-color-green ';
                break;
            case 'decline':
                className = 'b-brand-color-red';
                break;
            case 'wait':
                className = 'b-brand-color-orange';
                break;
            default:
                className = 'b-brand-color-white';
        }
        //console.log(className);
        return className;
    }

    const reloadSettings = () => {
        setCreateText('');
        setCreatePriceValue('');
    }

    const setFromFilterValue = async (value) => {
        setFromFilterRegion(value);
        console.log('from', value);
        //apllyFilters();
    }

    const setToFilterValue = async (value) => {
        setToFilerRegion(value);
        console.log('to', value);
        //apllyFilters();
    }

    const regionOptions = regionCollection && regionCollection.length > 0 ?
        regionCollection.map((item, index) => <option key={index} value={item.data.name}>{item.data.name}</option>) : <option></option>;

    const domRegion = regionList && regionList.length > 0 ?
        regionList.map((item, index) => <option key={index} value={item}>{item}</option>) : <option></option>;

    const partners = priceCollection && priceCollection.length > 0 ?
        priceCollection.map((item, index) =>
            <tr key={index} className={getClass(item.data.status)} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={async () => {
                await selectItem(item);
            }}
            >
                <td>{index}</td>
                <td>{item.data.region_name}</td>
                <td>{item.data.region_to_name}</td>
                <td>{item.data.price}</td>
                <td>
                    <i className="pl-2 bi bi-x-lg"
                        onClick={async () => {
                            await fOrderService.delete("price_collection", item.key);
                        }}
                    >
                    </i>
                </td>
            </tr>
        ) : <tr></tr>;

    return (
        <div className="row h-100">
            <style>
                {defaultStylesheet}
            </style>
            <style>
                {stylesheet}
            </style>
            <div className='main-wrapper'>
                <Navbar currentActive={"price"}></Navbar>
                <main className="content-wrapper">
                    <div className="col">
                        <HeaderComponent email={user != null ? user.email : null}></HeaderComponent>
                        <div className='row align-left'>
                            <div className='col'>
                                <input type="number" placeholder='Введите число' className='form-control d-inline-block w-auto m-2' onChange={(text) => { setChangePrice(text.target.value); console.log('change price ', text.target.value); }}></input>
                                <button className='btn btn-primary m-2' onClick={() => updateDocs()}> Применить </button>
                                <button className='btn btn-primary m-2' data-bs-toggle="modal" data-bs-target="#createModal" onClick={() => reloadSettings()}> Создать </button>
                            </div>
                        </div>
                        <div className='row align-left'>
                            <div className='col'>
                                <label>Откуда:</label>
                                <select className='form-select d-inline-block w-auto m-2' onChange={(e) => { setFromFilterValue(e.target.value) }}>
                                    {
                                        regionOptions
                                    }
                                    <option value={''}></option>
                                </select>
                                <label>Куда:</label>
                                <select className='form-select d-inline-block w-auto m-2' onChange={(e) => { setToFilterValue(e.target.value) }}>
                                    {
                                        regionOptions
                                    }
                                    <option value={''}></option>
                                </select>
                                <button className='btn btn-primary m-2' onClick={() => apllyFilters()}> Отфильтровать </button>
                            </div>
                        </div>
                        <div className="row table-responsive p-3 b-brand-light-gray table-scroll">
                            <table className="table">
                                <thead className='f-18  p-2'>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Регион откуда</th>
                                        <th scope="col">Регион куда</th>
                                        <th scope="col">Цена</th>
                                        <th scope="col">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className='custom-table p-2'>
                                    {
                                        partners
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className='row'>
                                    <div className='d-grid gap-2 col-6 mx-auto'>
                                        <p>Регион : </p>
                                        <select className='form-select' value={createText} onChange={e => { setCreateText(e.target.value) }}>
                                            {
                                                regionOptions
                                            }
                                            <option value={''}></option>
                                        </select>
                                        <p>Регион куда: </p>
                                        <select className='form-select' value={createToText} onChange={e => { setCreateToText(e.target.value) }}>
                                            {
                                                regionOptions
                                            }
                                            <option value={''}></option>
                                        </select>
                                        <p>Цена : </p>
                                        <input className='form-control' type="number" value={createPriceValue} onChange={e => { setCreatePriceValue(e.target.value) }} ></input>
                                        <p>Координаты : </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer d-inline">
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button type="button" className="btn btn-primary mb-1" onClick={() => { saveCurrentPrice(); }}>Применить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <button id='createCloseModal' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className='row'>
                                    <div className='d-grid gap-2 col-6 mx-auto'>
                                        <p>Регион откуда: </p>
                                        <select className='form-select' value={createText} onChange={e => { console.log('log ', e); setCreateText(e.target.value) }}>
                                            {
                                                regionOptions
                                            }
                                            <option value={''}></option>
                                        </select>
                                        <p>Регион куда: </p>
                                        <select className='form-select' value={createToText} onChange={e => { console.log('log ', e.target.value); setCreateToText(e.target.value) }}>
                                            {
                                                regionOptions
                                            }
                                            <option value={''}></option>
                                        </select>
                                        <p>Цена : </p>
                                        <input className='form-control' type="number" value={createPriceValue} onChange={e => { setCreatePriceValue(e.target.value) }} ></input>
                                        <p>Координаты : </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer d-inline">
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button type="button" className="btn btn-primary mb-1" onClick={() => { createPrice(); }}>Создать</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}