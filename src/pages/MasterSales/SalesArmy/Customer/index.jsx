import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import Select from "react-select";
import Modal from "@/components/ui/Modal";
import { useNavigate } from "react-router-dom";
import ApiEndpoint from "../../../../API/Api_EndPoint";
import axios from "../../../../API/Axios";
import Loading from "../../../../components/Loading";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";

const CustomerArmy = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    armies: [],
    search: "",
    paginate: 8,
  });
  const [data_armies, setDataArmies] = useState([]);
  const [selectedArmies, setSelectedArmy] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState(null);

  async function getDataCustomer(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.CUSTOMER_ARMIES, {
        page: query?.page,
        search: query?.search,
        paginate: 5,
        armies: query?.armies,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  const getDataById = async (uid) => {
    try {
      const response = await axios.get(`${ApiEndpoint.CUSTOMER_ARMIES}/${uid}`);
      setSelectedItemData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getArmy = () => {
    axios.get(ApiEndpoint.SALES_EXTERNAL).then((response) => {
      setDataArmies(response?.data?.data);
    });
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
    getDataCustomer(query);
  }, [query]);

  useEffect(() => {
    getArmy();
  }, []);

  const handleDetailButtonClick = (itemId) => {
    setSelectedItemId(itemId);
    getDataById(itemId);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-12 col-span-12">
          <Card title="Data Customer Army">
            <div className="flex items-center mb-4 justify-between ">
              <div className="flex items-center gap-3">
                <div className="row-span-3 md:row-span-4 mb-2">
                  <Select
                    className="react-select mr-5"
                    classNamePrefix="select"
                    placeholder="Pilih Sales Army..."
                    options={[
                      { value: "", label: "Semua Army" },
                      ...(data_armies.length > 0
                        ? data_armies
                            .filter((item) => item.is_completed)
                            .map((item) => ({
                              value: item.uid,
                              label: `${item.army_profile.first_name} ${item.army_profile.last_name}`,
                            }))
                        : []),
                    ]}
                    onChange={(value) => {
                      const selectedArmies = value ? [value.value] : [];
                      setQuery({ ...query, armies: selectedArmies });
                      setSelectedArmy(value);
                    }}
                    value={selectedArmies}
                    showSearch
                    isClearable
                  />
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
                    placeholder="Cari pelanggan..."
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
                              Nama Sales
                            </th>
                            <th scope="col" className=" table-th ">
                              Tanggal Terbit
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Pelanggan
                            </th>
                            <th scope="col" className=" table-th ">
                              No Telepon
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
                              Nama Sales
                            </th>
                            <th scope="col" className=" table-th ">
                              Tanggal Terbit
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Pelanggan
                            </th>
                            <th scope="col" className=" table-th ">
                              No Telepon
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
                            Customer army belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Nama Sales
                          </th>
                          <th scope="col" className=" table-th ">
                            Tanggal Terbit
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama Pelanggan
                          </th>
                          <th scope="col" className=" table-th ">
                            No Telepon
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">
                              {item?.army?.army_profile?.first_name}{" "}
                              {item?.army?.army_profile?.last_name}
                            </td>
                            <td className="table-td">{item.date}</td>

                            {item?.name ? (
                              <td className="table-td">{item?.name}</td>
                            ) : (
                              <td className="table-td">-</td>
                            )}

                            {item?.phone_number ? (
                              <td className="table-td">{item?.phone_number}</td>
                            ) : (
                              <td className="table-td">-</td>
                            )}

                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
                                <Modal
                                  title="Detail Pelanggan"
                                  label={
                                    <Tooltip
                                      content="Detail"
                                      placement="top"
                                      arrow
                                      animation="shift-away"
                                    >
                                      <button
                                        className="action-btn"
                                        type="button"
                                        onClick={() =>
                                          handleDetailButtonClick(item?.uid)
                                        }
                                      >
                                        <Icon icon="heroicons:eye" />
                                      </button>
                                    </Tooltip>
                                  }
                                  labelClass="action-btn p-0"
                                  themeClass="bg-warning-500"
                                  uncontrol
                                  visible={selectedItemId !== null}
                                  onClose={() => setSelectedItemId(null)}
                                >
                                  {selectedItemData && (
                                    <>
                                      <h4 className="font-medium text-lg mb-3 text-slate-900 text-center">
                                        - {selectedItemData.name} -
                                      </h4>
                                      <div className="text-base text-slate-600 dark:text-slate-300 grid grid-cols-4 gap-3 text-wrap row flex ">
                                        <div className="font-medium col-span-1">
                                          <label>Tanggal</label>
                                        </div>
                                        <div className=" col-span-3">
                                          <label>
                                            : {selectedItemData.date}
                                          </label>
                                        </div>

                                        <div className="font-medium col-span-1">
                                          <label>No Telepon</label>
                                        </div>
                                        <div className="col-span-3">
                                          <label>
                                            : {selectedItemData.phone_number}
                                          </label>
                                        </div>

                                        <div className="font-medium col-span-1">
                                          <label>Alamat</label>
                                        </div>
                                        <div className="col-span-3">
                                          <label>
                                            : {selectedItemData.address}
                                          </label>
                                        </div>

                                        <div className="font-medium col-span-1">
                                          <label>Brand Mobil</label>
                                        </div>
                                        <div className="col-span-3">
                                          <label>
                                            : {selectedItemData.car_brand}
                                          </label>
                                        </div>

                                        <div className="font-medium col-span-1">
                                          <label>Tipe Mobil</label>
                                        </div>
                                        <div className="col-span-3">
                                          <label>
                                            : {selectedItemData.car_type}
                                          </label>
                                        </div>

                                        <div className="font-medium col-span-1">
                                          <label>No Rangka</label>
                                        </div>
                                        <div className="col-span-3">
                                          <label>
                                            : {selectedItemData.vin}
                                          </label>
                                        </div>

                                        <div className="font-medium col-span-1">
                                          <label>No Mesin</label>
                                        </div>
                                        <div className="col-span-3">
                                          <label>
                                            : {selectedItemData.engine_number}
                                          </label>
                                        </div>

                                        <div className="font-medium col-span-1">
                                          <label>Nama Sales</label>
                                        </div>
                                        <div className="col-span-3">
                                          <label className="inline-block align-top">
                                            : {selectedItemData?.army?.army_profile?.first_name} {selectedItemData?.army?.army_profile?.last_name}
                                          </label>
                                            <Link
                                              to={`/army/detail/${selectedItemData?.army?.uid}`}
                                              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm capitalize font-medium text-blue-500 dark:text-slate-300 ml-5"
                                            >
                                              <Icon icon="heroicons:arrow-right" />
                                              <span>Lihat profil sales</span>
                                            </Link>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </Modal>
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
      </div>
    </>
  );
};

export default CustomerArmy;
