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
import Select2 from "react-select";
import Alert from "@/components/ui/Alert";

const Stock = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [list, setList] = useState({
    carts: [],
  });
  const [code, setCode] = useState({});
  const [byBarcode, setBarcode] = useState({ barcode: "" });
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    search: "",
    paginate: 8,
  });
  const [payment, setPaymentMethod] = useState(null);

  const [quantity, setQuantity] = useState();

  const paymentMethod = [
    { value: "cash", label: "Cash" },
    { value: "debit", label: "Debit" },
    { value: "transfer", label: "Transfer" },
    { value: "credit", label: "Credit" },
    { value: "qris", label: "Qris" },
  ];

  async function getDataStock(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.STOCK, {
        page: query?.page,
        search: query?.search,
        paginate: 8,
      });
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  async function getDataByBarcode(byBarcode) {
    setIsLoadingCode(true);
    try {
      const response = await axios.post(ApiEndpoint.STOCK_BY_BARCODE, {
        barcode: byBarcode?.barcode,
      });
      setCode(response?.data?.data);
      setIsLoadingCode(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setCode(null);
      } else {
        setError(err);
      }
    } finally {
      setIsLoadingCode(false);
    }
  }

  async function getListCart() {
    setListLoading(true);
    try {
      const response = await axios.get(ApiEndpoint.CART);
      const cartData = response?.data?.data;
      setList(cartData);
      setListLoading(false);
    } catch (err) {
      setError(err);
      setListLoading(false);
    }
  }

  const handleQuantityChange = async (e, index, uid) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setQuantity(value);
      setList((prevList) => {
        const updatedCarts = [...prevList.carts];
        updatedCarts[index].quantity = value;
        return { ...prevList, carts: updatedCarts };
      });
      try {
        await axios.post(`${ApiEndpoint.CART}/${uid}`, {
          quantity: value,
        });
        getListCart();
      } catch (err) {
        setError(err);
      }
    }
  };

  const preventNonNumericInput = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };

  useEffect(() => {
    getDataStock(query);
  }, [query]);

  useEffect(() => {
    if (byBarcode.barcode) {
      getDataByBarcode(byBarcode);
    }
  }, [byBarcode]);

  useEffect(() => {
    getListCart();
  }, []);

  const onAddToCart = async (uid) => {
    try {
      await axios.post(ApiEndpoint.CART, {
        variant: uid,
        quantity: 1,
      });
      getListCart();
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const onSubmit = async () => {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin data pembelian produk sudah benar?",
        text: "Anda tidak akan dapat mengembalikannya!",
        showCancelButton: true,
        confirmButtonText: "Ya, Benar",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.post(ApiEndpoint.ORDER, {
          is_new_customer: 1,
          payment_method: payment.value,
        });
        Swal.fire(
          "Berhasil!",
          "Pembalian produk telah Berhasil.",
          "success"
        );
        getListCart();
        getDataByBarcode();
        getDataStock();
        setPaymentMethod(null);
      } else {
        Swal.fire("Batal", "Pembalian produk dibatalkan.", "info");
      }
      // }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
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

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus produk ini?",
        text: "Anda tidak akan dapat mengembalikannya!",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.delete(`${ApiEndpoint.CART}/${uid}`);
        Swal.fire(
          "Berhasil!",
          "Anda berhasil menghapus data produk ini.",
          "success"
        );
        getListCart();
      } else {
        Swal.fire("Batal", "Hapus data produk dibatalkan.", "info");
      }
      // }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6">

        <div className="lg:col-span-7 col-span-12">
          <div className="mb-5">
            <Card title="Produk Berdasarkan Barcode">
              <div className="md:flex justify-center items-center mb-4">
                <div className="w-full">
                  <div className="row-span-3 md:row-span-4">
                    <Textinput
                      onChange={(event) =>
                        setBarcode({ ...byBarcode, barcode: event.target.value })
                      }
                      placeholder="Cari Produk Berdasarkan Barcode..."
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden ">
                    {isLoadingCode ? (
                      <>
                        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                          <thead className="bg-slate-200 dark:bg-slate-700">
                            <tr>
                              <th scope="col" className=" table-th ">Barcode</th>
                              <th scope="col" className=" table-th ">Nama Produk</th>
                              <th scope="col" className=" table-th ">Gender</th>
                              <th scope="col" className=" table-th ">Harga</th>
                              <th scope="col" className=" table-th ">Total Stok</th>
                              <th scope="col" className=" table-th "></th>
                            </tr>
                          </thead>
                        </table>
                        <div className="w-full flex justify-center text-secondary p-10">
                          <Loading />
                        </div>
                      </>
                    ) : code ? (
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">Barcode</th>
                            <th scope="col" className=" table-th ">Nama Produk</th>
                            <th scope="col" className=" table-th ">Gender</th>
                            <th scope="col" className=" table-th ">Harga</th>
                            <th scope="col" className=" table-th ">Total Stok</th>
                            <th scope="col" className=" table-th "></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                          <tr>
                            <td className="table-td">{code?.barcode || "-"}</td>
                            <td className="table-td">{code?.product?.name || "-"} {code?.variant_one} {code?.variant_two}</td>
                            <td className="table-td">{code?.product?.gender || "-"}</td>
                            <td className="table-td">{code?.sell_price || "-"}</td>
                            <td className="table-td">{code?.stocks_count || "-"}</td>
                            <td className="table-td justify-center">
                              <Tooltip
                                content="Tambah Pesanan"
                                placement="top"
                                arrow
                                animation="shift-away"
                                theme="success"
                              >
                                <button
                                  className="action-btn"
                                  type="button"
                                  onClick={() => onAddToCart(code?.uid)}
                                >
                                  <Icon icon="heroicons:shopping-bag" />
                                </button>
                              </Tooltip>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <div className="w-full flex flex-col text-secondary">
                        <Alert
                          icon="heroicons-outline:exclamation"
                          className="light-mode alert-success mb-5"
                        >
                          <p>
                            Tidak ditemukan produk. Silahkan cek kembali kebenaran dari barcode produk.
                          </p>
                        </Alert>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="">
            <Card title="Data Produk">
              <div className="md:flex justify-end items-center mb-4">
                <div className="md:flex items-center gap-3">
                  <div className="row-span-3 md:row-span-4">
                    <Textinput
                      // value={query || ""}
                      onChange={(event) =>
                        setQuery({ ...query, search: event.target.value })
                      }
                      placeholder="Cari Produk..."
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
                                Barcode
                              </th>
                              <th scope="col" className=" table-th ">
                                Nama Produk
                              </th>
                              <th scope="col" className=" table-th ">
                                Gender
                              </th>
                              <th scope="col" className=" table-th ">
                                Harga
                              </th>
                              <th scope="col" className=" table-th ">
                              </th>
                              <th scope="col" className=" table-th ">
                                Total Stok
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
                                Barcode
                              </th>
                              <th scope="col" className=" table-th ">
                                Nama Produk
                              </th>
                              <th scope="col" className=" table-th ">
                                Gender
                              </th>
                              <th scope="col" className=" table-th ">
                                Harga
                              </th>
                              <th scope="col" className=" table-th ">
                              </th>
                              <th scope="col" className=" table-th ">
                                Total Stok
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
                              Produk belum tersedia
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Barcode
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Gender
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Stok
                            </th>
                            <th scope="col" className=" table-th ">
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                          {data?.data?.map((item, index) => (
                            <tr key={index}>
                              <td className="table-td">{item?.barcode ? item?.barcode : "-"}</td>
                              <td className="table-td">
                                {item?.complete_full_name}{" "}
                              </td>
                              <td className="table-td">{item?.product?.gender}</td>
                              <td className="table-td">Rp {item?.sell_price.toLocaleString("id-ID")}</td>
                              <td className="table-td">{item?.stocks_count} </td>
                              <td className="table-td justify-center">
                                <Tooltip
                                  content="Tambah Pesanan"
                                  placement="top"
                                  arrow
                                  animation="shift-away"
                                  theme="success"
                                >
                                  <button
                                    className="action-btn"
                                    type="button"
                                    onClick={() => onAddToCart(item.uid)}
                                  >
                                    <Icon icon="heroicons:shopping-bag" />
                                  </button>
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
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
                            className={`${pageNumber.active ? "active" : ""
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
            </Card>
          </div>
        </div>
        <div className="lg:col-span-5 col-span-12">
          <Card title="Daftar Pesanan">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  {listLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga
                            </th>
                            <th scope="col" className=" table-th ">
                              Diskon (%)
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Harga
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
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga
                            </th>
                            <th scope="col" className=" table-th ">
                              Diskon (%)
                            </th>
                            <th scope="col" className=" table-th ">
                              Total Harga
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
                            Pesanan belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Nama Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Jumlah
                          </th>
                          <th scope="col" className=" table-th ">
                            Harga
                          </th>
                          <th scope="col" className=" table-th ">
                            Diskon (%)
                          </th>
                          <th scope="col" className=" table-th ">
                            Total Harga
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {list?.carts.map(
                          (item, index) => (
                            <tr key={index}>
                              <td className="table-td">{item?.variant?.full_name}</td>
                              <td className="table-td w-40">
                                <Textinput
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={item?.quantity}
                                  onChange={(e) => handleQuantityChange(e, index, item.uid)}
                                  onKeyDown={preventNonNumericInput}
                                  onInput={handleInput}
                                />
                              </td>
                              <td className="table-td">Rp {item?.price.toLocaleString("id-ID")}</td>
                              <td className="table-td">{item?.discount}</td>
                              <td className="table-td">Rp {item?.total_price.toLocaleString("id-ID")}</td>
                              <td className="table-td flex flex-row gap-2 justify-center">
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
                              </td>
                            </tr>
                          ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan="4"
                            className="table-td font-bold text-right"
                          >
                            Total Harga
                          </td>
                          <td className="table-td font-bold">
                            Rp{" "}
                            {list?.sub_total.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                  <div className="">
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
                          <div className="">
                            <label className="form-label">
                              Metode Pembayaran *
                            </label>
                            <Select2
                              className="react-select mt-2"
                              classNamePrefix="select"
                              placeholder="Pilih metode pembayaran..."
                              options={paymentMethod}
                              value={payment}
                              onChange={(selectedOption) => setPaymentMethod(selectedOption)}
                              isClearable
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-end text-slate-600 dark:text-slate-300 mt-5">
                    <Button
                      text="Kirim"
                      className="btn-primary dark w-full mr-2 mb-2"
                      onClick={() => onSubmit()}
                    />
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

export default Stock;