import React, { Suspense } from 'react';
import {Routes, Route } from "react-router-dom";
import LoginPage from './views/LoginPage/LoginPage';
import withAuthenticationCheck from "../hoc/auth";


function App() {

    const AuthLoginPage = withAuthenticationCheck(LoginPage, null);

    
    return(
        <Suspense fallback={(<div>Loading...</div>)}>
            <Routes>
                <Route path="/login" element={<AuthLoginPage/>}/>
            </Routes>
        </Suspense>


    )

}

export default App;
