import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './LoginPage.css';

import logo from '../../../images/Multitubes Logo.png';
import illustration from '../../../images/login-illustrator.svg';

function LoginPage() {
  // Validation Schema avec Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Email invalide').required('Email requis'),
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
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="email">Adresse mail</label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="alex@multitubes.com"
                className="input"
              />
              <ErrorMessage name="email" component="div" className="error" />
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

            <button type="submit" className="login-btn">
              Connexion
            </button>
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
