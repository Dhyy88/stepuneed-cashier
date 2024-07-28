import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import axios from "../../API/Axios";
import ApiEndpoint from "../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const statusOptions = [
  {
    value: "",
    label: "Semua Status",
  },
  {
    value: "pending",
    label: "Menunggu Persetujuan",
  },
  {
    value: "approve",
    label: "Disetujui",
  },
  {
    value: "reject",
    label: "Ditolak",
  },
];

const DO = () => {
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
  const [warehouse_site, setDataWH] = useState(null);

  const [selected_wh, setSelectedWh] = useState(null);
  const [status, setStatus] = useState(null);

  const [query, setQuery] = useState({
    search: "",
    warehouse_site: "",
    date: "",
    status: "",
    paginate: 5,
  });

  async function getDO(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.DO, {
        page: query?.page,
        search: query?.search,
        warehouse_site: query?.warehouse_site,
        date: query?.data,
        status: query?.status,
        paginate: 10,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  const getWarehouse = () => {
    axios.get(ApiEndpoint.GET_WAREHOUSE).then((response) => {
      setDataWH(response?.data?.data);
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
    getDO(query);
  }, [query]);

  useEffect(() => {
    getWarehouse();
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-12 col-span-12">
          <Card title="DO StepUneed">
            <Card className="mb-5">
              <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-4">
                <div className="">
                  <label htmlFor=" hh" className="form-label ">
                    Filter Gudang
                  </label>
                  <Select
                    className="react-select  w-full"
                    classNamePrefix="select"
                    placeholder="Pilih gudang..."
                    options={[
                      { value: "", label: "Semua Gudang" },
                      ...(warehouse_site?.map((item) => ({
                        value: item.uid,
                        label: item.name,
                      })) || []),
                    ]}
                    onChange={(value) => {
                      setQuery({ ...query, warehouse_site: value?.value });
                      setSelectedWh(value);
                    }}
                    value={selected_wh}
                    showSearch
                    isClearable
                  />
                </div>
                <div className="">
                  <label htmlFor=" hh" className="form-label ">
                    Tanggal DO
                  </label>
                  <Textinput
                    isClearable
                    type="date"
                    className="py-2"
                    // value={query || ""}
                    onChange={(event) =>
                      setQuery({ ...query, date: event.target.value })
                    }
                    placeholder="Cari tanggal..."
                  />
                </div>
                <div className="">
                  <label htmlFor=" hh" className="form-label ">
                    Status
                  </label>
                  <div className="row-span-3 md:row-span-4 mb-2">
                    <Select
                      className="react-select w-full"
                      classNamePrefix="select"
                      placeholder="Pilih status..."
                      options={statusOptions}
                      onChange={(value) => {
                        setQuery({ ...query, status: value?.value });
                        setStatus(value);
                      }}
                      value={status}
                      isClearable
                    />
                  </div>
                </div>
              </div>
              {/* </div> */}
            </Card>
            <div className="md:flex justify-between items-center mb-4">
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <Button
                    text="Tambah DO"
                    className="btn-primary dark w-full btn-sm mb-2 "
                    onClick={() => navigate(`/do/create`)}
                  />
                </div>
              </div>
              <div className="md:flex items-center gap-3">
                <div className="row-span-3 md:row-span-4">
                  <Textinput
                    onChange={(event) =>
                      setQuery({ ...query, search: event.target.value })
                    }
                    placeholder="Cari DO..."
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
                              No DO
                            </th>
                            <th scope="col" className=" table-th ">
                              Tanggal
                            </th>
                            <th scope="col" className=" table-th ">
                              Cabang
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Pelanggan
                            </th>
                            <th scope="col" className=" table-th ">
                              Mobil Pelanggan
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
                              No DO
                            </th>
                            <th scope="col" className=" table-th ">
                              Tanggal
                            </th>
                            <th scope="col" className=" table-th ">
                              Cabang
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Pelanggan
                            </th>
                            <th scope="col" className=" table-th ">
                              Mobil Pelanggan
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
                            DO belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            No DO
                          </th>
                          <th scope="col" className=" table-th ">
                            Tanggal
                          </th>
                          <th scope="col" className=" table-th ">
                            Cabang
                          </th>
                          <th scope="col" className=" table-th ">
                            Nama Pelanggan
                          </th>
                          <th scope="col" className=" table-th ">
                            Mobil Pelanggan
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
                            <td className="table-td">
                              {item?.document_number}
                            </td>
                            <td className="table-td">{item?.date}</td>
                            <td className="table-td">{item?.warehouse_site?.name}</td>
                            <td className="table-td">{item?.customer_profile?.first_name} {item?.customer_profile?.last_name || ""}</td>
                            <td className="table-td">{item?.customer_car?.car_brand?.brand} {item?.customer_car?.model || ""}</td>
                            <td className="table-td">
                              {item?.status === "pending" && (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-warning-500 bg-warning-500">
                                  Menunggu Persetujuan
                                </span>
                              )}
                              {item?.status === "approve" && (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-300">
                                  Disetujui
                                </span>
                              )}
                              {item?.status === "reject" && (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                                  Ditolak
                                </span>
                              )}
                            </td>
                            <td className="table-td">
                              <div className="flex space-x-3 rtl:space-x-reverse">
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
                                      navigate(`/do/detail/${item.uid}`)
                                    }
                                  >
                                    <Icon icon="heroicons:eye" />
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
      </div>
    </>
  );
};

export default DO;
