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
    value: "draft",
    label: "Draf",
  },
  {
    value: "pending",
    label: "Ditunda",
  },
  {
    value: "open",
    label: "Dibuka",
  },
  {
    value: "close",
    label: "Ditutup",
  },
  {
    value: "cancel",
    label: "Dibatalkan",
  },
  {
    value: "reject",
    label: "Ditolak",
  },
];

const ApprovePuchaseOrder = () => {
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

  const [site, setSite] = useState(null);
  const [data_supplier, setDataSupplier] = useState(null);

  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [status, setStatus] = useState(null);
  const isSpv = JSON.parse(localStorage.getItem("is_spv"));

  const [query, setQuery] = useState({
    search: "",
    supplier: "",
    site: "",
    request_by: "",
    approve_by: "",
    document_date: "",
    status: "",
    paginate: 5,
  });

  async function getPO(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.PO_APPROVE, {
        page: query?.page,
        search: query?.search,
        supplier: query?.supplier,
        site: query?.site,
        request_by: query?.request_by,
        approve_by: query?.approve_by,
        document_date: query?.document_date,
        status: query?.status,
        paginate: 5,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  const getSupplier = () => {
    axios.get(ApiEndpoint.SUPPLIER).then((response) => {
      setDataSupplier(response?.data?.data);
    });
  };

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
    getPO(query);
  }, [query]);

  useEffect(() => {
    getSite();
    getSupplier();
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-12 col-span-12">
          <Card title="Daftar Persetujuan PO">
            {isSpv === true ? (
              <div className="w-full flex flex-col justify-center text-secondary p-10">
                <div className="w-full flex justify-center mb-3">
                  <span className="text-slate-900 dark:text-white text-[100px] transition-all duration-300">
                    <Icon icon="heroicons:information-circle" />
                  </span>
                </div>
                <div className="w-full flex justify-center text-secondary">
                  <span className="text-slate-900 dark:text-white text-[20px] transition-all duration-300">
                    Anda tidak memiliki akses untuk menyetujui PO!
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="md:flex justify-end items-center mb-4">
                  <div className="md:flex items-center gap-3">
                    <div className="row-span-3 md-row-span-4 w-48">
                      <Select
                        className="react-select py-2 w-full"
                        classNamePrefix="select"
                        placeholder="Pilih Status..."
                        options={statusOptions}
                        onChange={(value) => {
                          setQuery({ ...query, status: value?.value });
                          setStatus(value);
                        }}
                        value={status}
                        isClearable
                      />
                    </div>
                    <div className="row-span-3 md:row-span-4 w-48">
                      <Select
                        className="react-select py-2 w-full"
                        classNamePrefix="select"
                        placeholder="Pilih cabang..."
                        options={[
                          { value: "", label: "Semua Cabang" },
                          ...(site?.map((item) => ({
                            value: item.uid,
                            label: item.name,
                          })) || []),
                        ]}
                        onChange={(value) => {
                          setQuery({ ...query, site: value?.value });
                          setSelectedSite(value);
                        }}
                        value={selectedSite}
                        showSearch
                        isClearable
                      />
                    </div>

                    <div className="row-span-3 md:row-span-4 w-48">
                      <Select
                        className="react-select py-2 w-full"
                        classNamePrefix="select"
                        placeholder="Pilih supplier..."
                        options={[
                          { value: "", label: "Semua Supplier" },
                          ...(data_supplier?.map((item) => ({
                            value: item.uid,
                            label: item.name,
                          })) || []),
                        ]}
                        onChange={(value) => {
                          setQuery({ ...query, supplier: value?.value });
                          setSelectedSupplier(value);
                        }}
                        value={selectedSupplier}
                        showSearch
                        isClearable
                      />
                    </div>

                    <div className="row-span-3 md:row-span-4">
                      <Textinput
                        onChange={(event) =>
                          setQuery({ ...query, search: event.target.value })
                        }
                        placeholder="Cari no berkas..."
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
                                  No Berkas
                                </th>
                                <th scope="col" className=" table-th ">
                                  Tanggal Penerbitan
                                </th>
                                <th scope="col" className=" table-th ">
                                  Tanggal Penerimaan
                                </th>
                                <th scope="col" className=" table-th ">
                                  Penerima
                                </th>
                                <th scope="col" className=" table-th ">
                                  Supplier
                                </th>
                                <th scope="col" className=" table-th ">
                                  Biaya
                                </th>
                                <th scope="col" className=" table-th ">
                                  Status PO
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
                                  No Berkas
                                </th>
                                <th scope="col" className=" table-th ">
                                  Tanggal Penerbitan
                                </th>
                                <th scope="col" className=" table-th ">
                                  Tanggal Penerimaan
                                </th>
                                <th scope="col" className=" table-th ">
                                  Penerima
                                </th>
                                <th scope="col" className=" table-th ">
                                  Supplier
                                </th>
                                <th scope="col" className=" table-th ">
                                  Biaya
                                </th>
                                <th scope="col" className=" table-th ">
                                  Status PO
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
                                Berkas PO belum tersedia
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                          <thead className="bg-slate-200 dark:bg-slate-700">
                            <tr>
                              <th scope="col" className=" table-th ">
                                No Berkas
                              </th>
                              <th scope="col" className=" table-th ">
                                Tanggal Penerbitan
                              </th>
                              <th scope="col" className=" table-th ">
                                Tanggal Penerimaan
                              </th>
                              <th scope="col" className=" table-th ">
                                Penerima
                              </th>
                              <th scope="col" className=" table-th ">
                                Supplier
                              </th>
                              <th scope="col" className=" table-th ">
                                Biaya
                              </th>
                              <th scope="col" className=" table-th ">
                                Status PO
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
                                <td className="table-td">
                                  {item?.document_date}
                                </td>
                                <td className="table-td">
                                  {item?.delivery_date}
                                </td>
                                <td className="table-td">
                                  {item?.delivery_to_site_name}
                                </td>
                                <td className="table-td">
                                  {item?.supplier?.name}
                                </td>
                                <td className="table-td">
                                  {" "}
                                  Rp {item?.cost.toLocaleString("id-ID")}
                                </td>

                                <td className="table-td">
                                  {item?.status === "draft" && (
                                    <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-blue-500 bg-blue-500">
                                      Draf
                                    </span>
                                  )}
                                  {item?.status === "pending" && (
                                    <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-warning-500 bg-warning-300">
                                      Tertunda
                                    </span>
                                  )}
                                  {item?.status === "open" && (
                                    <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                                      Terbuka
                                    </span>
                                  )}
                                  {item?.status === "close" && (
                                    <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-pink-500 bg-pink-500">
                                      Tertutup
                                    </span>
                                  )}
                                  {item?.status === "cancel" && (
                                    <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-amber-500 bg-amber-500">
                                      Dibatalkan
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
                                          navigate(`/po/detail/${item.uid}`)
                                        }
                                      >
                                        <Icon icon="heroicons:eye" />
                                      </button>
                                    </Tooltip>
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
                                          navigate(`/site/update/${item.uid}`)
                                        }
                                      >
                                        <Icon icon="heroicons:pencil-square" />
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
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default ApprovePuchaseOrder;
