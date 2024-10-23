import React, { useEffect, useState } from 'react';

const API_URI = `${process.env.REACT_APP_API_URL_BE}`

const ExpandableTable = () => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [dataGrafikPostur, setDataGrafikPostur] = useState([]);
  const [dataGrafikLabelPostur, setDataGrafikLabelPostur] = useState([]);
  const [dataGrafikValuePostur, setDataGrafikValuePostur] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProv, setLoadingProv] = useState(true);
  const [errorProv, setErrorProv] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          `${API_URI}/postur_apbd_nasional`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataGrafikPostur = await response.json();
        console.log(dataGrafikPostur.data, "data Grafik Postur wwww");

        const mappedData = dataGrafikPostur.data.reduce((acc, item) => {
          const [mainKode, subKode] = item.kode_akun.split('.');
        
          if (!subKode) {
            // Jika tidak ada subKode, maka ini adalah kode utama
            acc[mainKode] = acc[mainKode] || {
              kode: mainKode,
              nama: item.nama_akun,
              value: 0,
              detail: []
            };
            acc[mainKode].value += item.total; // Akumulasi nilai total
          } else {
            // Jika ada subKode, tambahkan ke detail
            acc[mainKode] = acc[mainKode] || {
              kode: mainKode,
              nama: item.nama_akun,
              value: 0,
              detail: []
            };
            acc[mainKode].detail.push({
              subKode: item.kode_akun,
              subNama: item.nama_akun,
              subValue: item.total
            });
          }
        
          return acc; // Mengembalikan accumulator untuk iterasi berikutnya
        }, {});

        const arrayData = Object.values(mappedData);
        // const mappedData = dataGrafikPostur.data.map((item) => ({
        //   kode: item.kode_akun,
        //   nama: item.nama_akun,
        //   value: item.total.toLocaleString()
        // }));

        console.log(arrayData,'ini isi mapped')
        
        setDataGrafikPostur(arrayData);

        console.log(dataGrafikValue1, "ini value postur");
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  }, []);
  // Dummy data
  const data = [
    {
      kode: '101',
      nama: 'Akun Kas',
      value: 1500000,
      detail: [
        { subKode: '101.1', subNama: 'Kas di Bank', subValue: 1000000 },
        { subKode: '101.2', subNama: 'Kas di Tangan', subValue: 500000 }
      ]
    },
    {
      kode: '102',
      nama: 'Akun Piutang',
      value: 300000,
      detail: [
        { subKode: '102.1', subNama: 'Piutang Usaha', subValue: 200000 },
        { subKode: '102.2', subNama: 'Piutang Lainnya', subValue: 100000 }
      ]
    },
    {
      kode: '103',
      nama: 'Akun Persediaan',
      value: 500000,
      detail: [
        { subKode: '103.1', subNama: 'Persediaan Barang', subValue: 500000 }
      ]
    },
  ];

  const handleRowClick = (rowId) => {
    const currentExpandedRows = expandedRows;
    const isRowExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowExpanded ? currentExpandedRows.filter(id => id !== rowId) : [...currentExpandedRows, rowId];

    setExpandedRows(newExpandedRows);
  };

  const renderRow = (item, idx) => {
    const isRowExpanded = expandedRows.includes(idx);

    return (
      <React.Fragment key={idx}>
        <tr onClick={() => handleRowClick(idx)} style={{ cursor: 'pointer' }}>
          <td style={{fontWeight: 600}}>{item.kode}</td>
          <td style={{fontWeight: 600}}>{item.nama}</td>
          <td style={{fontWeight: 600}}>{item.value.toLocaleString('id-ID')}</td>
        </tr>
        {isRowExpanded && item.detail.map((detailItem, detailIdx) => (
          <tr key={detailIdx} style={{ backgroundColor: '#f1f1f1' }}>
            <td style={{ paddingLeft: '20px' }}>{detailItem.subKode}</td>
            <td>{detailItem.subNama}</td>
            <td>{detailItem.subValue.toLocaleString('id-ID')}</td>
          </tr>
        ))}
      </React.Fragment>
    );
  };

  return (
    <table className="table align-middle table-nowrap table-striped-columns mb-0">
      <thead className="table-light">
        <tr>
          <th scope="col">Kode Akun</th>
          <th scope="col">Nama Akun</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {dataGrafikPostur.map((item, idx) => renderRow(item, idx))}
      </tbody>
    </table>
  );
};

export default ExpandableTable;