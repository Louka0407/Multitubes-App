import React, { Suspense } from 'react';
import {Routes, Route } from "react-router-dom";
import LoginPage from './views/LoginPage/LoginPage';
import withAuthenticationCheck from "../hoc/auth";
import LandingPage from './views/LandingPage/LandingPage';
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {

    const AuthLandingPage = withAuthenticationCheck(LandingPage, null);
    const AuthLoginPage = withAuthenticationCheck(LoginPage, null);
    
    return(
        <Suspense fallback={(<div>Loading...</div>)}>
            <Routes>
                <Route path='/' element={<AuthLandingPage/>}/>
                <Route path="/login" element={<AuthLoginPage/>}/>
            </Routes>
        </Suspense>


    )

}

export default App;
