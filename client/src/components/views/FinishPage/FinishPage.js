import React, { useState, useEffect } from 'react';
import { Result } from "antd";

function FinishPage() {

  useEffect(() => {
    localStorage.removeItem('userId');
    
  }, []);
  return (

    <div>
        <Result
            status="success"
            title="Rapport engistré avec succès !"
        />
);
    </div>
  )
}

export default FinishPage