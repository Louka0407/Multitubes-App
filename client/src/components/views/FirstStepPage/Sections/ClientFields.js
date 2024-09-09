import React from 'react';
import styles from '../FirstStepPage.module.css';

function ClientFields({ index, values, handleChange, handleBlur, errors, touched }) {
  return (
    <div className={styles.clientFields}>
      <div className={styles.formRow}>
        <label htmlFor={`client-${index}`}>Client :</label>
        <input
          type="text"
          id={`client-${index}`}
          name={`clients[${index}].client`}
          value={values.client}
          onChange={handleChange}
          onBlur={handleBlur}
          className={styles.inputField}
        />
        {touched.client && errors.client && <div className={styles.error}>{errors.client}</div>}
      </div>

      <div className={styles.formRow}>
        <label htmlFor={`articleNavision-${index}`}>N° article NAVISION :</label>
        <input
          type="text"
          id={`articleNavision-${index}`}
          name={`clients[${index}].articleNavision`}
          value={values.articleNavision}
          onChange={handleChange}
          onBlur={handleBlur}
          className={styles.inputField}
        />
        {touched.articleNavision && errors.articleNavision && (
          <div className={styles.error}>{errors.articleNavision}</div>
        )}
      </div>

      <div className={styles.formRow}>
        <label htmlFor={`orderNumber-${index}`}>N° Ordre :</label>
        <input
          type="text"
          id={`orderNumber-${index}`}
          name={`clients[${index}].orderNumber`}
          value={values.orderNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className={styles.inputField}
        />
        {touched.orderNumber && errors.orderNumber && (
          <div className={styles.error}>{errors.orderNumber}</div>
        )}
      </div>

      <div className={styles.formRow}>
        <label htmlFor={`quantity-${index}`}>Quantité :</label>
        <input
          type="text"
          id={`quantity-${index}`}
          name={`clients[${index}].quantity`}
          value={values.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          className={styles.inputField}
        />
        {touched.quantity && errors.quantity && <div className={styles.error}>{errors.quantity}</div>}
      </div>
      <hr/>
    </div>
  );
}

export default ClientFields;
