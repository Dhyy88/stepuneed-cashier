import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Loading from "../../../components/Loading";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
// import { Select } from "antd";

const Cars = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });

  const [data_brand, setDataBrand] = useState(null);

  const [brand, setBrand] = useState("");
  const [uid, setUid] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [full_name, setFullName] = useState("");
  const [yearInputs, setYearInputs] = useState([""]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({ search: "", paginate: 7, brand: "" });
  const [editMode, setEditMode] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brand_select, setBrandSelect] = useState(null)

  async function getDataCars(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.CARS, {
        page: query?.page,
        paginate: query?.paginate,
        search: query?.search,
        brand: query?.brand,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      Swal.fire("error", error?.response?.data?.message, "error");
      setIsLoading(false);
    }
  }

  const getBrand = () => {
    axios.get(ApiEndpoint.BRANDS_CARS).then((response) => {
      setDataBrand(response?.data?.data);
    });
  };

  const onSubmit = async () => {
    setIsLoadingButton(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });
    setIsLoadingButton(true);
    if (confirmResult.isConfirmed) {
      try {
        await axios.post(ApiEndpoint.CREATE_CARS, {
          brand: brand_select?.value,
          model: model,
          year: yearInputs.map((yearInput) => yearInput.toString()),
          // year: yearInputs.map((yearInput) => parseInt(yearInput)),
        });
        Swal.fire("Berhasil", "Model mobil telah ditambahkan", "success");
        getDataCars(query);
        resetForm();
        setIsLoadingButton(false);
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus model mobil ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const { value: input } = await Swal.fire({
          icon: "warning",
          title: "Verifikasi",
          text: `Silahkan ketik "hapus" untuk melanjutkan verifikasi hapus data !`,
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Konfirmasi",
          cancelButtonText: "Batal",
          inputValidator: (value) => {
            if (!value || value.trim().toLowerCase() !== "hapus") {
              return 'Anda harus memasukkan kata "hapus" untuk melanjutkan verifikasi hapus data!';
            }
          },
        });

        if (input && input.trim().toLowerCase() === "hapus") {
          await axios.delete(`${ApiEndpoint.CARS}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data model mobil ini.",
            "success"
          );
          getDataCars(query);
        } else {
          Swal.fire("Batal", "Hapus data model mobil dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  const addYearInput = () => {
    setYearInputs([...yearInputs, ""]);
  };

  const updateYearInput = (index, value) => {
    const newYearInputs = [...yearInputs];
    newYearInputs[index] = value;
    setYearInputs(newYearInputs);
  };

  const removeYearInput = (index) => {
    const newYearInputs = [...yearInputs];
    newYearInputs.splice(index, 1);
    setYearInputs(newYearInputs);
  };

  const updateBrandModel = (newBrand, newModel) => {
    setBrand(newBrand);
    setModel(newModel);
  };

  const handlePrevPagination = () => {
    if (data.prev_page_url) {
      setQuery({ ...query, page: data.current_page - 1 });
    }
  };

  const handleNextPagination = () => {
    if (data.next_page_url) {
      setQuery({ ...query, page: data.current_page + 1 });
    }
  };

  const handleFirstPagination = () => {
    setQuery({ ...query, page: 1 });
  };

  const handleLastPagination = () => {
    setQuery({ ...query, page: data.last_page });
  };

  const generatePageNumbers = () => {
    const totalPages = data.last_page;
    const maxPageNumbers = 5;
    const currentPage = data.current_page;
    const middlePage = Math.floor(maxPageNumbers / 2);
    const startPage = Math.max(currentPage - middlePage, 1);
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const pageNumbers = [];
    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push({ page, active: page === currentPage });
    }

    return pageNumbers;
  };

  useEffect(() => {
    getDataCars(query);
  }, [query]);

  useEffect(() => {
    getBrand();
  }, []);

  const resetForm = () => {
    setBrand("");
    setModel("");
    setYearInputs([""]);
    setEditMode(false);
    setBrandSelect(null);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8 col-span-12">
          <Card title="Model Mobil">
            <div className="md:flex justify-end items-center mb-4">
              <div className="md:flex items-center gap-3 w-52">
                <Select
                  className="react-select mr-5 w-full"
                  classNamePrefix="select"
                  placeholder="Pilih Brand..."
                  options={[
                    { value: "", label: "Semua Brand" },
                    ...(data_brand?.map((item) => ({
                      value: item.uid,
                      label: item.brand,
                    })) || []),
                  ]}
                  style={{
                    height: 40,
                  }}
                  onChange={(value) => {
                    setQuery({ ...query, brand: value?.value });
                    setSelectedBrand(value);
                  }}
                  value={selectedBrand}
                  showSearch
                  isClearable
                />
              </div>
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <Textinput
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari model mobil..."
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  {isLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Nama Mobil
                            </th>
                            <th scope="col" className=" table-th ">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex justify-center text-secondary p-10">
                        <Loading />
                      </div>
                    </>
                  ) : data?.data?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Nama Mobil
                            </th>
                            <th scope="col" className=" table-th ">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex flex-col justify-center text-secondary p-10">
                        <div className="w-full flex justify-center mb-3">
                          <span className="text-slate-900 dark:text-white text-[100px] transition-all duration-300">
                            <Icon icon="heroicons:information-circle" />
                          </span>
                        </div>
                        <div className="w-full flex justify-center text-secondary">
                          <span className="text-slate-900 dark:text-white text-[20px] transition-all duration-300">
                            Model Mobil belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Nama Mobil
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item?.full_name} </td>

                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
                                <Tooltip
                                  content="Edit"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() =>
                                      navigate(`/cars/update/${item.uid}`)
                                    }
                                  >
                                    <Icon icon="heroicons:pencil-square" />
                                  </button>
                                </Tooltip>
                                <Tooltip
                                  content="Hapus"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                  theme="danger"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() => onDelete(item.uid)}
                                  >
                                    <Icon icon="heroicons:trash" />
                                  </button>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="custom-class flex justify-end mt-4">
                    <ul className="pagination">
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleFirstPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-double-left" />
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handlePrevPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-left" />
                        </button>
                      </li>

                      {generatePageNumbers().map((pageNumber) => (
                        <li key={pageNumber.page}>
                          <button
                            className={`${
                              pageNumber.active ? "active" : ""
                            } page-link`}
                            onClick={() =>
                              setQuery({ ...query, page: pageNumber.page })
                            }
                          >
                            {pageNumber.page}
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleNextPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-right" />
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-xl leading-4 text-slate-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn "
                          onClick={handleLastPagination}
                        >
                          <Icon icon="heroicons-outline:chevron-double-right" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/*end*/}
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title={"Tambah Model Mobil"}>
            <div className="text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded p-5">
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor="hh" className="form-label">
                  Brand Mobil *
                </label>
                <Select
                  className="react-select mb-2 w-full "
                  classNamePrefix="select"
                  placeholder="Pilih brand..."
                  options={data_brand?.map((item) => ({
                    value: item.uid,
                    label: item.brand,
                  }))}
                  onChange={(optionSelect) => setBrandSelect(optionSelect)}
                  value={brand_select}
                  showSearch
                  style={{
                    height: 40,
                  }}
                  isClearable
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.brand}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Model mobil *"
                  type="text"
                  placeholder="Masukkan model mobil yang valid"
                  onChange={(e) => setModel(e.target.value)}
                  value={model}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.model}
                  </span>
                )}
              </div>

              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <div className="flex row justify-between items-center mb-2">
                  <label htmlFor="hh" className="form-label">
                    Tahun keluaran *
                  </label>
                  <div className="flex row justify-end gap-2">
                    <button
                      type="button"
                      className="action-btn"
                      onClick={() => {
                        addYearInput();
                        updateBrandModel(brand, model);
                      }}
                    >
                      <Icon icon="heroicons:plus" />
                    </button>
                  </div>
                </div>

                {yearInputs.map((yearInput, index) => (
                  <div key={index} className="items-center mb-2">
                    <div className="flex row justify-between items-center mb-2">
                      <div className={index > 0 ? "w-full mr-2" : "w-full"}>
                        <Textinput
                          type="text"
                          placeholder="Tahun keluaran"
                          value={yearInput}
                          onChange={(e) => {
                            updateYearInput(index, e.target.value);
                          }}
                          key={index}
                        />
                      </div>
                      <div className="">
                        {index > 0 && (
                          <button
                            className="action-btn flex"
                            onClick={() => {
                              removeYearInput(index);
                            }}
                          >
                            <Icon icon="heroicons:trash" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {error && error.yearInput && error.yearInput[index] && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.yearInput[index]}
                  </span>
                )}
              </div>

              <div className="text-base text-end text-slate-600 dark:text-slate-300">
                {editMode ? (
                  <Button
                    text={isLoadingButton ? <LoadingButton /> : "Ubah"}
                    className="btn-primary dark w-full mr-2 mb-2 "
                    onClick={onUpdate}
                    disabled={isLoadingButton}
                  />
                ) : (
                  <Button
                    text={isLoadingButton ? <LoadingButton /> : "Simpan"}
                    className="btn-primary dark w-full mr-2 mb-2 "
                    onClick={onSubmit}
                    disabled={isLoadingButton}
                  />
                )}
                {editMode ? (
                  <Button
                    text="Batal"
                    className="btn-primary light w-full"
                    onClick={resetForm}
                  />
                ) : (
                  <Button
                    text="Reset"
                    className="btn-primary light w-full"
                    onClick={resetForm}
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Cars;
