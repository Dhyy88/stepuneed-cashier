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

const Product = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        carts: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getListCart() {
        setIsLoading(true);
        try {
            const response = await axios.get(ApiEndpoint.CART);
            setData(response?.data?.data);
            setIsLoading(false);
        } catch (err) {
            setError(err);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getListCart();
    }, []);

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
          }
        } catch (err) {
          Swal.fire("Gagal", err.response.data.message, "error");
        }
      }

    return (
        <>
            <div className="grid grid-cols-12 gap-6">
                <div className="lg:col-span-8 col-span-12">
                    <Card title="Daftar Pesanan">
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden ">
                                    {isLoading ? (
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
                                                            Diskon
                                                        </th>
                                                        <th scope="col" className=" table-th ">
                                                            Total Harga
                                                        </th>
                                                        <th scope="col" className=" table-th ">
                                                            Hapus
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
                                                            Diskon
                                                        </th>
                                                        <th scope="col" className=" table-th ">
                                                            Total Harga
                                                        </th>
                                                        <th scope="col" className=" table-th ">
                                                            Hapus
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
                                                        Diskon
                                                    </th>
                                                    <th scope="col" className=" table-th ">
                                                        Total Harga
                                                    </th>
                                                    <th scope="col" className=" table-th ">
                                                        Hapus
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                                {data?.carts.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="table-td">{item?.variant?.full_name}</td>
                                                        <td className="table-td">{item?.quantity}</td>
                                                        <td className="table-td">{item?.price.toLocaleString("id-ID")}</td>
                                                        <td className="table-td">{item?.discount}</td>
                                                        <td className="table-td">{item?.total_price.toLocaleString("id-ID")}</td>
                                                        <td className="table-td">
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
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-4 col-span-12">
                    <Card title="Buat Pesanan">
                        <div className="text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded p-5">
                            <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                                <Textinput
                                    label="Nama Customer *"
                                    type="text"
                                    placeholder="Masukkan nama customer"
                                />
                                {/* {error && (
                                    <span className="text-danger-600 text-xs py-2">
                                    </span>
                                )} */}
                            </div>
                            <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                                <Textinput
                                    label="Nomor Telepon *"
                                    type="text"
                                    placeholder="Masukkan nomor telepon customer"
                                />
                                {/* {error && (
                                    <span className="text-danger-600 text-xs py-2">
                                        {error.}
                                    </span>
                                )} */}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Product;
