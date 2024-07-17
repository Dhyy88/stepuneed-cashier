import React, { useEffect, useState, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import { useParams } from "react-router-dom";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";
import Alert from "@/components/ui/Alert";
import Textinput from "@/components/ui/Textinput";
import Loading from "../../../components/Loading";
import { Modal } from "antd";
import Select from "react-select";

// import images
import ProfileImageMen from "@/assets/images/avatar/13.png";
import ProfileIdentity from "@/assets/images/avatar/selvie.jpg";

const DetailArmy = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [customer, setCustomer] = useState({
    customer: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isModalUpdateDealer, setIsModalUpdateDealer] = useState(false);
  const [isModalUpdateSite, setIsModalUpdateSite] = useState(false);
  const [isModalUpdateSPV, setIsModalUpdateSPV] = useState(false);

  const [dealer, setDealer] = useState([]);
  const [site, setSite] = useState([]);
  const [spv, setSPV] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedSPV, setSelectedSPV] = useState(null);
  const [selectedDealer, setSelectedDealer] = useState(null);

  const [query, setQuery] = useState({
    search: "",
    armies: [uid],
    paginate: 10,
  });
  const [query_dealer, setQueryDealer] = useState({
    brand: "",
  })
  const [query_spv, setQuerySPV] = useState({
    dealer: "",
  });
  const [error, setError] = useState(null);

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.SALES_EXTERNAL}/${uid}`).then((response) => {
          setData(response.data.data);
          const dealerUid = response?.data?.data?.army_profile?.dealer?.uid || "";
          const brandUid = response?.data?.data?.army_profile?.dealer?.car_brand?.uid || "";
          setQuerySPV(prevState => ({
            ...prevState,
            dealer: dealerUid,
          }));
          setQueryDealer(prevState => ({
            ...prevState,
            brand: brandUid,
          }));
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function getDataCustomer(query) {
    setIsLoading(true);
    try {
      const response = await axios.post(ApiEndpoint.CUSTOMER_SALES_EXTERNAL, {
        page: query?.page,
        paginate: 7,
        search: query?.search,
        armies: [uid],
      });
      setCustomer(response?.data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  async function getDealer(query_dealer) {
    try {
      const response = await axios.post(ApiEndpoint.DEALER, {
        brand: query_dealer?.brand,
      });
      setDealer(response?.data?.data);
    } catch (err) {
      setError(err);
    }
  }

  const getSite = () => {
    axios.get(ApiEndpoint.SITES).then((response) => {
      setSite(response?.data?.data);
    });
  };

  async function getSPV(query_spv) {
    try {
      const response = await axios.post(ApiEndpoint.SPV_ARMIES, {
        dealer: query_spv?.dealer,
      });
      setSPV(response?.data?.data);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    if (query_spv.dealer) {
      getSPV(query_spv);
    }
  }, [query_spv]);

  useEffect(() => {
    if (query_dealer.brand) {
      getDealer(query_dealer);
    }
  }, [query_dealer]);

  const handleOpenModalUpdateDealer = () => {
    setIsModalUpdateDealer(true);
    getDealer(query_dealer);
    if (data?.army_profile?.dealer?.uid) {
      setSelectedDealer({
        value: data?.army_profile?.dealer?.uid,
        label: `${data?.army_profile?.dealer?.name} - ${data?.army_profile?.dealer?.car_brand?.brand}`,
      });
    } else {
      setSelectedDealer(null);
    }
  };

  const handleOpenModalUpdateSite = () => {
    setIsModalUpdateSite(true);
    getSite();
    if (data?.site?.uid) {
      setSelectedSite({
        value: data?.site?.uid,
        label: data?.site?.name,
      });
    } else {
      setSelectedSite(null);
    }
  };

  const handleOpenModalUpdateSPV = () => {
    setIsModalUpdateSPV(true);
    getSPV(query_spv);
    if (data?.army_profile?.spv_army_profile?.uid) {
      setSelectedSPV({
        value: data?.army_profile?.spv_army_profile?.uid,
        label: `${data?.army_profile?.spv_army_profile?.first_name} ${data?.army_profile?.spv_army_profile?.last_name} `,
      });
    } else {
      setSelectedSPV(null);
    }
  };

  const handleCancelModalUpdateSPV = () => {
    setIsModalUpdateSPV(false);
    resetForm();
  };

  const handleCancelModalUpdateDealer = () => {
    setIsModalUpdateDealer(false);
    resetForm();
  };

  const handleCancelModalUpdateSite = () => {
    setIsModalUpdateSite(false);
    resetForm();
  };

  const onApproved = async () => {
    setIsApproveLoading(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin menyetujui akun ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.get(`${ApiEndpoint.SALES_EXTERNAL}/${uid}/approve`);
        getDataById();
        Swal.fire("Sukses", "Akun sales berhasil disetujui.", "success");
        setIsApproveLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Swal.fire("Gagal", error.response.data.message, "error");
          setIsApproveLoading(false);
        } else {
          Swal.fire(
            "Gagal",
            "Terjadi kesalahan saat menyetujui akun.",
            "error"
          );
          setIsApproveLoading(false);
        }
      }
    } else {
      setIsApproveLoading(false);
    }
  };

  const onUpdateDealer = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin memperbaharui dealer sales ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestData = {
          dealer: selectedDealer,
        };

        if (selectedDealer) {
          requestData.dealer = selectedDealer.value;
        }

        await axios.post(
          `${ApiEndpoint.SALES_EXTERNAL}/${uid}/change-dealer`,
          requestData
        );

        Swal.fire("Sukses", "Dealer berhasil diperbaharui", "success").then(
          () => {
            resetForm();
            setSelectedDealer(null);
            handleCancelModalUpdateDealer();
            getDataById();
          }
        );
      } catch (err) {
        if (err.response.status === 422) {
          Swal.fire("Gagal", "Maaf, dealer tidak sesuai dengan brand", "error");
        } else {
          setError(err.response.data.errors);
          Swal.fire("Gagal", err.response.data.message, "error");
        }
      }
    }
  };

  const onUpdateSite = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin memperbaharui cabang sales ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestSite = {
          site: selectedSite,
        };

        if (selectedSite) {
          requestSite.site = selectedSite.value;
        }

        await axios.post(
          `${ApiEndpoint.SALES_EXTERNAL}/${uid}/change-site`,
          requestSite
        );

        Swal.fire("Sukses", "Cabang berhasil diperbaharui", "success").then(
          () => {
            resetForm();
            setSelectedSite(null);
            handleCancelModalUpdateSite();
            getDataById();
          }
        );
      } catch (error) {
        setError(error.response.data.errors);
        Swal.fire("Gagal", error.response.data.message, "error");
      }
    }
  };

  const onSetSPV = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin memperbaharui SPV sales ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestSPV = {
          spv: selectedSPV,
        };

        if (selectedSPV) {
          requestSPV.spv = selectedSPV.value;
        }

        await axios.post(
          `${ApiEndpoint.SALES_EXTERNAL}/${uid}/set-spv`,
          requestSPV
        );
        Swal.fire("Sukses", "SPV berhasil diperbaharui", "success").then(() => {
          resetForm();
          setSelectedSPV(null);
          handleCancelModalUpdateSPV();
          getDataById();
        });
      } catch (err) {
        if (err.response.status === 422) {
          Swal.fire(
            "Gagal",
            "Maaf, SPV army di dealer sekarang tidak sesuai atau tidak tersedia",
            "error"
          );
        } else {
          setError(err.response.data.errors);
          Swal.fire("Gagal", err.response.data.message, "error");
        }
      }
    }
  };

  const toggleAccount = async (isActive) => {
    const actionText = isActive ? "mengaktifkan" : "menonaktifkan";
    const successMessage = isActive ? "diaktifkan" : "dinonaktifkan";

    setIsLoadingButton(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin ${actionText} akun ini?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Ya, ${actionText}`,
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        axios
          .get(`${ApiEndpoint.SALES_EXTERNAL}/${uid}/toggle-active`)
          .then(() => {
            getDataById();
            setIsLoadingButton(false);
          });
        Swal.fire(
          "Sukses",
          `Akun sales berhasil ${successMessage}.`,
          "success"
        );
        getDataById();
        setIsLoadingButton(false);
      } catch (error) {
        Swal.fire("Gagal", err.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  const onSuspendAccount = () => {
    setIsLoadingButton(true);
    toggleAccount(false);
  };

  const onActiveAccount = () => {
    setIsLoadingButton(true);
    toggleAccount(true);
  };

  const handlePrevPagination = () => {
    if (customer.prev_page_url) {
      setQuery({ ...query, page: customer.current_page - 1 });
    }
  };

  const handleNextPagination = () => {
    if (customer.next_page_url) {
      setQuery({ ...query, page: customer.current_page + 1 });
    }
  };

  const handleFirstPagination = () => {
    setQuery({ ...query, page: 1 });
  };

  const handleLastPagination = () => {
    setQuery({ ...query, page: customer?.last_page });
  };

  const generatePageNumbers = () => {
    const totalPages = customer?.last_page;
    const maxPageNumbers = 5;
    const currentPage = customer?.current_page;
    const middlePage = Math.floor(maxPageNumbers / 2);
    const startPage = Math.max(currentPage - middlePage, 1);
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const pageNumbers = [];
    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push({ page, active: page === currentPage });
    }

    return pageNumbers;
  };

  const resetForm = () => {
    setSelectedSPV(null);
    setSelectedDealer(null);
    setSelectedSite(null);
  };

  useEffect(() => {
    getDataCustomer(query);
  }, [query]);

  useEffect(() => {
    getDataById();
  }, [uid]);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  {data?.army_profile?.profile_picture?.url ? (
                    <img
                      src={data?.army_profile?.profile_picture?.url}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <img
                      src={ProfileImageMen}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {data?.army_profile?.first_name ? (
                    <>
                      {data?.army_profile?.first_name}{" "}
                      {data?.army_profile?.last_name}
                    </>
                  ) : (
                    <span>Nama belum diatur</span>
                  )}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {data?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Status Akun
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.is_active === true && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                    Aktif
                  </span>
                )}
                {data?.is_active === false && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                    Nonaktif
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Status Data
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.army_profile?.approve_status === "incomplete" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-blue-500 bg-blue-500">
                    Belum Registrasi
                  </span>
                )}
                {data?.army_profile?.approve_status === "approved" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                    Verifikasi
                  </span>
                )}
                {data?.army_profile?.approve_status === "review" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-warning-500 bg-warning-500">
                    Review
                  </span>
                )}
                {data?.army_profile?.approve_status === "rejected" && (
                  <Tooltip
                    content={data?.profile?.reject_note}
                    placement="top"
                    arrow
                    animation="shift-away"
                  >
                    <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                      Ditolak
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                Tanggal Registrasi
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                {data?.registered_at}
              </div>
            </div>
          </div>
        </div>
        {data?.army_profile?.reject_note && (
          <Alert className="light-mode alert-danger mb-5">
            Riwayat pesan tolak akun army :
            {data?.army_profile?.reject_note?.first_name && (
              <>
                <br /> - {data?.army_profile?.reject_note?.first_name}
              </>
            )}
            {data?.army_profile?.reject_note?.last_name && (
              <>
                <br /> - {data?.army_profile?.reject_note?.last_name}
              </>
            )}
            {data?.army_profile?.reject_note?.gender && (
              <>
                <br /> - {data?.army_profile?.reject_note?.gender}
              </>
            )}
            {data?.army_profile?.reject_note?.phone_number && (
              <>
                <br /> - {data?.army_profile?.reject_note?.phone_number}
              </>
            )}
            {data?.army_profile?.reject_note?.birth && (
              <>
                <br /> - {data?.army_profile?.reject_note?.birth}
              </>
            )}
            {data?.army_profile?.reject_note?.nik && (
              <>
                <br /> - {data?.army_profile?.reject_note?.nik}
              </>
            )}
            {data?.army_profile?.reject_note?.payment_bank && (
              <>
                <br /> - {data?.army_profile?.reject_note?.payment_bank}
              </>
            )}
            {data?.army_profile?.reject_note?.payment_account_number && (
              <>
                <br /> -{" "}
                {data?.army_profile?.reject_note?.payment_account_number}
              </>
            )}
            {data?.army_profile?.reject_note?.selfie_with_ktp && (
              <>
                <br /> - {data?.army_profile?.reject_note?.selfie_with_ktp}
              </>
            )}
            {data?.army_profile?.reject_note?.profile_picture && (
              <>
                <br /> - {data?.army_profile?.reject_note?.profile_picture}
              </>
            )}
          </Alert>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-6 col-span-12">
            <Card title="Info Pribadi" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:identification" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Nomor Induk Kependudukan
                    </div>
                    {data?.army_profile?.nik ? (
                      <>{data?.army_profile?.nik}</>
                    ) : (
                      <span>NIK belum diatur</span>
                    )}
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:credit-card" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      No Rekening
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.army_profile?.payment_account_number ? (
                        <>
                          {data?.army_profile?.payment_account_number}{" "}
                          {data?.army_profile?.payment_bank}
                        </>
                      ) : (
                        <span>Rekening belum diatur</span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:face-smile" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Jenis Kelamin
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.army_profile?.gender ? (
                        <>
                          {data?.army_profile?.gender === "L" && (
                            <span>Laki-laki</span>
                          )}
                          {data?.army_profile?.gender === "P" && (
                            <span>Perempuan</span>
                          )}
                        </>
                      ) : (
                        <span>Jenis kelamin belum diatur</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:calendar" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Tanggal Lahir
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.army_profile?.birth ? (
                        <>{data?.army_profile?.birth}</>
                      ) : (
                        <span>Tanggal lahir belum diatur</span>
                      )}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      No Telepon
                    </div>
                    {data?.army_profile?.phone_number ? (
                      <>{data?.army_profile?.phone_number}</>
                    ) : (
                      <span>No telepon belum diatur </span>
                    )}
                  </div>

                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:document" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Foto Selvi KTP
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {data?.army_profile?.selfie_ktp?.url ? (
                        <img
                          src={data?.army_profile?.selfie_ktp?.url}
                          alt=""
                          className="object-cover rounded h-40 w-40 mt-3"
                        />
                      ) : (
                        <img
                          src={ProfileIdentity}
                          alt=""
                          className="object-cover rounded h-40 w-40 mt-3"
                        />
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-6 col-span-12">
            <Card title="Info Akun" className="mb-4">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:swatch" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Kode Referral Sales
                    </div>
                    {data?.army_profile?.referral_code?.code ? (
                      <>{data?.army_profile?.referral_code?.code}</>
                    ) : (
                      <span>Belum ada kode referral</span>
                    )}
                  </div>
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:user" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      SPV Army
                    </div>
                    {data?.army_profile?.spv_army_profile?.first_name ||
                    data?.army_profile?.spv_army_profile?.last_name ? (
                      <>
                        {data?.army_profile?.spv_army_profile?.first_name || ""}{" "}
                        {data?.army_profile?.spv_army_profile?.last_name || ""}
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateSPV()}
                        />
                      </>
                    ) : data?.army_profile?.spv_army_profile?.user?.email ? (
                      <>
                        {data?.army_profile?.spv_army_profile?.user?.email}
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateSPV()}
                        />
                      </>
                    ) : (
                      <>
                        <span>SPV belum diatur</span>
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateSPV()}
                        />
                      </>
                    )}
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:truck" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Dealer - Brand
                    </div>
                    {data?.army_profile?.dealer?.name ? (
                      <>
                        {data?.army_profile?.dealer?.name} -{" "}
                        {data?.army_profile?.dealer?.car_brand?.brand}
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateDealer()}
                        />
                      </>
                    ) : (
                      <>
                        <span>Dealer belum diatur</span>
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateDealer()}
                        />
                      </>
                    )}
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:building-office-2" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Cabang
                    </div>
                    {data?.site?.name ? (
                      <>
                        {data?.site?.name}
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateSite()}
                        />
                      </>
                    ) : (
                      <>
                        <span>Cabang belum diatur</span>
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateSite()}
                        />
                      </>
                    )}
                  </div>
                </li>
              </ul>
            </Card>
            <Card className="mb-4">
              <div className="grid justify-items-center">
                {data?.is_completed === false && (
                  <>
                    <div className="row flex justify-items-center gap-5">
                      <div className="grid grid-cols-1 md:grid-cols-1 ">
                        {data?.is_active === false ? (
                          <Button
                            text={
                              isLoadingButton ? (
                                <LoadingButton />
                              ) : (
                                "Aktifkan Akun"
                              )
                            }
                            className="btn-primary shadow-base2"
                            onClick={() => onActiveAccount()}
                            disabled={isLoadingButton}
                          />
                        ) : (
                          <Button
                            text={
                              isLoadingButton ? (
                                <LoadingButton />
                              ) : (
                                "Nonaktifkan Akun"
                              )
                            }
                            className="btn-warning shadow-base2"
                            onClick={() => onSuspendAccount()}
                            disabled={isLoadingButton}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-2 grid-cols-1">
                        {data?.army_profile?.approve_status !== "rejected" &&
                          data?.army_profile?.approve_status !==
                            "incomplete" && (
                            <>
                              <Button
                                text={
                                  isApproveLoading ? (
                                    <LoadingButton />
                                  ) : (
                                    "Setujui Akun"
                                  )
                                }
                                className="btn-success shadow-base2 mr-5"
                                onClick={() => onApproved()}
                                disabled={isApproveLoading}
                              />
                              <Button
                                text="Tolak Akun"
                                className="btn-danger shadow-base2"
                                onClick={() =>
                                  navigate(`/army/review/${data.uid}`)
                                }
                              />
                            </>
                          )}
                      </div>
                    </div>
                  </>
                )}
                <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1">
                  {data?.is_completed === true && (
                    <>
                      {data?.is_active === false ? (
                        <Button
                          text={
                            isLoadingButton ? (
                              <LoadingButton />
                            ) : (
                              "Aktifkan Akun"
                            )
                          }
                          className="btn-primary shadow-base2"
                          onClick={() => onActiveAccount()}
                          disabled={isLoadingButton}
                        />
                      ) : (
                        <Button
                          text={
                            isLoadingButton ? (
                              <LoadingButton />
                            ) : (
                              "Nonaktifkan Akun"
                            )
                          }
                          className="btn-warning shadow-base2"
                          onClick={() => onSuspendAccount()}
                          disabled={isLoadingButton}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-12 col-span-12">
            <Card title="Data Pelanggan" className="mb-4">
              <div className="md:flex justify-end items-center mb-4">
                <div className="md:flex items-center gap-3">
                  <div className="row-span-3 md:row-span-4 mb-2">
                    <input
                      type="text"
                      className="form-control py-2"
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
                                Tanggal
                              </th>
                              <th scope="col" className=" table-th ">
                                Nama Pelanggan
                              </th>
                              <th scope="col" className=" table-th ">
                                No Telp
                              </th>
                              <th scope="col" className=" table-th ">
                                Alamat
                              </th>
                              <th scope="col" className=" table-th ">
                                Merek Mobil
                              </th>
                              <th scope="col" className=" table-th ">
                                Tipe
                              </th>
                              <th scope="col" className=" table-th ">
                                Warna
                              </th>
                              <th scope="col" className=" table-th ">
                                No Rangka
                              </th>
                              <th scope="col" className=" table-th ">
                                No Mesin
                              </th>
                            </tr>
                          </thead>
                        </table>

                        <div className="w-full flex justify-center text-secondary p-10">
                          <Loading />
                        </div>
                      </>
                    ) : customer?.data?.length === 0 ? (
                      <>
                        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                          <thead className="bg-slate-200 dark:bg-slate-700">
                            <tr>
                              <th scope="col" className=" table-th ">
                                Tanggal
                              </th>
                              <th scope="col" className=" table-th ">
                                Nama Pelanggan
                              </th>
                              <th scope="col" className=" table-th ">
                                No Telp
                              </th>
                              <th scope="col" className=" table-th ">
                                Alamat
                              </th>
                              <th scope="col" className=" table-th ">
                                Merek Mobil
                              </th>
                              <th scope="col" className=" table-th ">
                                Tipe
                              </th>
                              <th scope="col" className=" table-th ">
                                Warna
                              </th>
                              <th scope="col" className=" table-th ">
                                No Rangka
                              </th>
                              <th scope="col" className=" table-th ">
                                No Mesin
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
                              Pelanggan belum tersedia
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Tanggal
                            </th>
                            <th scope="col" className=" table-th ">
                              Nama Pelanggan
                            </th>
                            <th scope="col" className=" table-th ">
                              No Telp
                            </th>
                            <th scope="col" className=" table-th ">
                              Alamat
                            </th>
                            <th scope="col" className=" table-th ">
                              Merek Mobil
                            </th>
                            <th scope="col" className=" table-th ">
                              Tipe
                            </th>
                            <th scope="col" className=" table-th ">
                              Warna
                            </th>
                            <th scope="col" className=" table-th ">
                              No Rangka
                            </th>
                            <th scope="col" className=" table-th ">
                              No Mesin
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                          {customer?.data?.map((item, index) => (
                            <tr key={index}>
                              <td className="table-td">{item?.date}</td>
                              <td className="table-td">{item?.name}</td>
                              <td className="table-td">{item.phone_number}</td>
                              <td className="table-td">{item.address}</td>
                              <td className="table-td">{item.car_brand}</td>
                              <td className="table-td">{item.car_type}</td>
                              <td className="table-td">{item.car_color}</td>
                              <td className="table-td">{item.vin}</td>
                              <td className="table-td">{item.engine_number}</td>
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

            {/* START MODAL AREA */}

            <Modal
              open={isModalUpdateDealer}
              centered
              footer
              onCancel={handleCancelModalUpdateDealer}
            >
              <Card>
                <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-3 mb-4">
                  <div className="">
                    <label className="form-label ">
                      Ubah Dealer Sales Army *
                    </label>
                    <Select
                      className="react-select mt-2"
                      classNamePrefix="select"
                      placeholder="Pilih dealer..."
                      options={dealer?.map((dealer) => ({
                        value: dealer?.uid,
                        label: `${dealer?.name} - ${dealer?.car_brand?.brand}`,
                      }))}
                      onChange={(selectedOption) =>
                        setSelectedDealer(selectedOption)
                      }
                      value={selectedDealer}
                      isClearable
                    />
                  </div>
                </div>
              </Card>
              <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10">
                <Button
                  text={isLoadingButton ? <LoadingButton /> : "Ubah"}
                  className="btn-primary dark w-full "
                  type="submit"
                  onClick={onUpdateDealer}
                  disabled={isLoadingButton}
                />
              </div>
            </Modal>

            <Modal
              open={isModalUpdateSite}
              centered
              footer
              onCancel={handleCancelModalUpdateSite}
            >
              <Card>
                <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-3 mb-4">
                  <div className="">
                    <label className="form-label ">
                      Ubah Cabang Sales Army *
                    </label>
                    <Select
                      className="react-select mt-2"
                      classNamePrefix="select"
                      placeholder="Pilih cabang..."
                      options={site?.map((item) => ({
                        value: item?.uid,
                        label: item?.name,
                      }))}
                      onChange={(selectedOption) =>
                        setSelectedSite(selectedOption)
                      }
                      value={selectedSite}
                      isClearable
                    />
                  </div>
                </div>
              </Card>
              <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10">
                <Button
                  text={isLoadingButton ? <LoadingButton /> : "Ubah"}
                  className="btn-primary dark w-full "
                  type="submit"
                  onClick={onUpdateSite}
                  disabled={isLoadingButton}
                />
              </div>
            </Modal>

            <Modal
              open={isModalUpdateSPV}
              centered
              footer
              onCancel={handleCancelModalUpdateSPV}
            >
              <Card>
                <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-3 mb-4">
                  <div className="">
                    <label className="form-label ">Ubah SPV Sales Army *</label>
                    <Select
                      className="react-select mt-2"
                      classNamePrefix="select"
                      placeholder="Pilih SPV..."
                      options={spv?.map((item) => ({
                        value: item?.uid,
                        label: `${item?.spv_army_profile?.first_name ? item.spv_army_profile.first_name + ' ' : ''}${item?.spv_army_profile?.last_name || '' || item?.email}`,
                      }))}
                      onChange={(selectedOption) =>
                        setSelectedSPV(selectedOption)
                      }
                      value={selectedSPV}
                      isClearable
                    />
                  </div>
                </div>
              </Card>
              <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10">
                <Button
                  text={isLoadingButton ? <LoadingButton /> : "Ubah"}
                  className="btn-primary dark w-full "
                  type="submit"
                  onClick={onSetSPV}
                  disabled={isLoadingButton}
                />
              </div>
            </Modal>

            {/* END MODAL AREA */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailArmy;
