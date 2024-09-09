import React from 'react';
import { Steps } from 'antd'; 
import 'antd/dist/reset.css'; 

function NavBar(props) {
  return (

    <Steps
        current={parseInt(props.currentStep)}
        items={[
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},

        ]}
    />  
  )
}

export default NavBar