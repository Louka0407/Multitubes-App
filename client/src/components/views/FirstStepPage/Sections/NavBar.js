import React, { useState } from 'react';
import { Steps } from 'antd'; 
import 'antd/dist/reset.css'; 

function NavBar() {

    const [currentStep, setCurrentStep] = useState(0); // Gérer l'étape actuelle

    const onStepsChange = (current) => {
        setCurrentStep(current); // Mise à jour de l'étape sélectionnée
    };

  return (

    <Steps
        current={currentStep}
        onChange={onStepsChange}
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