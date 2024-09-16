import React, { Suspense } from 'react';
import {Routes, Route } from "react-router-dom";
import LoginPage from './views/LoginPage/LoginPage';
import withAuthenticationCheck from "../hoc/auth";
import LandingPage from './views/LandingPage/LandingPage.js';
import FirstStep from './views/FirstStepPage/FirstStepPage.js';
import SelectTimeSlotPage from './views/StepPage/SelectTimeSlotPage.js';
import ManageHoursPage from './views/StepPage/ManageHoursPage.js';
import { DateProvider } from './views/DateContext/DateContext.js';

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {

    const AuthLandingPage = withAuthenticationCheck(LandingPage, true);
    const AuthLoginPage = withAuthenticationCheck(LoginPage, null);
    const AuthFirstStep = withAuthenticationCheck(FirstStep, true);
    const AuthSelectTimeSlotPage = withAuthenticationCheck(SelectTimeSlotPage, true);
    const AuthManageHoursPage = withAuthenticationCheck(ManageHoursPage, true);

    return(
        <Suspense fallback={(<div>Loading...</div>)}>
            <DateProvider>
            <Routes>
                <Route path='/' element={<AuthLandingPage/>}/>
                <Route path="/login" element={<AuthLoginPage/>}/>
                <Route path='/FirstStep' element={<AuthFirstStep/>}/>
                <Route path='/SelectTimeSlotPage' element={<AuthSelectTimeSlotPage/>}/>
                <Route path="/manage-hours/:timeSlot/:firstHour" element={<AuthManageHoursPage />} />
            </Routes>
            </DateProvider>

        </Suspense>


    )

}

export default App;
