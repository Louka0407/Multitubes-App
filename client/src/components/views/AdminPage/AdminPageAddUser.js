import React from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPageAddUser.module.css';
import Header from '../Header/Header';

const { Option } = Select;

function AdminPageAddUser() {
  const navigate = useNavigate();

  const initialValues = {
    code: '',
    name: '',
    lastname: '',
    role: 0, // 0 = Utilisateur, 1 = Admin
    password: '',
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required('Code requis'),
    name: Yup.string().required('Nom requis'),
    lastname: Yup.string().required('Prénom requis'),
    role: Yup.number().oneOf([0, 1], 'Rôle invalide').required('Rôle requis'),
    password: Yup.string().required('Mot de passe requis').min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/users/register', values);
      if (response.data.success) {
        message.success('Utilisateur créé avec succès');
        resetForm();
        navigate('/admin'); // Retour à la page admin après création
      } else {
        message.error('Échec de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      message.error('Erreur lors de la création de l\'utilisateur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container2}>
    <Header nav="retour"/>
    <div className={styles.container}>
      <h1>Créer un nouvel utilisateur</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <FormikForm className={styles.form}>
            <Form.Item label="Code">
              <Field name="code">
                {({ field }) => <Input {...field} />}
              </Field>
              <ErrorMessage name="code" component="div" className={styles.error} />
            </Form.Item>

            <Form.Item label="Nom">
              <Field name="name">
                {({ field }) => <Input {...field} />}
              </Field>
              <ErrorMessage name="name" component="div" className={styles.error} />
            </Form.Item>

            <Form.Item label="Prénom">
              <Field name="lastname">
                {({ field }) => <Input {...field} />}
              </Field>
              <ErrorMessage name="lastname" component="div" className={styles.error} />
            </Form.Item>

            <Form.Item label="Rôle">
              <Select
                value={values.role}
                onChange={(value) => setFieldValue('role', value)}
              >
                <Option value={0}>Utilisateur</Option>
                <Option value={1}>Administrateur</Option>
              </Select>
              <ErrorMessage name="role" component="div" className={styles.error} />
            </Form.Item>

            <Form.Item label="Mot de passe">
              <Field name="password">
                {({ field }) => <Input.Password {...field} />}
              </Field>
              <ErrorMessage name="password" component="div" className={styles.error} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Créer utilisateur
              </Button>
            </Form.Item>
          </FormikForm>
        )}
      </Formik>
    </div>
    </div>
  );
}

export default AdminPageAddUser;
