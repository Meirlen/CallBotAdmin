import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import Navbar from './Common/Navbar';
import bootstrap from 'bootstrap';
import HeaderComponent from './Common/HeaderComponent';
import { defaultStylesheet } from './Style/Style';
import { fOrderService } from './Services/FOrderService';
import { where, orderBy, limit, startAfter, endBefore, limitToLast} from "firebase/firestore"; 

const auth = getAuth();

const stylesheet = `
    .brand-color {
        background: #10122E!important;
    }
`

export default function RegionPage() {

    const [priceCollection, setPriceCollection] = useState([]);
    const [regionList, setRegionList] = useState(null);
    const [regionId, setRegionId] = useState(null);
    const [currentRegion, setCurrentRegion] = useState({
        name:'',
    });
    const [user, setUser] = useState(null);

    useEffect( () => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                apllyFilters();
                sessionStorage.setItem("user", user);
                setUser(user);
            } else {
              // No user is signed in.
            }
          });
    }, []);

    const createRegion = async () => {
        fOrderService.fCreate("regions", currentRegion);
        document.getElementById("createCloseModal").click();
        setCurrentRegion({name:''});
    }

    const updateRegion = async () => {
        fOrderService.fUpdate("regions", regionId, currentRegion);
    }

    //TODO: тут должны быть queryConstrains
    const apllyFilters = async (type = null) => {
        await fOrderService.fSelectWithQueryConstraints("regions", setRegionList, getQueryConstaints(type), null, null);
    }

    const getQueryConstaints = (type = null) => {
        let query = [];
        /*
        if (fromFilterRegion != null) {
            query.push(where("region_name", "==", fromFilterRegion));
        }
        if (toFilterRegion != null) {
            query.push(where("region_to_name", "==", toFilterRegion));
        }
        
        if (type === 'next' && lastElemnt !== undefined && lastElemnt != null) {
            query.push(startAfter(lastElemnt.data().created));
        }
        if (type === 'prev' && prevElement !== undefined && prevElement != null) {
            query.push(endBefore(prevElement.data().created));
        }
        */
        console.log('query ', query);
        return query;
    }

    const partners = regionList && regionList.length > 0 ?
        regionList.map((item, index) =>
                <tr  key={index} className='b-brand-color-white' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={ async () => { 
                    setRegionId(item.key);
                    setCurrentRegion(item.data);
                    //await selectItem(item);
                } }>
                    <td>{item.data.name} </td>
                    <td>
                        <i className="pl-2 bi bi-x-lg"
                            onClick={ async () => { 
                                await fOrderService.delete("regions", item.key);
                            } }
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
            <Navbar currentActive={"region"}></Navbar>
            <main className="col-md-9 ms-sm-auto col-lg-10 ">
                <div className="col">
                    <HeaderComponent email={user != null ? user.email : null}></HeaderComponent>
                    <div className='row align-left'>
                        <div className='col'>
                            <button className='btn btn-primary m-2' data-bs-toggle="modal" data-bs-target="#createModal"  onClick={ () => setCurrentRegion({name:''})}> Создать </button>
                        </div>
                    </div>
                    <div className="row table-responsive p-3 b-brand-light-gray table-scroll">
                        <table className="table">
                            <thead className='f-18  p-2'>
                                <tr>
                                    <th scope="col">Регион</th>
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
                                        <input type="text" value={currentRegion.name} onChange={ e => { 
                                                setCurrentRegion(prevState => {
                                                    const newState = Object.assign(currentRegion, { ["name"]: e.target.value })
                                                    return { ...prevState, ...newState };
                                                })
                                            }} 
                                        >
                                        </input>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className="modal-footer d-inline">
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button type="button" className="btn btn-primary mb-1" onClick={() => { updateRegion(); }}>Применить</button>
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
                                        <p>Регион: </p>
                                        <input type="text" value={currentRegion.name} onChange={ e => { 
                                                setCurrentRegion(prevState => {
                                                    const newState = Object.assign(currentRegion, { ["name"]: e.target.value })
                                                    return { ...prevState, ...newState };
                                                })
                                            }}
                                        >
                                        </input>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className="modal-footer d-inline">
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button type="button" className="btn btn-primary mb-1" onClick={() => { createRegion(); }}>Создать</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )

}