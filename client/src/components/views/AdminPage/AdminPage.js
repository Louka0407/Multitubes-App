import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import axios from 'axios';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from '../Header/Header';

const { Option } = Select;

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get('/api/users/auth');
        setIsAdmin(response.data.isAdmin);
        if (response.data.isAdmin) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des autorisations :', error);
        message.error('Erreur lors de la vérification des autorisations');
      }
    };

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        message.error('Erreur lors de la récupération des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  const columns = [
    {
      title: 'code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Nom',
      dataIndex: 'lastname',
      key: 'lastname',
    },
    {
        title: 'Prénom',
        dataIndex: 'name',
        key: 'name',
      },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (role === 0 ? 'Utilisateur' : 'Administrateur'),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, user) => (
        <Button type="primary" onClick={() => handleEdit(user)}>Modifier</Button>
      ),
    },
  ];

  const handleEdit = (user) => {
    setSelectedUser(user);
    setVisible(true);
  };

  const handleSave = async (values, { setSubmitting }) => {
    setVisible(false);
    try {
      const response = await axios.post('/api/users/updateUser', { ...values, userId: selectedUser._id });
      if (response.data.success) {
        message.success('Données utilisateur mises à jour avec succès');
        const updatedUsers = users.map(u => (u._id === selectedUser._id ? { ...u, ...values } : u));
        setUsers(updatedUsers);
      } else {
        message.error('Échec de la mise à jour des informations utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données de l\'utilisateur :', error);
      message.error('Erreur lors de la mise à jour des données de l\'utilisateur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post('/api/users/deleteUser', { userId: selectedUser._id });
      if (response.data.success) {
        message.success('Utilisateur supprimé avec succès');
        const updatedUsers = users.filter(u => u._id !== selectedUser._id);
        setUsers(updatedUsers);
        setVisible(false);
      } else {
        message.error('Échec de la suppression de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      message.error('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  return (
    <div>
      {isAdmin && (
        <>
        <Header nav="retour"/>
          <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            rowKey={(record) => record._id}
            pagination={false}
          />

          <Modal
            title="Modifier l'utilisateur"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            {selectedUser && (
              <Formik
                initialValues={{ code: selectedUser.code, name: selectedUser.name, role: selectedUser.role, lastname: selectedUser.lastname }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                  code: Yup.string().required('code requis'),
                  name: Yup.string().required('Nom requis'),
                  role: Yup.number().oneOf([0, 1], 'Rôle invalide').required('Rôle requis'),
                })}
                onSubmit={handleSave}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <FormikForm>
                    <Form.Item
                      label="code"
                      name="code"
                    >
                      <Field name="code">
                        {({ field }) => <Input {...field} />}
                      </Field>
                      <ErrorMessage name="code" component="div" className="error-message" />
                    </Form.Item>
                    <Form.Item
                      label="Prénom"
                      name="name"
                    >
                      <Field name="name">
                        {({ field }) => <Input {...field} />}
                      </Field>
                      <ErrorMessage name="name" component="div" className="error-message" />
                    </Form.Item>

                    <Form.Item
                      label="Nom"
                      name="lastname"
                    >
                      <Field name="lastname">
                        {({ field }) => <Input {...field} />}
                      </Field>
                      <ErrorMessage name="lastname" component="div" className="error-message" />
                    </Form.Item>

                    <Form.Item
                      label="Rôle"
                      name="role"
                    >
                      <Select
                        value={values.role}
                        onChange={(value) => setFieldValue('role', value)}
                      >
                        <Option value={0}>Utilisateur</Option>
                        <Option value={1}>Administrateur</Option>
                      </Select>
                      <ErrorMessage name="role" component="div" className="error-message" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" disabled={isSubmitting}>Enregistrer</Button>
                      <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>Supprimer</Button>
                    </Form.Item>
                  </FormikForm>
                )}
              </Formik>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}

export default UserList;
