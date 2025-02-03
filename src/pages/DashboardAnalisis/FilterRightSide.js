import React, { useEffect, useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Collapse,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
} from "reactstrap";

//SimpleBar
import SimpleBar from "simplebar-react";

// const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const FilterRightSide = ({ dataFilter = [], onSelectFilter, isLoadingList }) => {
  // open offcanvas
  const [open, setOpen] = useState(false);
  const toggleLeftCanvas = () => {
    setOpen(!open);
  };

  window.onscroll = function () {
    scrollFunction();
  };

  const scrollFunction = () => {
    const element = document.getElementById("back-to-top");
    if (element) {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    }
  };

  const toTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const [selectedValues, setSelectedValues] = useState({
    tahun:"",
    fungsi: [],
    skpd: [],
    daerah: [],
    provinsi:[],
    namaDaerah: "",
    spm: [],
    urusan: [],
    bidangUrusan: [],
    program: [],
    kegiatan: [],
    subKegiatan: [],
    objek: [],
    rincianObjek: [],
    subRincianObjek: [],
  });

  const [selectedNames, setSelectedNames] = useState({
    fungsi: [],
    skpd: [],
    provinsi:[],
    daerah: [],
    namaDaerah: "",
    spm: [],
    urusan: [],
    bidangUrusan: [],
    program: [],
    kegiatan: [],
    subKegiatan: [],
    objek: [],
    rincianObjek: [],
    subRincianObjek: [],
  })

  const cleanPayload = (payload) => {
    console.log(payload, 'ini isi payloadadd')
    return Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => !(value === "" || (Array.isArray(value) && value.length === 0) || value === null || value === undefined)
      )
    );
  };

  // const handleCheckboxChange = (event, filterType) => {
  //   const { value, checked } = event.target;

  //   // Salin state filter saat ini
  //   const updatedValues = { ...selectedValues };

  //   console.log(filterType, 'ini filter typee')
  //   if (checked) {
  //     // Tambahkan nilai jika checkbox dicentang
  //     updatedValues[filterType].push(value);
  //   } else {
  //     // Hapus nilai jika checkbox tidak dicentang
  //     updatedValues[filterType] = updatedValues[filterType].filter(
  //       (item) => item !== value
  //     );
  //   }

  //   // Perbarui state filter di child
  //   setSelectedValues(updatedValues);

  //   // Bersihkan payload sebelum dikirim ke parent
  //   const cleanedFilters = cleanPayload(updatedValues);

  //   // Kirimkan payload ke parent
  //   onSelectFilter(cleanedFilters);
  // };
  

  const handleCheckboxChange = (event, filterType, itemName) => {
    const { value, checked } = event.target;
  
    // Salin state filter saat ini
    const updatedValues = { ...selectedValues };
    const updatedNames = { ...selectedNames }; // Tambahkan logika untuk selectedNames
    
    if (checked) {
      // Tambahkan nilai ke filter dan nama ke array untuk filterType
      updatedValues[filterType].push(value);
      if (!updatedNames[filterType]) {
        updatedNames[filterType] = []; // Pastikan array ada
      }
      updatedNames[filterType].push(itemName);
    } else {
      // Hapus nilai dari filter dan nama dari array untuk filterType
      updatedValues[filterType] = updatedValues[filterType].filter(
        (item) => item !== value
      );
      updatedNames[filterType] = updatedNames[filterType].filter(
        (name) => name !== itemName
      );
    }
  
    // Perbarui state
    setSelectedValues(updatedValues);
    setSelectedNames(updatedNames); // Perbarui selectedNames
  
    // Bersihkan payload sebelum dikirim ke parent
    const cleanedFilters = cleanPayload(updatedValues);
  
    // Kirimkan payload ke parent
    onSelectFilter(cleanedFilters);
  };

  const handleRemoveName = (category, indexToRemove) => {
    // Salin state untuk pembaruan
    const updatedNames = { ...selectedNames };
    const updatedValues = { ...selectedValues };
  
    // Hapus nama berdasarkan index
    const removedName = updatedNames[category][indexToRemove];
    updatedNames[category] = updatedNames[category].filter((_, index) => index !== indexToRemove);
  
    // Hapus nilai yang terkait dengan nama yang dihapus
    updatedValues[category] = updatedValues[category].filter(
      (_, index) => index !== indexToRemove
    );
  
    // Perbarui state
    setSelectedNames(updatedNames);
    setSelectedValues(updatedValues);
  
    // Bersihkan payload sebelum dikirim ke parent
    const cleanedFilters = cleanPayload(updatedValues);
  
    // Kirimkan payload ke parent
    onSelectFilter(cleanedFilters);
  };

  const [searchFilter, setSearchFilter] = useState(""); // State untuk menampung nilai input search

  // Fungsi untuk menangani perubahan pada input
  const handleSearchInput = (e) => {
    const { value } = e.target;

    // Perbarui nilai input pencarian
    setSearchFilter(value);
  
    // Perbarui `selectedValues.namaDaerah` di state
    const updatedValues = { ...selectedValues };
    updatedValues.namaDaerah = value;
    setSelectedValues(updatedValues);
  
    // Payload tidak dikirim sampai user menekan Enter
  };

  const handleKeyDown = (e) => {
    const { value } = e.target;
  
    // Perbarui nilai input pencarian
    setSearchFilter(value);
  
    // Perbarui `selectedValues.namaDaerah` di state
    const updatedValues = { ...selectedValues };
    updatedValues.namaDaerah = value;
    setSelectedValues(updatedValues);
  
    // Jika tombol yang ditekan adalah Enter (keyCode 13)
    if (e.key === 'Enter') {
      // Bersihkan payload sebelum dikirim ke parent
      const cleanedFilters = cleanPayload(updatedValues);
  
      // Kirimkan payload ke parent
      onSelectFilter(cleanedFilters);
    }
  };

  const handleClearSearch = () => {
    setSearchFilter(""); // Kosongkan isi input
  
    // Kosongkan `namaDaerah` di state
    const updatedValues = { ...selectedValues };
    updatedValues.namaDaerah = ""
    setSelectedValues(updatedValues);
  
    // Bersihkan payload sebelum dikirim ke parent
    const cleanedFilters = cleanPayload(updatedValues);
  
    // Kirimkan payload ke parent
    onSelectFilter(cleanedFilters);
  };
  const [displayedData, setDisplayedData] = useState({
    daerah: [],
    skpd: [],
    provinsi:[],
    program: [],
    kegiatan: [],
    subKegiatan: [],
    objek: [],
    rincianObjek: [],
    subRincianObjek: [],
  });
  const [dataToShow, setDataToShow] = useState({
    daerah: 10,
    skpd: 10,
    provinsi: 10,
    program: 10,
    kegiatan: 10,
    subKegiatan: 10,
    objek: 10,
    rincianObjek: 10,
    subRincianObjek: 10,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk memuat lebih banyak data
  const loadMoreData = (namaField, dataKey) => {
    if (dataFilter[namaField] && !isLoading) {
      setIsLoading(true);

      const newData = dataFilter[namaField].slice(0, dataToShow[dataKey] + 5);

      setDisplayedData((prev) => ({
        ...prev,
        [dataKey]: newData,
      }));

      setDataToShow((prev) => ({
        ...prev,
        [dataKey]: prev[dataKey] + 5,
      }));

      setIsLoading(false);
    }
  };

  const [searchTerms, setSearchTerms] = useState({
    spm:"",
    urusan:"",
    bidangUrusan: "",
    fungsi:"",
    daerah: "",
    skpd: "",
    provinsi: "",
    program: "",
    kegiatan: "",
    subKegiatan: "",
    objek: "",
    rincianObjek: "",
    subRincianObjek: "",
  });
  
  const handleSearchChange = (e, key) => {
    setSearchTerms((prev) => ({ ...prev, [key]: e.target.value }));
  };
  
  const handleClearSearchTerm = (key) => {
    setSearchTerms((prev) => ({ ...prev, [key]: "" }));
  };

  // Fungsi untuk memfilter data berdasarkan pencarian
  const filterData = (data, searchTerm, searchFields) => {
    if (!searchTerm) return data; // Jika tidak ada pencarian, kembalikan semua data
  
    return data.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredData = {
    spm: filterData(dataFilter.filter_spm, searchTerms.spm, ['spm_teks']),
    fungsi: filterData(dataFilter.filter_fungsi, searchTerms.fungsi, ['nama_fungsi']),
    urusan: filterData(dataFilter.filter_urusan, searchTerms.urusan, ['nama_urusan']),
    bidangUrusan: filterData(dataFilter.filter_bidang_urusan, searchTerms.bidangUrusan, ['nama_bidang_urusan']),
    daerah: filterData(displayedData.daerah, searchTerms.daerah, ['nama_daerah']),
    skpd: filterData(displayedData.skpd, searchTerms.skpd, ['nama_skpd']),
    provinsi: filterData(displayedData.provinsi, searchTerms.provinsi, ['nama_prov']),
    program: filterData(displayedData.program, searchTerms.program, ['nama_program']),
    kegiatan: filterData(displayedData.kegiatan, searchTerms.kegiatan, ['nama_giat']),
    subKegiatan: filterData(displayedData.subKegiatan, searchTerms.subKegiatan, ['nama_sub_giat']),
    objek: filterData(displayedData.objek, searchTerms.objek, ['nama_objek']),
    rincianObjek: filterData(displayedData.rincianObjek, searchTerms.rincianObjek, ['nama_ro']),
    subRincianObjek: filterData(displayedData.subRincianObjek, searchTerms.subRincianObjek, ['nama_sro']),
  };

  // Fungsi untuk memuat lebih banyak data berdasarkan kategori
  // const loadMoreData = (namaField, dataKey) => {
  //   if (dataFilter[namaField] && !isLoading) {
  //     setIsLoading(true);

  //     const newData = dataFilter[namaField].slice(0, dataToShow[dataKey] + 5);

  //     setDisplayedData((prev) => ({
  //       ...prev,
  //       [dataKey]: newData,
  //     }));

  //     // Update jumlah data yang ditampilkan
  //     setDataToShow((prev) => ({
  //       ...prev,
  //       [dataKey]: prev[dataKey] + 5,
  //     }));

  //     setIsLoading(false);
  //   }
  // };

  // Fungsi untuk menangani scroll
  const handleScroll = (e, namaField, dataKey) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 10;
    if (bottom) {
      loadMoreData(namaField, dataKey);
    }
  };

  // Gunakan useEffect untuk setiap kategori
  useEffect(() => {
    loadMoreData("filter_program", "program");
  }, [dataFilter]);

  useEffect(() => {
    loadMoreData("filter_subgiat", "subKegiatan");
  }, [dataFilter]);

  useEffect(() => {
    loadMoreData("filter_giat", "kegiatan");
  }, [dataFilter]);

  useEffect(() => {
    loadMoreData("filter_objek", "objek");
  }, [dataFilter]);

  useEffect(() => {
    loadMoreData("filter_ro", "rincianObjek");
  }, [dataFilter]);

  useEffect(() => {
    loadMoreData("filter_sro", "subRincianObjek");
  }, [dataFilter]);

  useEffect(() => {
    loadMoreData("filter_skpd", "skpd");
  }, [dataFilter]);

  useEffect(() => {
    loadMoreData("filter_daerah", "daerah");
  }, [dataFilter]);

  useEffect(() => {
    loadMoreData("filter_provinsi", "provinsi");
  }, [dataFilter]);

  const resetFilters = () => {
    // Reset state selectedValues ke nilai awal
    const initialValues = {
      skpd: [],
      daerah: [],
      provinsi: [],
      namaDaerah:"",
      fungsi: [],
      spm: [],
      urusan: [],
      bidangUrusan: [],
      program: [],
      kegiatan: [],
      subKegiatan: [],
      objek: [],
      rincianObjek: [],
      subRincianObjek: [],
    };

    const initialNames = {
      skpd: [],
      daerah: [],
      namaDaerah:"",
      fungsi: [],
      provinsi: [],
      spm: [],
      urusan: [],
      bidangUrusan: [],
      program: [],
      kegiatan: [],
      subKegiatan: [],
      objek: [],
      rincianObjek: [],
      subRincianObjek: [],
    };

    setSelectedValues(initialValues);
    setSelectedNames(initialNames);
    
    // Kirimkan payload kosong ke parent
    onSelectFilter(cleanPayload(initialValues));
  };

  const [selectedTahun, setSelectedTahun] = useState("2024");
  const handleSelectChangeTahun = (e) => {
    const { name, value } = e.target;
    setSelectedTahun(value)
    const updatedValues = { ...selectedValues };
    updatedValues.tahun= value
    setSelectedValues(updatedValues);
  
    // Bersihkan payload sebelum dikirim ke parent
    const cleanedFilters = cleanPayload(updatedValues);
  
    // Kirimkan payload ke parent
    onSelectFilter(cleanedFilters);
  };

  return (
    <React.Fragment>
      <button
        onClick={() => toTop()}
        className="btn btn-danger btn-icon"
        id="back-to-top"
      >
        <i className="ri-arrow-up-line"></i>
      </button>

      <div>
        <div className="customizer-setting d-none d-md-block">
          <div
            onClick={toggleLeftCanvas}
            className="btn-info rounded-pill shadow-lg btn btn-icon btn-lg p-2"
          >
            <i className="mdi mdi-filter-outline fs-22"></i>
          </div>
        </div>
        <Offcanvas
          style={{ width: "700px" }}
          isOpen={open}
          toggle={toggleLeftCanvas}
          direction="end"
          className="bg-light offcanvas-end border-0"
        >
          <OffcanvasHeader
            className="d-flex align-items-center bg-light bg-gradient p-3 offcanvas-header-light"
            toggle={toggleLeftCanvas}
          >
            <i className="mdi mdi-filter-outline fs-22"></i>
            <span className="m-0 me-2 text-dark">FILTER</span>
            <button
              onClick={resetFilters}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              Reset Filter
            </button>
            {/* <div className="d-flex justify-content-center align-items-center">
            <i className="mdi mdi-calendar fs-22"></i>
            <span className="m-0 me-2 text-dark">TAHUN:</span>
            <select
            name="tahunPerencanaan"
              style={{
                padding: "5px 10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                // marginLeft: "10px"
              }}
              value={selectedTahun}
              onChange={handleSelectChangeTahun}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>                    
            </select>
            </div> */}
          </OffcanvasHeader>
          <OffcanvasBody className="p-0">
            <SimpleBar className="h-100 p-2">
              <Row>
              <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#2DAED4",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            width: "30%",
                            fontSize: "12px",
                          }}
                        >
                          Se-Provinsi
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                       <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['provinsi']}
                          onChange={(e) => handleSearchChange(e, 'provinsi')}
                          placeholder="Cari Provinsi"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['provinsi'] && (
                          <button
                            onClick={() => handleClearSearchTerm('provinsi')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["provinsi"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["provinsi"].map((name, index) => 
                            (
                            <li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                            <div className="d-flex justify-content-between align-items-center">
                              <div style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}>
                                {name}
                              </div>                              
                              
                              <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('provinsi', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>                              
                            </li>                            
                          )
                          )}
                        </ul>
                        
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) =>
                          handleScroll(e, "filter_provinsi", "provinsi")
                        }
                      >
                        {filteredData['provinsi'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "provinsi", item.nama_prov)
                              }
                              checked={selectedValues.provinsi.includes(
                                item.kode_prov
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-provinsi-${index}`}
                              value={item.kode_prov}
                            />
                            <label
                              class="form-check-label"
                              for={`check-provinsi-${index}`}
                            >
                              {item.nama_prov}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col> 
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#FFE038",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            width: "30%",
                            fontSize: "12px",
                          }}
                        >
                          Daerah
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                        <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['daerah']}
                          onChange={(e) => handleSearchChange(e, 'daerah')}
                          // onKeyDown={(e) => handleKeyDown(e)}
                          placeholder="Cari Daerah"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['daerah'] && (
                          <button
                            onClick={() => handleClearSearchTerm('daerah')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["daerah"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["daerah"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                            <div className="d-flex justify-content-between align-items-center">
                              <div style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}>
                                {name}
                              </div>                              
                              <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('daerah', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>
                            </li>)
                            
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) =>
                          handleScroll(e, "filter_daerah", "daerah")
                        }
                      >
                        {filteredData['daerah'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "daerah", item.nama_daerah)
                              }
                              checked={selectedValues.daerah.includes(
                                item.kode_ddn
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-daerah-${index}`}
                              value={item.kode_ddn}
                            />
                            <label
                              class="form-check-label"
                              for={`check-daerah-${index}`}
                            >
                              {item.nama_daerah}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>           
              </Row>
              <Row>
              <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#B7EBF2",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "12px",
                          }}
                        >
                          SKPD
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                       <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['skpd']}
                          onChange={(e) => handleSearchChange(e, 'skpd')}
                          placeholder="Cari skpd"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['skpd'] && (
                          <button
                            onClick={() => handleClearSearchTerm('skpd')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["skpd"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["skpd"].map((name, index) => {
                            return(
                            <li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            >
                              <div className="d-flex justify-content-between align-items-center">
                              <div style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}>
                                {name}
                              </div>
                              <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('skpd', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                              </div> 
                            </li>)
                            
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) => handleScroll(e, "filter_skpd", "skpd")}
                      >
                        {filteredData['skpd'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) => handleCheckboxChange(e, "skpd", item.nama_skpd)}
                              checked={selectedValues.skpd.includes(
                                item.kode_skpd
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-skpd-${index}`}
                              value={item.kode_skpd}
                            />
                            <label
                              class="form-check-label"
                              for={`check-skpd-${index}`}
                            >
                              {item.nama_skpd}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#FCAD24",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            width: "30%",
                            fontSize: "12px",
                          }}
                        >
                          Fungsi
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                        <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['fungsi']}
                          onChange={(e) => handleSearchChange(e, 'fungsi')}
                          // onKeyDown={(e) => handleKeyDown(e)}
                          placeholder="Cari Fungsi"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['fungsi'] && (
                          <button
                            onClick={() => handleClearSearchTerm('fungsi')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["fungsi"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["fungsi"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                            <div className="d-flex justify-content-between align-items-center">
                              <div style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}>
                                {name}
                              </div>
                              <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('fungsi', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                              </div> 
                            </li>)
                            
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div style={{ overflowY: "auto", maxHeight: "300px" }}>
                        {filteredData['fungsi'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "fungsi", item.nama_fungsi)
                              }
                              checked={selectedValues.fungsi.includes(
                                item.kode_fungsi
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-fungsi-${index}`}
                              value={item.kode_fungsi}
                            />
                            <label
                              class="form-check-label"
                              for={`check-fungsi-${index}`}
                            >
                              {item.nama_fungsi}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>    
              </Row>
              <Row>
              <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#F35F52",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "12px",
                          }}
                        >
                          SPM
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                        <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['spm']}
                          onChange={(e) => handleSearchChange(e, 'spm')}
                          // onKeyDown={(e) => handleKeyDown(e)}
                          placeholder="Cari spm"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['spm'] && (
                          <button
                            onClick={() => handleClearSearchTerm('spm')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["spm"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["spm"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                            <div className="d-flex justify-content-between align-items-center">
                              <div style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}>
                                {name}
                              </div>
                              <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('spm', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                              </div>
                            </li>)
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div style={{ overflowY: "auto", maxHeight: "300px" }}>
                        {filteredData['spm'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) => handleCheckboxChange(e, "spm", item.spm_teks)}
                              checked={selectedValues.spm.includes(
                                String(item.id_spm)
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-spm-${index}`}
                              value={String(item.id_spm)}
                            />
                            <label
                              class="form-check-label"
                              for={`check-spm-${index}`}
                            >
                              {item.spm_teks}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#FFB7F1",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            width: "30%",
                            fontSize: "12px",
                          }}
                        >
                          Urusan
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                        <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['urusan']}
                          onChange={(e) => handleSearchChange(e, 'urusan')}
                          // onKeyDown={(e) => handleKeyDown(e)}
                          placeholder="Cari Urusan"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['urusan'] && (
                          <button
                            onClick={() => handleClearSearchTerm('urusan')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                     {selectedNames["urusan"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          {selectedNames["urusan"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                            <div className="d-flex justify-content-between align-items-center">
                              <div style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}>
                                {name}
                              </div>
                              <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('urusan', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                              </div>
                            </li>)
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div style={{ overflowY: "auto", maxHeight: "300px" }}>
                        {filteredData['urusan'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "urusan", item.nama_urusan)
                              }
                              checked={selectedValues.urusan.includes(
                                item.kode_urusan
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-urusan-${index}`}
                              value={item.kode_urusan}
                            />
                            <label
                              class="form-check-label"
                              for={`check-urusan-${index}`}
                            >
                              {item.nama_urusan}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
              <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#65FFDC",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",

                            fontSize: "12px",
                          }}
                        >
                          Bidang Urusan
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                        <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['bidangUrusan']}
                          onChange={(e) => handleSearchChange(e, 'bidangUrusan')}
                          // onKeyDown={(e) => handleKeyDown(e)}
                          placeholder="Cari Bidang Urusan"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['bidangUrusan'] && (
                          <button
                            onClick={() => handleClearSearchTerm('bidangUrusan')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["bidangUrusan"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["bidangUrusan"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > <div className="d-flex justify-content-between align-items-center">
                            <div style={{
                            fontSize: "14px",
                            color: "green",
                            whiteSpace: "nowrap", // Agar teks tidak membungkus
                            overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                            textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                            width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                          }}>
                              {name}
                            </div>
                            <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('bidangUrusan', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>
                            </li>)
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div style={{ overflowY: "auto", maxHeight: "300px" }}>
                        {filteredData['bidangUrusan'].map(
                          (item, index) => (
                            <div key={index} class="form-check mb-2">
                              <input
                                onChange={(e) =>
                                  handleCheckboxChange(e, "bidangUrusan", item.nama_bidang_urusan)
                                }
                                checked={selectedValues.bidangUrusan.includes(
                                  item.kode_bidang_urusan
                                )}
                                class="form-check-input"
                                type="checkbox"
                                id={`check-bidang-urusan-${index}`}
                                value={item.kode_bidang_urusan}
                              />
                              <label
                                class="form-check-label"
                                for={`check-bidang-urusan-${index}`}
                              >
                                {item.nama_bidang_urusan}
                              </label>
                            </div>
                          )
                        )}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#007bff",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            width: "30%",
                            fontSize: "12px",
                          }}
                        >
                          Program
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                       <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['program']}
                          onChange={(e) => handleSearchChange(e, 'program')}
                          placeholder="Cari Program"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['program'] && (
                          <button
                            onClick={() => handleClearSearchTerm('program')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["program"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["program"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                              <div className="d-flex justify-content-between align-items-center">
                            <div style={{
                            fontSize: "14px",
                            color: "green",
                            whiteSpace: "nowrap", // Agar teks tidak membungkus
                            overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                            textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                            width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                          }}>
                              {name}
                            </div>
                            <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('program', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>
                            </li>)
                            
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) =>
                          handleScroll(e, "filter_program", "program")
                        }
                      >
                        {filteredData['program'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "program", item.nama_program)
                              }
                              checked={selectedValues.program.includes(
                                item.kode_program
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-program-${index}`}
                              value={item.kode_program}
                            />
                            <label
                              class="form-check-label"
                              for={`check-program-${index}`}
                            >
                              {item.nama_program}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>       
              </Row>
              <Row>
              <Col md={6}>
                  <Card
                    className="card-height-100 card-animate"
                    onScroll={(e) =>
                      handleScroll(e, "filter_kegiatan", "kegiatan")
                    }
                  >
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#2DAED4",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",

                            fontSize: "12px",
                          }}
                        >
                          Kegiatan
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                       <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['kegiatan']}
                          onChange={(e) => handleSearchChange(e, 'kegiatan')}
                          placeholder="Cari Kegiatan"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['kegiatan'] && (
                          <button
                            onClick={() => handleClearSearchTerm('kegiatan')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["kegiatan"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["kegiatan"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                            <div className="d-flex justify-content-between align-items-center">
                            <div style={{
                            fontSize: "14px",
                            color: "green",
                            whiteSpace: "nowrap", // Agar teks tidak membungkus
                            overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                            textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                            width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                          }}>
                              {name}
                            </div>
                            <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('kegiatan', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>
                            </li>)
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) =>
                          handleScroll(e, "filter_giat", "kegiatan")
                        }
                      >
                        {filteredData['kegiatan'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "kegiatan", item.nama_giat)
                              }
                              checked={selectedValues.kegiatan.includes(
                                item.kode_giat
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-kegiatan-${index}`}
                              value={item.kode_giat}
                            />
                            <label
                              class="form-check-label"
                              for={`check-kegiatan-${index}`}
                            >
                              {item.nama_giat}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#FFE038",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            width: "30%",
                            fontSize: "12px",
                          }}
                        >
                          Sub Kegiatan
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                       <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['subKegiatan']}
                          onChange={(e) => handleSearchChange(e, 'subKegiatan')}
                          placeholder="Cari sub Kegiatan"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['subKegiatan'] && (
                          <button
                            onClick={() => handleClearSearchTerm('subKegiatan')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["subKegiatan"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["subKegiatan"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                              <div className="d-flex justify-content-between align-items-center">
                            <div style={{
                            fontSize: "14px",
                            color: "green",
                            whiteSpace: "nowrap", // Agar teks tidak membungkus
                            overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                            textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                            width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                          }}>
                              {name}
                            </div>
                            <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('subKegiatan', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>
                            </li>)
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<> <div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) =>
                          handleScroll(e, "filter_subgiat", "subKegiatan")
                        }
                      >
                        {filteredData['subKegiatan'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "subKegiatan", item.nama_sub_giat)
                              }
                              checked={selectedValues.subKegiatan.includes(
                                item.kode_sub_giat
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-sub-kegiatan-${index}`}
                              value={item.kode_sub_giat}
                            />
                            <label
                              class="form-check-label"
                              for={`check-sub-kegiatan-${index}`}
                            >
                              {item.nama_sub_giat}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                     
                    </CardBody>
                  </Card>
                </Col>        
              </Row>
              <Row>
              <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#AE9DF7",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",

                            fontSize: "12px",
                          }}
                        >
                          Objek
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                       <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['objek']}
                          onChange={(e) => handleSearchChange(e, 'objek')}
                          placeholder="Cari Objek"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['objek'] && (
                          <button
                            onClick={() => handleClearSearchTerm('objek')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["objek"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["objek"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                               <div className="d-flex justify-content-between align-items-center">
                            <div style={{
                            fontSize: "14px",
                            color: "green",
                            whiteSpace: "nowrap", // Agar teks tidak membungkus
                            overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                            textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                            width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                          }}>
                              {name}
                            </div>
                            <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('objek', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>
                            </li>)
                            
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) =>
                          handleScroll(e, "filter_objek", "objek")
                        }
                      >
                        {filteredData['objek'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) => handleCheckboxChange(e, "objek", item.nama_objek)}
                              checked={selectedValues.objek.includes(
                                item.kode_objek
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-objek-${index}`}
                              value={item.kode_objek}
                            />
                            <label
                              class="form-check-label"
                              for={`check-objek-${index}`}
                            >
                              {item.nama_objek}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#E5D3B4",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            width: "30%",
                            fontSize: "12px",
                          }}
                        >
                          Rincian Objek
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                       <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['rincianObjek']}
                          onChange={(e) => handleSearchChange(e, 'rincianObjek')}
                          placeholder="Cari Rincian Objek"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['rincianObjek'] && (
                          <button
                            onClick={() => handleClearSearchTerm('rincianObjek')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["rincianObjek"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["rincianObjek"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                              <div className="d-flex justify-content-between align-items-center">
                            <div style={{
                            fontSize: "14px",
                            color: "green",
                            whiteSpace: "nowrap", // Agar teks tidak membungkus
                            overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                            textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                            width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                          }}>
                              {name}
                            </div>
                            <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('rincianObjek', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>
                              
                            </li>)
                            
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) =>
                          handleScroll(e, "filter_ro", "rincianObjek")
                        }
                      >
                        {filteredData['rincianObjek'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "rincianObjek", item.nama_ro)
                              }
                              checked={selectedValues.rincianObjek.includes(
                                item.kode_ro
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-rincian-objek-${index}`}
                              value={item.kode_ro}
                            />
                            <label
                              class="form-check-label"
                              for={`check-rincian-objek-${index}`}
                            >
                              {item.nama_ro}
                            </label>
                          </div>
                        ))}                        
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>
                
              </Row>
              <Row>
              <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="mb-3">
                        <span
                          style={{
                            backgroundColor: "#B7EBF2",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",

                            fontSize: "12px",
                          }}
                        >
                          Sub Rincian Objek
                        </span>
                      </div>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "300px",
                          marginBottom: "10px",
                        }}
                      >
                       <input
                          style={{
                            padding: "5px 15px 5px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                          }}
                          type="text"
                          value={searchTerms['subRincianObjek']}
                          onChange={(e) => handleSearchChange(e, 'subRincianObjek')}
                          placeholder="Cari sub Rincian Objek"
                        />
                        {/* Tombol "X" di dalam input */}
                        {searchTerms['subRincianObjek'] && (
                          <button
                            onClick={() => handleClearSearchTerm('subRincianObjek')}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)", // Tengah-tengah secara vertikal
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "#999",
                            }}
                          >
                            &#10006;
                          </button>
                        )}
                      </div>
                      {selectedNames["subRincianObjek"]?.length > 0 ? (
                        <ul style={{ padding: "0", marginBottom: "20px" }}>
                          <div style={{ fontSize: "14px", color: "gray" }}>Filter yang dipilih:</div>
                          {selectedNames["subRincianObjek"].map((name, index) => {
                            return(<li key={index}  style={{
                              fontSize: "14px",
                              color: "green",
                              whiteSpace: "nowrap", // Agar teks tidak membungkus
                              overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                              textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                              width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                            }}
                            title={name} // Tambahkan title untuk tooltip pada hover
                            > 
                             <div className="d-flex justify-content-between align-items-center">
                            <div style={{
                            fontSize: "14px",
                            color: "green",
                            whiteSpace: "nowrap", // Agar teks tidak membungkus
                            overflow: "hidden",   // Sembunyikan teks yang melebihi batas
                            textOverflow: "ellipsis", // Tampilkan elipsis untuk teks yang panjang
                            width: "250px",       // Atur lebar maksimal elemen (sesuai kebutuhan)
                          }}>
                              {name}
                            </div>
                            <button
                              style={{
                                marginLeft: "10px",
                                background: "transparent",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                fontSize: "16px",
                              }}
                              onClick={() => handleRemoveName('subRincianObjek', index)} // Panggil fungsi untuk menghapus
                            >
                              &times;
                            </button>
                            </div>
                              
                            </li>)
                            
                          })}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "14px", color: "gray" }}>
                          Tidak ada filter yang dipilih.
                        </p>
                      )}
                      {isLoadingList ? (<><Spinner size="lg" color="primary" className="me-2">
                        Loading...
                      </Spinner></>) : (<><div
                        style={{ overflowY: "auto", maxHeight: "300px" }}
                        onScroll={(e) =>
                          handleScroll(e, "filter_sro", "subRincianObjek")
                        }
                      >                        
                        {filteredData['subRincianObjek'].map((item, index) => (
                          <div key={index} class="form-check mb-2">
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "subRincianObjek", item.nama_sro)
                              }
                              checked={selectedValues.subRincianObjek.includes(
                                item.kode_sro
                              )}
                              class="form-check-input"
                              type="checkbox"
                              id={`check-sub-rincian-objek-${index}`}
                              value={item.kode_sro}
                            />
                            <label
                              class="form-check-label"
                              for={`check-sub-rincian-objek-${index}`}
                            >
                              {item.nama_sro}
                            </label>
                          </div>
                        ))}
                      </div></>)}
                      
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </SimpleBar>
          </OffcanvasBody>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};

export default FilterRightSide;
