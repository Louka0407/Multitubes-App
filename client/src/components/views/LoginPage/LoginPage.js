import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { loginUser } from '../../../_actions/user_actions';
import logo from '../../../images/Multitubes Logo.png';
import illustration from '../../../images/login-illustrator.svg';

function LoginPage() {

  // --------------------------------- Elements dynamiques ---------------------------------- // 


  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Ajout de l'état de chargement
  const navigate = useNavigate(); 



  // --------------------------------- Corps ---------------------------------- // 

  // Validation attributs avec Yup
  const validationSchema = Yup.object({
    code: Yup.string().required('code requis'),
    password: Yup.string().required('Mot de passe requis'),
  });

  return (

    <div className="login-container">
      <div className="login-form">
        <div className="center">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Connexion à votre compte</h2>
        </div>
        <Formik
          initialValues={{ code: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {

            let dataToSubmit = {
              code: values.code,
              password: values.password,
            };

            setLoading(true); // Démarre le chargement

            try {
              const response = await loginUser(dataToSubmit);

              const result = await response.payload;

              if (result.loginSuccess) {
                console.log('Login success', result);
                window.localStorage.setItem('userId', result.userId);

                setFormErrorMessage('');
                navigate('/');
              } else {

                if (result.message === "Auth failed, code not found") {
                  setFormErrorMessage('Code non trouvée.');
                } else if (result.message === "Wrong password") {
                  setFormErrorMessage('Mot de passe incorrect.');
                } else {
                  setFormErrorMessage('Erreur de connexion. Veuillez réessayer.');
                }
              }
            } catch (error) {
              setFormErrorMessage('Erreur de connexion. Veuillez réessayer.');
            } finally {
              setLoading(false); // Arrête le chargement après la réponse
            }
          }}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="code">Code</label>
              <Field
                type="code"
                id="code"
                name="code"
                placeholder="123456..."
                className="input"
              />
              <ErrorMessage name="code" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Entrer votre mot de passe"
                className="input"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Connexion'}
            </button>

            {formErrorMessage && (
              <label>
                <p
                  style={{
                    color: '#ff0000bf',
                    fontSize: '0.7rem',
                    border: '1px solid',
                    padding: '1rem',
                    borderRadius: '10px',
                  }}
                >
                  {formErrorMessage}
                </p>
              </label>
            )}
          </Form>
        </Formik>
      </div>

      <div className="login-illustration">
        <img src={illustration} alt="Illustration" />
      </div>
    </div>
  );
}

export default LoginPage;
