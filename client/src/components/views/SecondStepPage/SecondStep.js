import React from 'react'
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';



function SecondStep() {
  return (
    <div>      
      <Header nav="/FirstStep"/>
        <NavBar currentStep="1"/>
    </div>
  )
}

export default SecondStep