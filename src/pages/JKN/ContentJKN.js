import React, { useEffect, useState } from 'react';

const ContentJKN = ({ nonce }) => {
  return (
    <React.Fragment>
      <div style={{ width: '100%', height: '100vh' }}>
        {/* Nonce digunakan untuk inline script */}
        <script nonce={nonce}>
          {`
            console.log('Script dijalankan dengan nonce');
          `}
        </script>
        <iframe
          src="https://dwh.kemendagri.go.id:7070/app/dashboards#/view/7db0ffb0-d2da-11ef-a1c6-65b92e29fa43?_g=h@c823129&_a=h@e3d67ad"
          title="Embedded Web"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
        ></iframe>
      </div>
    </React.Fragment>
  );
};

export default ContentJKN
