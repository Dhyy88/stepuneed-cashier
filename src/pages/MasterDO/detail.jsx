import React, { useEffect, useState, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../API/Api_EndPoint";
import axios from "../../API/Axios";
import { useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import { Modal } from "antd";
import Select from "react-select";
import Loading from "../../components/Loading";
import Tooltip from "@/components/ui/Tooltip";

import image1 from "@/assets/images/all-img/widget-bg-1.png";

const DetailDO = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState({
    search: "",
    product: [uid],
    paginate: 1,
  });

  const getDataById = () => {
    setIsLoading(true);
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.DO_DETAIL}/${uid}`).then((response) => {
          setData(response?.data?.data);
          setIsLoading(false);
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  async function onDelete(uid) {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "Apakah Anda yakin ingin menghapus DO ini?",
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
          await axios.delete(`${ApiEndpoint.DO_DETAIL}/${uid}`);
          Swal.fire(
            "Berhasil!",
            "Anda berhasil menghapus data DO ini.",
            "success"
          );
          navigate(`/do`);
        } else {
          Swal.fire("Batal", "Hapus data DO dibatalkan.", "info");
        }
      }
    } catch (err) {
      Swal.fire("Gagal", err.response.data.message, "error");
    }
  }

  useEffect(() => {
    getDataById();
  }, [uid]);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div
          className="bg-no-repeat bg-cover bg-center p-4 rounded-[6px] relative"
          style={{
            backgroundImage: `url(${image1})`,
          }}
        >
          <div className="max-w-[169px]">
            <div className="text-xl font-medium text-slate-900 mb-2">
              {data?.name}
            </div>
            <p className="text-sm text-slate-800">{data?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 ">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info DO" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:paper-clip" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      No DO
                    </div>
                    {data?.document_number ? (
                      <>{data?.document_number}</>
                    ) : (
                      <span>-</span>
                    )}
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.date ? <>{data?.date}</> : <span>-</span>}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:arrow-down-on-square-stack" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    Proses Do
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.is_processed ? (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-300">
                          Diproses
                        </span>
                      ) : (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                          Menunggu
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:check-badge" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Status DO
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.status === "pending" && (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-blue-500 bg-blue-500">
                          Menunggu
                        </span>
                      )}
                      {data?.status === "approve" && (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-warning-500 bg-warning-300">
                          Diterima
                        </span>
                      )}
                      {data?.status === "reject" && (
                        <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                          Ditolak
                        </span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:user" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Nama Pelanggan
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.customer_profile?.first_name ? (
                        <>
                          {data?.customer_profile?.first_name}{" "}
                          {data?.customer_profile?.last_name || ""}
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:truck" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Mobil Pelanggan
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.customer_car?.model ? (
                        <>
                          {data?.customer_car?.car_brand?.brand}{" "}
                          {data?.customer_car?.model || ""}{" "}
                          {data?.customer_car?.type || ""}
                          {data?.customer_car?.year || ""}
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:building-office-2" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Cabang / Gudang
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.warehouse_site?.name ? (
                        <>{data?.warehouse_site?.name}</>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:user-circle" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text- slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Sales
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.sales?.profile?.first_name ? (
                        <>
                          {data?.sales?.profile?.first_name}{" "}
                          {data?.sales?.profile?.last_name || ""}
                        </>
                      ) : (
                        <span>{data?.sales?.email}</span>
                      )}
                    </div>
                  </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:shield-check" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text- slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Disetujui Oleh
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.approve_by?.profile?.first_name ? (
                        <>
                          {data?.approve_by?.profile?.first_name}{" "}
                          {data?.approve_by?.profile?.last_name || ""}
                        </>
                      ) : (
                        <span>{data?.approve_by?.email || "-"}</span>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>

            <Card bodyClass="p-0" noborder>
              <header
                className={`border-b px-4 pt-4 pb-3 flex items-center  border-danger-500`}
              >
                <h6 className={`card-title mb-0  text-danger-500`}>
                  Danger Zone
                </h6>
              </header>
              <div className="py-3 px-5">
                <div className="card-title2 mb-2">Hapus DO</div>
                <div className="flex row justfiy-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm">
                      Setelah anda menghapus DO, tidak ada akses untuk
                      mengembalikan data. Harap mempertimbangkannya kembali.
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="">
                      <Button
                        text="Hapus DO"
                        className="btn-danger dark w-full btn-sm "
                        onClick={() => onDelete(uid)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 col-span-12">
            <Card title="Info Produk DO" className="mb-4">
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
                              Harga Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Model Mobil
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="w-full flex justify-center text-secondary p-10">
                        <Loading />
                      </div>
                    </>
                  ) : data?.delivery_order_products?.length === 0 ? (
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
                              Harga Produk
                            </th>
                            <th scope="col" className=" table-th ">
                              Model Mobil
                            </th>
                            <th scope="col" className=" table-th ">
                              Jumlah
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
                            Harga Produk
                          </th>
                          <th scope="col" className=" table-th ">
                            Model Mobil
                          </th>
                          <th scope="col" className=" table-th ">
                            Jumlah
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                        {data?.delivery_order_products?.map((item, index) => (
                          <tr key={index}>
                            <td className="table-td">{item?.variant?.sku}</td>
                            <td className="table-td">
                              {item?.variant?.full_name}
                            </td>
                            <td className="table-td">
                              {item?.variant?.price ? (
                                <span>
                                  Rp{" "}
                                  {item?.variant?.price.toLocaleString("id-ID")}
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td className="table-td">
                              {item?.variant?.car_model?.full_name}
                            </td>
                            <td className="table-td">{item?.quantity}</td>
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

export default DetailDO;
