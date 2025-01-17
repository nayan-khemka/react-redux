import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Dashboard.css';
import '../../css/Needy.css';
import _ from 'lodash';
// import { isDisabled } from '@testing-library/user-event/dist/utils';
import Auth from '../../utils/Auth';
import { fetchdata } from '../../network/apis';
import { loadUsersStart,loadUsersError, loadUsersSuccess } from '../../store/Dashboard/DashboardAction';
import { connect } from 'react-redux' ;
import { Component } from 'react';

const Dashboard=()=>{ 
    const [myData, setMyData] = useState([]);
    const [paginatedData, setPaginatedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [maxContent, setMaxContent] = useState(4)
    const totalPages = Math.ceil(myData.length / maxContent);
    const [count, setCount] = useState(2);
    
    useEffect(()=>{
      setTimeout(async () => {
        const t= await fetchdata();
        console.log(t)
        setMyData(t);
        setPaginatedData(_(t).slice(0).take(maxContent).value())
        loadUsersStart()
        console.log(myData);
      },400);
    },[])

    const pagination = (pageNo) => {
        setCurrentPage(pageNo);
        const startIndex = (pageNo - 1) * maxContent;
        const paginatedSinglePageData = _(myData).slice(startIndex).take(maxContent).value();
        setPaginatedData(paginatedSinglePageData);
      }
    
      const lastPage = () => {
        pagination(totalPages);
    
      }
    
      const nextPage = () => {
        pagination(currentPage + 1)
      }
    
      const firstPage = () => {
        pagination(1)
      }
    
      const previousPage = () => {
        console.log(currentPage);
        pagination(currentPage - 1)
      }
    
      const handleLogout = () => {
        localStorage.clear()
      }

    return(
        // <div>"Hello"</div>
        <div className='dashboard'>
            <button className='btn btn-needy text-light mt-3 mx-auto' style={{backgroundColor:"#3A5998", color:"white", position:"absolute", margin:"auto", right:"10px", padding:"0.5px", border:"none"}} onClick={()=> Auth.signOut()}>LOG OUT</button>
            <h1 className='dashboardHead toptitle mb-lg-3'>Needy</h1>
            <div className='d-flex justify-content-center'>
                <button className='btn btn-needy text-light mt-3 mx-auto' id='submit' type='submit' onClick={()=> Auth.signOut()}>LOG OUT</button>
            </div>
      <ul className="sidebar">
        <h1 className='sidebarHead'>Support</h1>
        <hr className='headline' />
        <li className='sideOption'>Needy</li>
        <li className='sideOption'>Resources</li>
        <li className='sideOption'>Allotment Form</li>
        <li className='sideOption' href="#news">Allotment Data</li>
        <li className='sideOption' href="#contact">Check Due</li>
      </ul>

      <table className="table">
        <thead className='tabHead'>
          <tr>
            <th scope="col" >Name</th>
            <th scope="col">Email</th>
            <th scope="col">Country</th>
            <th scope="col">Slogan</th>
            <th scope="col">Timing</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>

          {paginatedData.map((item, i) => (
            <tr className='rows' key={i}>
              <td>{item.name}.</td>
              <td>{item.website}</td>
              <td>{item.email}</td>
              <td>{item.username}</td>
              <td>{item.id}</td>
              {/* <td><div>{item.technology.map((lang, j) => { return <span key={Math.random*10}>{lang.language}, </span> })}</div></td>
              <td><div>{item.timing.map((time, k) => { return <span key={Math.random*100}>{time.startTime} to {time.endTime}<br /></span> })}</div></td> */}
            </tr>
          ))}

        </tbody>
      </table>
      <div className='footer'>
        {totalPages === 1 ? <></> :
          <nav className='d-flex justify-content-center'>
            <ul className='pagination'>
              <button className='previous-btn' type="button" onClick={ firstPage}>First</button>
              <li className='previous' onClick={previousPage}><i className="fa-solid fa-angle-left fa-2x mx-2"></i></li>
              {[...Array(totalPages)].map((a, i) => {
                if ((i + 1 <= currentPage - 2 && i + 1 >= currentPage - 5) || (i + 1 >= currentPage + 2 && i + 1 <= currentPage + 5)) {
                  return <div >.</div>
                } else if (i + 1 < currentPage - 5 || i + 1 > currentPage + 5) {
                  return <div ></div>
                }
                return (<li className={
                  (i + 1) === currentPage ? 'page-item active' : 'page-item'}>
                  <p className='page-link' onClick={() => {
                    pagination(i + 1)
                  }}>{i + 1}</p>
                </li>
                )
              })}
              <li className='next' type="button" onClick={nextPage}><i className="fa-solid fa-angle-right fa-2x mx-2"></i></li>
              <button className='next-btn' type="button" onClick={lastPage}>Last</button>
            </ul>

          </nav>
        }
      </div>
        </div>
    )
  }
    const mapStateToProps = (state) => ({
        data: state.data,
      });
    const mapDispatchToProps = (dispatch) => ({
        LOAD_USERS_START : payload => 
        {
          dispatch(loadUsersStart(payload));
        }
      });
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);