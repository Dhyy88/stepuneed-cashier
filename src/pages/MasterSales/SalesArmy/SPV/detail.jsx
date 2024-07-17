import React, { useEffect, useState, Fragment } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../../API/Api_EndPoint";
import axios from "../../../../API/Axios";
import { useParams } from "react-router-dom";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../../components/LoadingButton";
import Alert from "@/components/ui/Alert";
import Textinput from "@/components/ui/Textinput";
import Loading from "../../../../components/Loading";
import { Modal } from "antd";
import Select from "react-select";

// import images
import ProfileImageMen from "@/assets/images/avatar/13.png";
import ProfileIdentity from "@/assets/images/avatar/selvie.jpg";

const DetailSPVArmy = () => {
  let { uid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isModalUpdateDealer, setIsModalUpdateDealer] = useState(false);
  const [isModalUpdateSite, setIsModalUpdateSite] = useState(false);
  const [isModalUpdateArmy, setIsModalUpdateArmy] = useState(false);

  const [dealer, setDealer] = useState([]);
  const [site, setSite] = useState([]);
  const [army, setArmy] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [army_select, setArmyInput] = useState([""]);
  const [query_army, setQueryArmy] = useState({
    dealer: "",
  });
  const [query_dealer, setQueryDealer] = useState({
    brand: "",
  })

  const getDataById = () => {
    setIsLoading(true);
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.SPV_ARMIES}/${uid}`).then((response) => {
          setData(response?.data?.data);
          setIsLoading(false);
          const dealerUid = response?.data?.data?.spv_army_profile?.dealer?.uid || "";
          const brandUid = response?.data?.data?.spv_army_profile?.dealer?.car_brand?.uid || "";
          setQueryArmy(prevState => ({
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
      setIsLoading(false);
    }
  };

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

  async function getArmy(query_army) {
    try {
      const response = await axios.post(ApiEndpoint.SALES_EXTERNAL, {
        dealer: query_army?.dealer,
      });
      setArmy(response?.data?.data);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    if (query_army.dealer) {
      getArmy(query_army);
    }
  }, [query_army]);

  useEffect(() => {
    if (query_dealer.brand) {
      getDealer(query_dealer);
    }
  }, [query_dealer]);
  
  const handleOpenModalUpdateArmy = () => {
    setIsModalUpdateArmy(true);
    getArmy(query_army);
    if (data?.army_profile?.uid) {
      setArmyInput({
        value: data?.army_profile?.uid,
        label: data?.army_profile?.first_name,
      });
    } else {
      setArmyInput(null);
    }
  };

  const handleOpenModalUpdateDealer = () => {
    setIsModalUpdateDealer(true);
    getDealer(query_dealer);
    if (data?.spv_army_profile?.dealer?.uid) {
      setSelectedDealer({
        value: data?.spv_army_profile?.dealer?.uid,
        label: data?.spv_army_profile?.dealer?.name,
      });
    } else {
      setSelectedDealer(null);
    }
  };

  const handleOpenUpdateSite = () => {
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

  const handleCancelModalUpdateSite = () => {
    setIsModalUpdateSite(false);
  };

  const handleCancelModalUpdateDealer = () => {
    setIsModalUpdateDealer(false);
  };

  const handleCancelModalUpdateArmy = () => {
    setIsModalUpdateArmy(false);
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
          `${ApiEndpoint.SPV_ARMIES}/${uid}/change-dealer`,
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
          Swal.fire("Gagal", "Maaf, dealer tidak sesuai atau masih terdapat army yang terkait oleh dealer ini", "error");
        } else {
          setError(err?.response?.data?.errors);
          Swal.fire("Gagal", err?.response?.data?.message, "error");
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
          `${ApiEndpoint.SPV_ARMIES}/${uid}/change-site`,
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

  const onUpdateArmy = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin memperbaharui army sales ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestArmy = {
          armies: army_select.map((armyInput) => armyInput.value),
        };

        if (selectedSite) {
          requestArmy.army = army_select.value;
        }
        const isOverwrite = await Swal.fire({
          title: "Konfirmasi",
          text: "Anda ingin mengubah data keseluruhan army?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya",
          cancelButtonText: "Tidak",
        });

        requestArmy.is_overwrite = isOverwrite.isConfirmed ? 1 : 0;

        await axios.post(
          `${ApiEndpoint.SPV_ARMIES}/${uid}/set-armies`,
          requestArmy
        );

        Swal.fire("Sukses", "Army berhasil diperbaharui", "success").then(
          () => {
            resetForm();
            setArmyInput(null);
            handleCancelModalUpdateArmy();
            getDataById();
          }
        );
      } catch (error) {
        if (error?.response?.status === 422) {
          Swal.fire("Gagal", "Maaf, dealer tidak sesuai atau masih terdapat army yang terkait oleh dealer ini", "error");
        } else {
          // setError(error?.response?.data?.errors);
          Swal.fire("Gagal", error?.response?.data?.message, "error");
        }
      }
    }
  };

  const onResetArmy = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin mereset army sales ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Reset",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestArmy = {
          is_overwrite: 1,
        };
    
        await axios.post(
          `${ApiEndpoint.SPV_ARMIES}/${uid}/set-armies`,
          requestArmy
        );
    
        Swal.fire("Sukses", "Army berhasil direset", "success").then(
          () => {
            resetForm();
            setArmyInput(null);
            handleCancelModalUpdateArmy();
            getDataById();
          }
        );
      } catch (error) {
        if (error?.response?.status === 422) {
          Swal.fire("Gagal", "Maaf, dealer tidak sesuai atau masih terdapat army yang terkait oleh dealer ini", "error");
        } else {
          Swal.fire("Gagal", error?.response?.data?.message, "error");
        }
      }
    }
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
        await axios.get(`${ApiEndpoint.SPV_ARMIES}/${uid}/approve`);
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
        axios.get(`${ApiEndpoint.SPV_ARMIES}/${uid}/toggle-active`).then(() => {
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

  const resetForm = () => {
    setSelectedDealer(null);
    // setSelectedSite(null);
  };

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
                  {data?.spv_army_profile?.profile_picture?.url ? (
                    <img
                      src={data?.spv_army_profile?.profile_picture?.url}
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
                  {data?.spv_army_profile?.first_name ? (
                    <>
                      {data?.spv_army_profile?.first_name}{" "}
                      {data?.spv_army_profile?.last_name}
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
                {data?.spv_army_profile?.approve_status === "incomplete" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-blue-500 bg-blue-500">
                    Belum Registrasi
                  </span>
                )}
                {data?.spv_army_profile?.approve_status === "approved" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
                    Verifikasi
                  </span>
                )}
                {data?.spv_army_profile?.approve_status === "review" && (
                  <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-warning-500 bg-warning-500">
                    Review
                  </span>
                )}
                {data?.spv_army_profile?.approve_status === "rejected" && (
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
        {data?.spv_army_profile?.reject_note && (
          <Alert className="light-mode alert-danger mb-5">
            Riwayat pesan tolak akun army :
            {data?.spv_army_profile?.reject_note?.first_name && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.first_name}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.last_name && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.last_name}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.gender && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.gender}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.phone_number && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.phone_number}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.birth && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.birth}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.nik && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.nik}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.payment_bank && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.payment_bank}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.payment_account_number && (
              <>
                <br /> -{" "}
                {data?.spv_army_profile?.reject_note?.payment_account_number}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.selfie_with_ktp && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.selfie_with_ktp}
              </>
            )}
            {data?.spv_army_profile?.reject_note?.profile_picture && (
              <>
                <br /> - {data?.spv_army_profile?.reject_note?.profile_picture}
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
                    {data?.spv_army_profile?.nik ? (
                      <>{data?.spv_army_profile?.nik}</>
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
                      {data?.spv_army_profile?.payment_account_number ? (
                        <>
                          {data?.spv_army_profile?.payment_account_number}{" "}
                          {data?.spv_army_profile?.payment_bank}
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
                      {data?.spv_army_profile?.gender ? (
                        <>
                          {data?.spv_army_profile?.gender === "L" && (
                            <span>Laki-laki</span>
                          )}
                          {data?.spv_army_profile?.gender === "P" && (
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
                      {data?.spv_army_profile?.birth ? (
                        <>{data?.spv_army_profile?.birth}</>
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
                    {data?.spv_army_profile?.phone_number ? (
                      <>{data?.spv_army_profile?.phone_number}</>
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
                      {data?.spv_army_profile?.selfie_ktp?.url ? (
                        <img
                          src={data?.spv_army_profile?.selfie_ktp?.url}
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
                      Brand
                    </div>
                    {data?.spv_army_profile?.dealer?.car_brand?.brand ? (
                      <>{data?.spv_army_profile?.dealer?.car_brand?.brand}</>
                    ) : (
                      <span>Brand belum di atur</span>
                    )}
                  </div>
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:user" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Total Army
                    </div>
                    {data?.spv_army_profile?.armies_count ? (
                      <>
                        {data?.spv_army_profile?.armies_count} Army{" "}
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateArmy()}
                        />
                      </>
                    ) : (
                      <>
                        <span>Belum ada Army yang di set</span>
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateArmy()}
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
                      Dealer
                    </div>
                    {data?.spv_army_profile?.dealer?.name ? (
                      <>
                        {data?.spv_army_profile?.dealer?.name}
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenModalUpdateDealer()}
                        />
                      </>
                    ) : (
                      <span>Dealer belum diatur</span>
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
                          onClick={() => handleOpenUpdateSite()}
                        />
                      </>
                    ) : (
                      <>
                        <span>Cabang belum diatur</span>
                        <Button
                          icon="heroicons-outline:pencil"
                          className="btn-sm"
                          onClick={() => handleOpenUpdateSite()}
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
                        {data?.spv_army_profile?.approve_status !==
                          "rejected" &&
                          data?.spv_army_profile?.approve_status !==
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
                                  navigate(`/spvarmy/review/${data.uid}`)
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
            <Card title="Data Army" className="mb-4">
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
                            </tr>
                          </thead>
                        </table>

                        <div className="w-full flex justify-center text-secondary p-10">
                          <Loading />
                        </div>
                      </>
                    ) : data?.spv_army_profile?.army_profiles?.length === 0 ? (
                      <>
                        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                          <thead className="bg-slate-200 dark:bg-slate-700">
                            <tr>
                              <th scope="col" className=" table-th ">
                                Email Army
                              </th>
                              <th scope="col" className="table-th">
                                Nama Army
                              </th>
                              <th scope="col" className="table-th">
                                No Telepon
                              </th>
                              <th scope="col" className="table-th">
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
                              Sales army belum tersedia
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-200 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className=" table-th ">
                              Email Army
                            </th>
                            <th scope="col" className="table-th">
                              Nama Army
                            </th>
                            <th scope="col" className="table-th">
                              No Telepon
                            </th>
                            <th scope="col" className="table-th">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                          {data?.spv_army_profile?.army_profiles?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td className="table-td">
                                  {item?.user?.email}
                                </td>
                                <td className="table-td">
                                  {item?.first_name} {item?.last_name}
                                </td>
                                <td className="table-td">
                                  {item?.phone_number}
                                </td>
                                <td className="table-td">
                                  <div className="flex space-x-3 rtl:space-x-reverse">
                                    <Tooltip
                                      content="Detail Bundle"
                                      placement="top"
                                      arrow
                                      animation="shift-away"
                                    >
                                      <button
                                        className="action-btn"
                                        type="button"
                                        onClick={() =>
                                          navigate(`/army/detail/${item?.user?.uid}`)
                                        }
                                      >
                                        <Icon icon="heroicons:eye" />
                                      </button>
                                    </Tooltip>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-12 col-span-12">
            <Modal
              open={isModalUpdateDealer}
              centered
              footer
              onCancel={handleCancelModalUpdateDealer}
            >
              <Card>
                <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-3 mb-4">
                  <div className="">
                    <label className="form-label ">Ubah Dealer Sales *</label>
                    <Select
                      className="react-select mt-2"
                      classNamePrefix="select"
                      placeholder="Pilih dealer..."
                      options={dealer?.map((dealer) => ({
                        value: dealer?.uid,
                        label: dealer?.name,
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
                      Ubah Cabang SPV Army *
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
              open={isModalUpdateArmy}
              centered
              footer
              onCancel={handleCancelModalUpdateArmy}
            >
              <Card>
                <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-3 mb-4">
                  <div className="">
                    <label className="form-label ">
                      Atur army untuk SPV ini *
                    </label>
                    <Select
                      className="react-select mt-2"
                      classNamePrefix="select"
                      placeholder="Pilih army..."
                      options={army?.map((item) => ({
                        value: item?.uid,
                        label: `${item?.army_profile?.first_name ? item.army_profile.first_name + ' ' : ''}${item?.army_profile?.last_name || '' || item?.email}`,
                      }))}
                      onChange={(selectedOption) =>
                        setArmyInput(selectedOption)
                      }
                      value={army_select}
                      isClearable
                      isMulti
                    />
                  </div>
                </div>
              </Card>
              <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-2 gap-5 mt-10">
                <Button
                  text={isLoadingButton ? <LoadingButton /> : "Bersihkan Army"}
                  className="btn-danger dark w-full "
                  type="submit"
                  onClick={onResetArmy}
                  disabled={isLoadingButton}
                />
                <Button
                  text={isLoadingButton ? <LoadingButton /> : "Perbaharui Army"}
                  className="btn-primary dark w-full "
                  type="submit"
                  onClick={onUpdateArmy}
                  disabled={isLoadingButton}
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSPVArmy;
