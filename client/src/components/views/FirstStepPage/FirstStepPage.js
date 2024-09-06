import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import multitubesLogo from '../../../images/Multitubes Logo.png';
import NavBar from './Sections/NavBar';
import styles from './FirstStepPage.module.css';

// Validation schema with Yup
const validationSchema = Yup.object({
  line: Yup.number().required('Ligne is required').positive().integer(),
  date: Yup.date().required('Date is required').nullable(),
  timeSlot: Yup.string().required('Horaire is required'),
  client: Yup.string().required('Client is required'),
  articleNavision: Yup.string().required('N° article NAVISION is required'),
  orderNumber: Yup.string().required('N° Ordre is required'),
  quantity: Yup.string().required('Quantité is required'),
});

function FirstStep() {
  const formik = useFormik({
    initialValues: {
      line: 1,
      date: '08/07/2024',
      timeSlot: 'Matin',
      client: 'Loukaiencli',
      articleNavision: '04-520-5050-050',
      orderNumber: '04-520-5050-050',
      quantity: '04-520-5050-050',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // Handle form submission
    },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={multitubesLogo} alt="Multitubes Logo" className={styles.logo} />
      </header>

      <div className={styles.navBar}>
        <NavBar />
      </div>

      <form className={styles.formContainer} onSubmit={formik.handleSubmit}>
        <div className={styles.formRow}>
          <label htmlFor="line">Ligne :</label>
          <select
            id="line"
            name="line"
            value={formik.values.line}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
          {formik.touched.line && formik.errors.line ? (
            <div className={styles.error}>{formik.errors.line}</div>
          ) : null}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="date">Date :</label>
          <input
            type="text"
            id="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.date && formik.errors.date ? (
            <div className={styles.error}>{formik.errors.date}</div>
          ) : null}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="timeSlot">Horaire :</label>
          <select
            id="timeSlot"
            name="timeSlot"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Matin">Matin</option>
            <option value="Après-midi">Après-midi</option>
            <option value="Soir">Soir</option>
          </select>
          {formik.touched.timeSlot && formik.errors.timeSlot ? (
            <div className={styles.error}>{formik.errors.timeSlot}</div>
          ) : null}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="client">Client :</label>
          <input
            type="text"
            id="client"
            name="client"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.client && formik.errors.client ? (
            <div className={styles.error}>{formik.errors.client}</div>
          ) : null}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="articleNavision">N° article NAVISION :</label>
          <input
            type="text"
            id="articleNavision"
            name="articleNavision"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.articleNavision && formik.errors.articleNavision ? (
            <div className={styles.error}>{formik.errors.articleNavision}</div>
          ) : null}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="orderNumber">N° Ordre :</label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.orderNumber && formik.errors.orderNumber ? (
            <div className={styles.error}>{formik.errors.orderNumber}</div>
          ) : null}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="quantity">Quantité :</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.quantity && formik.errors.quantity ? (
            <div className={styles.error}>{formik.errors.quantity}</div>
          ) : null}
        </div>

        <div className={styles.addButtonContainer}>
          <button type="button" className={styles.addButton}>+</button>
        </div>

        <button type="submit" className={styles.nextStep}>Étape suivante :</button>
      </form>
    </div>
  );
}

export default FirstStep;
