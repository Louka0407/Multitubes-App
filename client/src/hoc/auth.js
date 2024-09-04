/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const withAuthenticationCheck = (SpecificComponent, option, adminRoute = null) => {
    // Cette fonction retourne un composant fonctionnel
    return function AuthenticationCheck(props) {
        const user = useSelector(state => state.user);
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = async () => {
                const response = await dispatch(auth());

                if (!response.payload.isAuth) {
                    if (option) {
                        navigate('/login');
                    }
                } else {
                    if (adminRoute && !response.payload.isAdmin) {
                        navigate('/');
                    } else if (option === false) {
                        navigate('/');
                    }
                }
            };

            checkAuthentication();
        }, [dispatch, navigate, option, adminRoute]);

        // Si l'utilisateur est authentifié et satisfait les conditions, le composant est rendu
        return <SpecificComponent {...props} user={user} />;
    };
};

export default withAuthenticationCheck;
