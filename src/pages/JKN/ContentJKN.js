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
          src="https://dwh.kemendagri.go.id:7070/goto/2c457760204e8a6af4b550adc87a62bd?security_tenant=global"
          title="Dashboard JKN"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
        ></iframe>
      </div>
    </React.Fragment>
  );
};

export default ContentJKN
