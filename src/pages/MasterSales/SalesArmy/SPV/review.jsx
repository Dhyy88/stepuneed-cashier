import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import ApiEndpoint from "../../../../API/Api_EndPoint";
import axios from "../../../../API/Axios";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import { useParams, useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Alert from "@/components/ui/Alert";

const ReviewSPVArmy = () => {
  let { uid } = useParams();
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [birth, setBirth] = useState("");
  const [nik, setNik] = useState("");
  const [payment_bank, setPaymentBank] = useState("");
  const [payment_account_number, setPaymentAccountNumber] = useState("");
  const [selfie_with_ktp, setSelvieWithKtp] = useState("");
  const [profile_picture, setProfilePicture] = useState("");

  const [checkFirstName, setCheckFirstName] = useState(false);
  const [checkLastName, setCheckLastName] = useState(false);
  const [checkGender, setCheckGender] = useState(false);
  const [checkPhoneNumber, setCheckPhoneNumber] = useState(false);
  const [checkBirth, setCheckBirth] = useState(false);
  const [checkNik, setCheckNik] = useState(false);
  const [checkPaymentBank, setCheckPaymentBank] = useState(false);
  const [checkPaymentAccountNumber, setCheckPaymentAccountNumber] = useState(false);
  const [checkSelvieWithKTP, setCheckSelvieWithKTP] = useState(false);
  const [checkProfilePicture, setCheckProfilePicture] = useState(false);

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.SPV_ARMIES}/${uid}`).then((response) => {
          setData(response.data.data);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onReject = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin pesan yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tolak akun",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.post(`${ApiEndpoint.SPV_ARMIES}/${uid}/reject`, {
          first_name: first_name,
          last_name: last_name,
          gender: gender,
          phone_number: phone_number,
          birth: birth,
          nik: nik,
          payment_bank: payment_bank,
          payment_account_number: payment_account_number,
          selfie_with_ktp: selfie_with_ktp,
          profile_picture: profile_picture
        });
        Swal.fire("Sukses", "Pesan tolak akun berhasil terkirim ke akun terkait", "success");
        // resetForm();
        navigate(`/spvarmy`)
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
      }
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setPhoneNumber("");
    setBirth("");
    setNik("");
    setPaymentBank("");
    setPaymentAccountNumber("");
    setSelvieWithKtp("");
    setProfilePicture("");
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Alert
          // dismissible
          icon="heroicons-outline:exclamation"
          className="light-mode alert-danger mb-5"
        >
          Ceklis form untuk menambahkan pesan tolak dari setiap data yang telah didaftarkan dalam form !
          contoh : No rekening salah atau foto selvie KTP buram 
        </Alert>

        <Card title={"Review Sales"}>
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Nama Depan</label>
                <Checkbox
                  value={checkFirstName}
                  onChange={() => setCheckFirstName(!checkFirstName)}
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder={data?.army_profile?.first_name}
                  disabled={!checkFirstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  value={first_name}
                />
              </div>
            </div>
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Nama Belakang</label>
                <Checkbox
                  value={checkLastName}
                  onChange={() => setCheckLastName(!checkLastName)}
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder={data?.army_profile?.last_name}
                  disabled={!checkLastName}
                  onChange={(e) => setLastName(e.target.value)}
                  value={last_name}
                />
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Jenis Kelamin</label>
                <Checkbox
                  value={checkGender}
                  onChange={() => setCheckGender(!checkGender)}
                  className="form-control"
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder={
                    data?.army_profile?.gender === "L"
                      ? "Laki-Laki"
                      : "Perempuan"
                  }
                  disabled={!checkGender}
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                />
              </div>
            </div>
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">No Telepon</label>
                <Checkbox
                  value={checkPhoneNumber}
                  onChange={() => setCheckPhoneNumber(!checkPhoneNumber)}
                  className="form-control py-2"
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder={data?.army_profile?.phone_number}
                  disabled={!checkPhoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phone_number}
                />
              </div>
            </div>
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Tanggal Lahir</label>
                <Checkbox
                  value={checkBirth}
                  onChange={() => setCheckBirth(!checkBirth)}
                  className="form-control"
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder={data?.army_profile?.birth}
                  disabled={!checkBirth}
                  onChange={(e) => setBirth(e.target.value)}
                  value={birth}
                />
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Nomor Induk Kependudukan</label>
                <Checkbox
                  value={checkNik}
                  onChange={() => setCheckNik(!checkNik)}
                  className="form-control"
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder={data?.army_profile?.nik}
                  disabled={!checkNik}
                  onChange={(e) => setNik(e.target.value)}
                  value={nik}
                />
              </div>
            </div>
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Nama Bank</label>
                <Checkbox
                  value={checkPaymentBank}
                  onChange={() => setCheckPaymentBank(!checkPaymentBank)}
                  // className="form-control py-2"
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder={data?.army_profile?.payment_bank}
                  disabled={!checkPaymentBank}
                  onChange={(e) => setPaymentBank(e.target.value)}
                  value={payment_bank}
                />
              </div>
            </div>
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Nomor Rekening</label>
                <Checkbox
                  value={checkPaymentAccountNumber}
                  onChange={() =>
                    setCheckPaymentAccountNumber(!checkPaymentAccountNumber)
                  }
                  className="form-control"
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder={data?.army_profile?.payment_account_number}
                  disabled={!checkPaymentAccountNumber}
                  onChange={(e) => setPaymentAccountNumber(e.target.value)}
                  value={payment_account_number}
                />
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-8">
            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Foto Profil</label>
                <Checkbox
                  value={checkProfilePicture}
                  onChange={() => setCheckProfilePicture(!checkProfilePicture)}
                  // className="form-control py-2"
                />
              </div>
              <div className="mb-4">
                <img
                  src={data?.army_profile?.profile_picture?.url}
                  alt=""
                  className="w-full h-60 object-contain rounded"
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder="Foto profil"
                  disabled={!checkProfilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  value={profile_picture}
                />
              </div>
            </div>

            <div className="fromGroup">
              <div className="flex row">
                <label className="form-label">Foto selfie KTP</label>
                <Checkbox
                  value={checkSelvieWithKTP}
                  onChange={() => setCheckSelvieWithKTP(!checkSelvieWithKTP)}
                  // className="form-control py-2"
                />
              </div>
              <div className="mb-4">
                <img
                  src={data?.army_profile?.selfie_ktp?.url}
                  alt=""
                  className="w-full h-60 object-contain rounded"
                />
              </div>
              <div className="">
                <input
                  className="form-control py-2"
                  type="text"
                  placeholder="Foto selfie KTP"
                  disabled={!checkSelvieWithKTP}
                  onChange={(e) => setSelvieWithKtp(e.target.value)}
                  value={selfie_with_ktp}
                />
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
            <Button
              text="Reset"
              className="btn-primary light w-full"
              onClick={resetForm}
            />
            <Button
              text="Kirim"
              className="btn-primary dark w-full "
              type="submit"
              onClick={onReject}
            />
          </div>
          <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-5">
            <Button
              text="Batal"
              className="btn-secondary light w-full "
              onClick={previousPage}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default ReviewSPVArmy;
