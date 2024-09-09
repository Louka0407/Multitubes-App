/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const withAuthenticationCheck = (SpecificComponent, option, adminRoute = null) => {
    function AuthenticationCheck(props) {
        let user = useSelector(state => state.user);
        const dispatch = useDispatch();
        const navigate = useNavigate();  

        useEffect(() => {
            dispatch(auth()).then(response => {

                if (!response.payload.isAuth) {
                    if (option) {
                        navigate('/login'); 
                    }
                } else {
                    if (adminRoute && !response.payload.isAdmin) {
                        navigate('/'); 
                    }
                    else {
                        if (option === false) {
                            navigate('/');  
                        }
                    }
                }
            });
        }, [dispatch, navigate]); 

        return (
            <SpecificComponent {...props} user={user} />
        );
    }
    return AuthenticationCheck;
}

export default withAuthenticationCheck;
