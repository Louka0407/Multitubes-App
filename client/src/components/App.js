import React, { Suspense } from 'react';
import {Routes, Route } from "react-router-dom";
import LoginPage from './views/LoginPage/LoginPage';
import withAuthenticationCheck from "../hoc/auth";
import LandingPage from './views/LandingPage/LandingPage.js';
import FirstStep from './views/FirstStepPage/FirstStepPage.js';
import SelectTimeSlotPage from './views/StepPage/SelectTimeSlotPage.js';
import ManageHoursPage from './views/StepPage/ManageHoursPage.js';
import { DateProvider } from './views/DateLineContext/DateLineContext.js';
import CompletionPage from './views/Completion/CompletionPage.js';
import FinishPage from './views/FinishPage/FinishPage.js';
import GenerateReport from './views/GenerateReport/GenerateReport.js';
import AdminPage from './views/AdminPage/AdminPage.js';
import AdminPageAddUser from './views/AdminPage/AdminPageAddUser.js';
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
    const AuthGenerateReport = withAuthenticationCheck(GenerateReport, true);
    const AuthAdminPage = withAuthenticationCheck(AdminPage, true);
    const AuthAdminPageAddUser = withAuthenticationCheck(AdminPageAddUser, true);


    return(
        <Suspense fallback={(<div>Loading...</div>)}>
            <DateProvider>
                <Routes>
                    <Route path='/' element={<AuthLandingPage/>}/>
                    <Route path="/login" element={<AuthLoginPage/>}/>
                    <Route path='/FirstStep' element={<AuthFirstStep/>}/>
                    <Route path='/SelectTimeSlotPage' element={<AuthSelectTimeSlotPage/>}/>
                    <Route path="/manage-hours/:timeSlot/:firstHour" element={<AuthManageHoursPage />} />
                    <Route path='/completion/:timeSlot' element={<AuthCompletionPage/>}/>
                    <Route path='/finish' element={<AuthFinishPage/>}/>
                    <Route path='/generatereport' element={<AuthGenerateReport/>}/>
                    <Route path='/admin' element={<AuthAdminPage/>}/>
                    <Route path='/adminAddUser' element={<AuthAdminPageAddUser/>}/>

                </Routes>
            </DateProvider>
        </Suspense>


    )

}

export default App;
