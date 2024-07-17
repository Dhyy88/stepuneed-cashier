import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";

const ManualStock = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getManualStock() {
    try {
      const response = await axios.get(ApiEndpoint.MANUAL_STOCK);
      setData(response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getManualStock();
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-12 col-span-12">
          <Card title="Data Manual Stok SJM">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  {isLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Tanggal Dibuat
                            </th>
                            <th scope="col" className=" table-th ">
                              Catatan
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Keseluruhan Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Status Diterima
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
                  ) : data?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Tanggal Dibuat
                            </th>
                            <th scope="col" className=" table-th ">
                              Catatan
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Keseluruhan Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Status Diterima
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
                            Data belum tersedia
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className="bg-slate-200 dark:bg-slate-700">
                        <tr>
                          <th scope="col" className=" table-th ">
                            Tanggal Dibuat
                          </th>
                          <th scope="col" className=" table-th ">
                            Catatan
                          </th>
                          <th scope="col" className=" table-th ">
                            Jumlah Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Jumlah Keseluruhan Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Status Diterima
                          </th>
                          <th scope="col" className=" table-th ">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item.created_at}</td>
                            <td className="table-td">{item?.note} </td>
                            <td className="table-td">
                              {item?.manual_stock_products_count}
                            </td>
                            <td className="table-td">
                              {item?.manual_stock_products_sum_quantity}
                            </td>
                            <td className="table-td">
                              {item?.is_received ? (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-300">
                                  Diterima
                                </span>
                              ) : (
                                <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                                  Belum Diterima
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
                                      navigate(
                                        `/manualstock/detail/${item.uid}`
                                      )
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
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ManualStock;
