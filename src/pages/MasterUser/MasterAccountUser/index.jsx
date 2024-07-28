import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Loading from "../../../components/Loading";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    search: "",
    paginate: 1,
    gender: "",
    is_active: "",
  });
  const [editMode, setEditMode] = useState(false);

  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [gender, setGender] = useState(null);
  const [phone_number, setPhoneNumber] = useState("");
  const [birth, setBirth] = useState("");

  async function getHO(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.HO, {
        search: query?.search,
        page: query?.page,
        paginate: 5,
        gender: query?.gender,
        is_active: query?.is_active,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }
  const onSubmit = async () => {
    setIsLoadingButton(true)
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });
    setIsLoadingButton(true)
    if (confirmResult.isConfirmed) {
      if (
        gender === null ||
        (gender.value !== "Laki-Laki" && gender.value !== "Perempuan")
      ) {
        setError({ gender: "Pilih jenis kelamin yang valid." });
        return;
      }
      try {
        const genderValue = gender.value === "Laki-Laki" ? "L" : "P";
        await axios.post(ApiEndpoint.HO_CREATE, {
          email: email,
          first_name: first_name,
          last_name: last_name,
          gender: genderValue,
          phone_number: phone_number,
          birth: birth,
        });

        Swal.fire("Berhasil", "Pengguna berhasil ditambahkan", "success");
        getHO(query);
        resetForm();
        setIsLoadingButton(false)
        // setError(null);
      } catch (err) {
        setError(err.response.data.errors);
        setIsLoadingButton(false)
        Swal.fire("Gagal", err.response.data.message, "error");
      }
    } else {
      setIsLoadingButton(false)
    }
  };

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus pengguna ini?",
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
          await axios.delete(`${ApiEndpoint.HO}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data pengguna ini.",
            "success"
          );
          getHO(query);
        } else {
          Swal.fire("Batal", "Hapus data pengguna dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  const onEdit = async (uid) => {
    try {
      const response = await axios.get(`${ApiEndpoint.HO}/${uid}`);
      const userdata = response.data.data;

      setEmail(userdata?.email);
      setFirstName(userdata?.profile?.first_name);
      setLastName(userdata?.profile?.last_name);
      setGender({
        value: userdata?.profile?.gender === "L" ? "Laki-Laki" : "Perempuan",
        label: userdata?.profile?.gender === "L" ? "Laki-Laki" : "Perempuan",
      });
      setPhoneNumber(userdata?.profile?.phone_number);
      setBirth(userdata?.profile?.birth);

      setData({ ...data, uid: userdata.uid });
      setError("");
      setEditMode(true);
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  };

  const onUpdate = async () => {
    setIsLoadingButton(true)
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang diubah sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
    });
    setIsLoadingButton(true)
    if (confirmResult.isConfirmed) {
      if (
        gender === null ||
        (gender.value !== "Laki-Laki" && gender.value !== "Perempuan")
      ) {
        setError({ gender: "Pilih jenis kelamin yang valid." });
        return;
      }
      try {
        const genderValue = gender.value === "Laki-Laki" ? "L" : "P";
        await axios.post(`${ApiEndpoint.HO}/${data.uid}/update`, {
          email: email,
          first_name: first_name,
          last_name: last_name,
          gender: genderValue,
          phone_number: phone_number,
          birth: birth,
        });
        Swal.fire("Berhasil", "Pengguna berhasil diubah", "success");
        getHO(query);
        resetForm();
        setEditMode(false);
        setIsLoadingButton(false)
      } catch (err) {
        Swal.fire("Gagal", err.response.data.message, "error");
        setIsLoadingButton(false)
      }
    } else {
      setIsLoadingButton(false)
    }
  };

  const handleGenderChange = (selectedOption) => {
    setGender(selectedOption);
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
    getHO(query);
  }, [query]);

  const resetForm = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setGender(null);
    setPhoneNumber("");
    setBirth("");
    setEditMode(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-9 col-span-12">
          <Card title="Data Admin">
            <div className="md:flex justify-end items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 w-max"
                    value={query.is_active}
                    onChange={(event) =>
                      setQuery({ ...query, is_active: event.target.value })
                    }
                  >
                    <option value="">Semua Status Akun</option>
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 w-max"
                    value={query.gender}
                    onChange={(event) =>
                      setQuery({ ...query, gender: event.target.value })
                    }
                  >
                    <option value="">Semua Gender</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4 mb-2">
                  <Textinput
                    type="text"
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari pengguna..."
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
                              Email
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Lengkap
                            </th>
                            <th scope="col" className=" table-th ">
                              Jenis Kelamin
                            </th>
                            <th scope="col" className=" table-th ">
                              Status
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
                              Email
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Lengkap
                            </th>
                            <th scope="col" className=" table-th ">
                              Jenis Kelamin
                            </th>
                            <th scope="col" className=" table-th ">
                              Status
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
                            Admin belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Email
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama Lengkap
                          </th>
                          <th scope="col" className=" table-th ">
                            Jenis Kelamin
                          </th>
                          <th scope="col" className=" table-th ">
                            Status
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item?.email} </td>
                            <td className="table-td">
                              {item?.profile?.first_name}{" "}
                              {item?.profile?.last_name}
                            </td>
                            <td className="table-td">
                              {item?.profile?.gender === "L"
                                ? "Laki-Laki"
                                : "Perempuan"}
                            </td>
                            <td className="table-td">
                              {item?.is_active === true ? (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                                  Aktif
                                </span>
                              ) : (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                                  Nonaktif
                                </span>
                              )}
                            </td>

                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
                                {/* <Tooltip
                                  content="Edit"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() => onEdit(item.uid)}
                                  >
                                    <Icon icon="heroicons:pencil-square" />
                                  </button>
                                </Tooltip> */}
                                <Tooltip
                                  content="Detail Pengguna"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() =>
                                      navigate(
                                        `/users/detail/${item.uid}`
                                      )
                                    }
                                  >
                                    <Icon icon="heroicons:eye" />
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
        <div className="lg:col-span-3 col-span-12">
          <Card title={editMode ? "Ubah Admin" : "Tambah Admin"}>
            <div className="text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded p-5">
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Email *"
                  type="email"
                  placeholder="Masukkan email admin"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.email}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Nama Depan *"
                  type="text"
                  placeholder="Masukkan nama depan admin"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={first_name}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.first_name}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Nama Belakang *"
                  type="text"
                  placeholder="Masukkan nama belakang admin"
                  onChange={(e) => setLastName(e.target.value)}
                  value={last_name}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.last_name}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor=" hh" className="form-label ">
                  Jenis Kelamin *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih jenis kelamin..."
                  value={gender}
                  onChange={handleGenderChange}
                  isClearable
                  options={[
                    { value: "Laki-Laki", label: "Laki-Laki" },
                    { value: "Perempuan", label: "Perempuan" },
                  ]}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.gender}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="No Telepon"
                  type="number"
                  placeholder="Masukkan no telepon admin"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phone_number}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.phone_number}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Tanggal Lahir"
                  type="date"
                  placeholder="Masukkan no telepon admin"
                  onChange={(e) => setBirth(e.target.value)}
                  value={birth}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.birth}
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
                <Button
                  text="Reset"
                  className="btn-primary light w-full"
                  onClick={resetForm}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Users;
