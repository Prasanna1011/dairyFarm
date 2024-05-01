
import React, {useState, useEffect } from "react"
import axios from 'axios';

const Apicalls = () => {





 //  local storage token Start
 const authUser = JSON.parse(localStorage.getItem('authUser'));
 // console.log(`my Token for get ${authUser.token}`);
 if (!authUser || !authUser.token) {
   console.log('Token not found in localStorage');
   return;
 }
 
 // Include the token in the request headers
 const config = {
   headers: {
     Authorization: `token ${authUser.token}`
   }
 };
 console.log(config);
 
   //  local storage token End



  return(<>
  

  </>) 
};


export default Apicalls