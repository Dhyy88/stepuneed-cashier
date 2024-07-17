import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Select from "react-select";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import Loading from "../../../components/Loading";
import LoadingButton from "../../../components/LoadingButton";
import Switch from "@/components/ui/Switch";

const SPVWarehouses = () => {
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [birth, setBirth] = useState("");

  const [site, setSite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    search: "",
    gender: "",
    paginate: 8,
    site: "",
    is_active: "",
  });
  const [selectedSite, setSelectedSite] = useState(null);
  const [is_active, setIsActive] = useState("");

  async function getDataWarehouse(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.SPV_WH, {
        page: query?.page,
        search: query?.search,
        gender: query?.gender,
        paginate: 7,
        site: query?.site,
        is_active: query?.is_active,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  const getSite = async () => {
    try {
      const store_response = await axios.get(ApiEndpoint.STORE_LIST);
      const whstore_response = await axios.get(ApiEndpoint.STORE_WH_LIST);
      const site_response = [
        ...store_response?.data?.data,
        ...whstore_response?.data?.data,
      ];

      setSite(site_response);
    } catch (error) {
      Swal.fire("Gagal", error.response.data.message, "error");
    }
  };

  const handleGenderChange = (selectedOption) => {
    setGender(selectedOption);
  };

  const onSubmit = async () => {
    setIsLoadingButton(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin menambahkan data pengguna spv ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.post(ApiEndpoint.CREATE_SPV_WH, {
          site: selectedSite?.value,
          email: email,
          first_name: first_name,
          last_name: last_name,
          gender: gender.value,
          phone_number: phone_number,
          birth: birth,
        });
        Swal.fire("Sukses", "Data pengguna spv warehouse berhasil ditambahkan.", "success");
        getDataWarehouse(query);
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
        title: "Apakah Anda yakin ingin menghapus akun ini?",
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
          await axios.delete(`${ApiEndpoint.SPV_WH}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data akun ini.",
            "success"
          );
          getDataWarehouse(query);
        } else {
          Swal.fire("Batal", "Hapus data akun warehouse dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  };

  async function handleChangeStatus(uid) {
    try {
      const statusActive = is_active === "active" ? 0 : 1;
      const nonActive = is_active === "off" ? 1 : 0;
      const payload = {
        // uid: uid,
        active: statusActive,
        off: nonActive,
      };

      const confirmation = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin mengubah status akun ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Ubah",
        cancelButtonText: "Batal",
      });

      if (confirmation.isConfirmed) {
        const response = await axios.get(
          `${ApiEndpoint.SPV_WH}/${uid}/toggle-active`,
          payload
        );
        setIsActive(!is_active);
        getDataWarehouse(query);
      } else {

      }
    } catch (error) {
      console.error(error);
    }
  }

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
    getDataWarehouse(query);
  }, [query]);

  useEffect(() => {
    getSite();
  }, []);

  const resetForm = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setBirth("");
    setGender(null);
    setPhoneNumber("");
    setSelectedSite(null);
    setError(null);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8 col-span-12">
          <Card title="Data SPV Warehouse SJM">
            <div className="flex items-center mb-4 justify-between ">
              <div className="flex items-center gap-3">
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 "
                    value={query.site}
                    onChange={(event) =>
                      setQuery({ ...query, site: event.target.value })
                    }
                  >
                    <option value="">Semua Cabang</option>
                    {site?.map((site) => (
                      <option key={site.uid} value={site.uid}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row-span-3 md:row-span-4 mb-2">
                  <select
                    className="form-control py-2 "
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
                  <select
                    className="form-control py-2 "
                    value={query.is_active}
                    onChange={(event) =>
                      setQuery({ ...query, is_active: event.target.value })
                    }
                  >
                    <option value="">Status Akun</option>
                    <option value="1">Aktif</option>
                    <option value="0">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="md:flex items-center gap-3 ml-3">
                <div className="row-span-3 md:row-span-4 mb-2">
                  <Textinput
                    type="text"
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari spv gudang..."
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
                              Nama
                            </th>
                            <th scope="col" className=" table-th ">
                              No Telepon
                            </th>
                            <th scope="col" className=" table-th ">
                              Tanggal Lahir
                            </th>
                            <th scope="col" className=" table-th ">
                              Jenis Kelamin
                            </th>
                            <th scope="col" className=" table-th ">
                              Cabang SJM
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
                              Nama
                            </th>
                            <th scope="col" className=" table-th ">
                              No Telepon
                            </th>
                            <th scope="col" className=" table-th ">
                              Tanggal Lahir
                            </th>
                            <th scope="col" className=" table-th ">
                              Jenis Kelamin
                            </th>
                            <th scope="col" className=" table-th ">
                              Cabang SJM
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
                            Pengguna Gudang belum tersedia
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
                            Nama
                          </th>
                          <th scope="col" className=" table-th ">
                            Jenis Kelamin
                          </th>
                          <th scope="col" className=" table-th ">
                            No Telepon
                          </th>
                          <th scope="col" className=" table-th ">
                            Tanggal Lahir
                          </th>
                          <th scope="col" className=" table-th ">
                            Cabang SJM
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
                            {item?.email ? (
                              <td className="table-td">{item?.email}</td>
                            ) : (
                              <td className="table-td">-</td>
                            )}

                            {item?.profile?.first_name ? (
                              <td className="table-td">
                                {item?.profile?.first_name}{" "}
                                {item?.profile?.last_name}
                              </td>
                            ) : (
                              <td className="table-td">-</td>
                            )}

                            <td className="table-td">
                              {item?.profile?.gender === "L"
                                ? "Laki-Laki"
                                : "Perempuan"}
                            </td>

                            {item?.profile?.phone_number ? (
                              <td className="table-td">
                                {item?.profile?.phone_number}
                              </td>
                            ) : (
                              <td className="table-td">-</td>
                            )}

                            {item?.profile?.birth ? (
                              <td className="table-td">
                                {item?.profile?.birth}
                              </td>
                            ) : (
                              <td className="table-td">-</td>
                            )}

                            {item?.site?.name ? (
                              <td className="table-td">{item?.site?.name}</td>
                            ) : (
                              <td className="table-td">-</td>
                            )}
                              <td className="table-td">
                              <Switch
                                label={item?.is_active ? "Aktif" : "Nonaktif"}
                                activeClass="bg-success-500"
                                value={item?.is_active}
                                onChange={() => handleChangeStatus(item.uid)}
                                badge
                                prevIcon="heroicons-outline:check"
                                nextIcon="heroicons-outline:x"
                              />
                            </td>

                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
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
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title={"Tambah SPV Warehouse"}>
            <div className="text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded p-5">
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor=" hh" className="form-label ">
                  Cabang SJM *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih cabang..."
                  options={site?.map((branch) => ({
                    value: branch.uid,
                    label: branch.name,
                  }))}
                  onChange={(selectedOption) => setSelectedSite(selectedOption)}
                  value={selectedSite}
                  isClearable
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.site}
                  </span>
                )}
              </div>
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <Textinput
                  label="Email Pengguna *"
                  type="email"
                  placeholder="email_name@domain.com"
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
                  placeholder="Masukkan nama depan pengguna"
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
                  label="Nama Belakang (Optional)"
                  type="text"
                  placeholder="Masukkan nama belakang pengguna"
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
                <Textinput
                  label="No Telepon (Optional)"
                  type="number"
                  placeholder="Masukkan no telepon pengguna ( 085 xxx xxx xxx )"
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
                    { value: "L", label: "Laki-Laki" },
                    { value: "P", label: "Perempuan" },
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
                  label="Tanggal Lahir (Optional)"
                  type="date"
                  placeholder="Masukkan tanggal lahir pengguna ( 085 xxx xxx xxx )"
                  onChange={(e) => setBirth(e.target.value)}
                  value={birth}
                />
                {error && (
                  <span className="text-danger-600 text-xs py-2">
                    {error.birth}
                  </span>
                )}
              </div>

              <div className="grid justify-items-end">
                <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3 ">
                  <Button
                    text="Reset"
                    className="btn-primary light"
                    onClick={resetForm}
                  />
                  <Button
                    text={isLoadingButton ? <LoadingButton /> : "Simpan"}
                    className="btn-primary dark "
                    type="submit"
                    onClick={onSubmit}
                    disabled={isLoadingButton}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SPVWarehouses;
