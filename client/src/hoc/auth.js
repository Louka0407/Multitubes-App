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
            const checkAuth = async () => {
                try {
                    const response = await dispatch(auth());
                    if (response && response.payload) {
                        const { payload } = response;

                        if (payload === null) {
                            console.error('Authentication response is null');
                            navigate('/login'); // Redirection en cas de payload null
                            return;
                        }

                        if (!payload.isAuth) {
                            if (option) {
                                navigate('/login'); 
                            }
                        } else {
                            if (adminRoute && !payload.isAdmin) {
                                navigate('/'); 
                            } else if (option === false) {
                                navigate('/');  
                            }
                        }
                    } else {
                        console.error('Unexpected response structure:', response);
                        navigate('/login'); // Redirection par défaut ou autre gestion
                    }
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    navigate('/login'); // Redirection en cas d'erreur
                }
            };

            checkAuth();
        }, [dispatch, navigate, option, adminRoute]); 

        return (
            <SpecificComponent {...props} user={user} />
        );
    }
    return AuthenticationCheck;
}

export default withAuthenticationCheck;
