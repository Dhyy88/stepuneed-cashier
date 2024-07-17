import React, { useEffect, useState, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../API/Api_EndPoint";
import axios from "../../API/Axios";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";

const DetailStockOpnameReport = () => {
  let { uid } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDataById = () => {
    setIsLoading(true);
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.STOCK_OPNAME}/${uid}`).then((response) => {
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

        <div className="grid grid-cols-12 gap-6 ">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info Stock Opname" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:building-office" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Cabang
                    </div>
                    {data?.site?.name ? (
                      <>{data?.site?.name}</>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar-days" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal Pelaporan
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.reported_at ? (
                        <>{data?.reported_at}</>
                      ) : (
                        <span>-</span>
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
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.note ? <>{data?.note}</> : <span>-</span>}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
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
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Keseluruhan Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Pelaporan Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Sisa Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex justify-center text-secondary p-10">
                        <Loading />
                      </div>
                    </>
                  ) : data?.products?.length === 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              SKU
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah Keseluruhan Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Pelaporan Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Sisa Stok
                            </th>
                            <th scope="col" className=" table-th ">
                              Harga
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
                            Nama Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Jumlah Keseluruhan Stok
                          </th>
                          <th scope="col" className=" table-th ">
                            Pelaporan Stok
                          </th>
                          <th scope="col" className=" table-th ">
                            Sisa Stok
                          </th>
                          <th scope="col" className=" table-th ">
                            Harga
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.stock_opname_details?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">
                              {item?.variant?.sku}
                            </td>
                            <td className="table-td">{item?.variant?.product?.name}</td>
                            <td className="table-td">{item?.real_qty}</td>
                            <td className="table-td">{item?.report_qty}</td>
                            <td className="table-td">{item?.missing_qty}</td>
                            <td className="table-td">
                              Rp {item?.variant?.price.toLocaleString("id-ID")}
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

export default DetailStockOpnameReport;
