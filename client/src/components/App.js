import React, { Suspense } from 'react';
import {Routes, Route } from "react-router-dom";
import LoginPage from './views/LoginPage/LoginPage';
import withAuthenticationCheck from "../hoc/auth";
import LandingPage from './views/LandingPage/LandingPage.js';
import FirstStep from './views/FirstStepPage/FirstStepPage.js';
import SelectTimeSlotPage from './views/StepPage/SelectTimeSlotPage.js';
import ManageHoursPage from './views/StepPage/ManageHoursPage.js';
import { DateProvider } from './views/DateContext/DateContext.js';
import CompletionPage from './views/Completion/CompletionPage.js';
import FinishPage from './views/FinishPage/FinishPage.js';

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {

    const AuthLandingPage = withAuthenticationCheck(LandingPage, true);
    const AuthLoginPage = withAuthenticationCheck(LoginPage, null);
    const AuthFirstStep = withAuthenticationCheck(FirstStep, true);
    const AuthSelectTimeSlotPage = withAuthenticationCheck(SelectTimeSlotPage, true);
    const AuthCompletionPage = withAuthenticationCheck(CompletionPage, true);
    const AuthManageHoursPage = withAuthenticationCheck(ManageHoursPage, true);
    const AuthFinishPage = withAuthenticationCheck(FinishPage, true);


    return(
        <Suspense fallback={(<div>Loading...</div>)}>
            <DateProvider>
                <Routes>
                    <Route path='/' element={<LandingPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path='/FirstStep' element={<FirstStep/>}/>
                    <Route path='/SelectTimeSlotPage' element={<SelectTimeSlotPage/>}/>
                    <Route path="/manage-hours/:timeSlot/:firstHour" element={<ManageHoursPage />} />
                    <Route path='/completion/:timeSlot' element={<CompletionPage/>}/>
                    <Route path='/finish' element={<FinishPage/>}/>
                </Routes>
            </DateProvider>
        </Suspense>


    )

}

export default App;
