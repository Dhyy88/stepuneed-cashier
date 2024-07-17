import React, { useEffect, useState, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import Button from "@/components/ui/Button";

import image1 from "@/assets/images/all-img/widget-bg-1.png";

const DetailManualStock = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDataById = () => {
    setIsLoading(true);
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.MANUAL_STOCK}/${uid}`).then((response) => {
          setData(response?.data?.data);
          setIsLoading(false);
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/manualstock/receive/${data.uid}`)}
            className="invocie-btn inline-flex btn btn-md whitespace-nowrap space-x-2 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
          >
            <span className="text-lg">
              <Icon icon="heroicons:arrow-right-circle" />
            </span>
            <span>Terima Stok</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6 ">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info Supplier" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal Terbit
                    </div>
                    {data?.created_at ? (
                      <>{data?.created_at}</>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Status Diterima
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.is_received ? (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-300">
                          Diterima
                        </span>
                      ) : (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                          Belum Diterima
                        </span>
                      )}
                    </div>
                  </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:document-text" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Catatan
                    </div>
                    {data?.note ? <>{data?.note}</> : <span>- </span>}
                  </div>
                </li>
              </ul>
            </Card>

            {data?.is_received && (
              <Card title="Info Penerimaan Stok" className="mb-4">
                <ul className="list space-y-8">
                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:calendar" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        Tanggal Diterima
                      </div>
                      {data?.receive?.receive_at ? (
                        <>{data?.receive?.receive_at}</>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </li>
                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:paper-clip" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        No DO
                      </div>
                      {data?.receive?.delivery_order ? (
                        <>{data?.receive?.delivery_order}</>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </li>
                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:user" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        Penerima
                      </div>
                      {data?.receive?.receive_by?.profile?.first_name ? (
                        <>
                          {data?.receive?.receive_by?.profile?.first_name}{" "}
                          {data?.receive?.receive_by?.profile?.last_name}
                        </>
                      ) : (
                        <>{data?.receive?.receive_by?.email}</>
                      )}
                    </div>
                  </li>
                </ul>
              </Card>
            )}
          </div>

          <div className="lg:col-span-8 col-span-12">
            <Card title="Info Produk" className="mb-4">
              <div className="py-4 px-6">
                <div className="">
                  {isLoading ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              SKU
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Total
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex justify-center text-secondary p-10">
                        <Loading />
                      </div>
                    </>
                  ) : data?.manual_stock_products?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              SKU
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Total
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
                            SKU
                          </th>
                          <th scope="col" className=" table-th ">
                            Harga Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Jumlah Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.manual_stock_products?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">
                              {item?.variant?.sku ? item?.variant?.sku : "-"}
                            </td>

                            <td className="table-td">
                              {item?.price ? (
                                <span>
                                  Rp {item?.price.toLocaleString("id-ID")}
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td className="table-td">{item?.quantity}</td>
                            <td className="table-td">
                              {item?.total_price ? (
                                <span>
                                  Rp {item?.total_price.toLocaleString("id-ID")}
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailManualStock;
