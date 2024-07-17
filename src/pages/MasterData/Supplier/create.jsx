import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Select from "react-select";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../components/LoadingButton";

const CreateSupplier = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [bank, setBank] = useState("");
  const [bank_account_name, setBankAccountName] = useState("");
  const [bank_account_number, setBankAccountNumber] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const onSubmit = async () => {
    setIsLoadingButton(true);
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });
    setIsLoadingButton(true);
    if (confirmResult.isConfirmed) {
      try {
        await axios.post(ApiEndpoint.CREATE_SUPPLIER, {
          code: code,
          name: name,
          address: address,
          province: province,
          city: city,
          email: email,
          phone_number: phone_number,
          bank: bank,
          bank_account_name: bank_account_name,
          bank_account_number: bank_account_number,
        });
        Swal.fire("Sukses", "Supplier berhasil ditambahkan", "success").then(
          () => {
            setIsLoadingButton(false);
            resetForm();
            setSelectedProvince(null);
            setSelectedCity(null);
            navigate("/suppliers");
          }
        );
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
        setIsLoadingButton(false);
      }
    } else {
      setIsLoadingButton(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.post(ApiEndpoint.GET_PROVINCE);
      const formattedProvinces = response.data.data.map((province) => ({
        value: province.uid,
        label: province.name,
      }));
      setProvinces(formattedProvinces);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleCityChange = (selectedCity) => {
    setSelectedCity(selectedCity);
    setCity(selectedCity ? selectedCity.value : null);
  };

  const fetchCities = async (provinceUid) => {
    try {
      const response = await axios.post(ApiEndpoint.GET_CITIES, {
        province: provinceUid,
      });
      const formattedCities = response.data.data.map((city) => ({
        value: city.uid,
        label: city.name,
      }));
      setCities(formattedCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleProvinceChange = (selectedProvince) => {
    setSelectedProvince(selectedProvince);
    setProvince(selectedProvince ? selectedProvince.value : null);

    if (selectedProvince && selectedProvince.value) {
      fetchCities(selectedProvince.value);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince && selectedProvince.uid) {
      fetchCities(selectedProvince.uid);
    }
  }, [selectedProvince]);

  const resetForm = () => {
    setCode("");
    setName("");
    setAddress("");
    setSelectedProvince(null);
    setSelectedCity(null);
    setCities("");
    setEmail("");
    setPhoneNumber("");
    setBank("");
    setBankAccountName("");
    setBankAccountNumber("");
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Card title={"Tambah Supplier SJM"}>
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div className="">
              <Textinput
                label="Kode Supplier"
                type="text"
                placeholder="Masukkan kode supplier"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="">
              <Textinput
                type="text"
                label="Nama Supplier"
                placeholder="Masukkan nama supplier yang valid"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={error ? "border-danger-500" : ""}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.name}
                </span>
              )}
            </div>
          </div>

          <div className="text-base text-slate-600 dark:text-slate-300 mb-5">
            <Textarea
              label="Alamat Supplier"
              id="pn4"
              rows="6"
              placeholder="Masukkan alamat supllier dengan lengkap"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex-1 mb-5">
            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
              <div className="">
                <label htmlFor=" hh" className="form-label ">
                  Provinsi
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih Provinsi..."
                  options={provinces}
                  onChange={handleProvinceChange}
                  // value={provinces.find((prov) => prov.value === province)}
                  value={selectedProvince}
                  isClearable
                />
                {error && (
                  <span className="text-danger-600 text-sm py-2">
                    {error.province}
                  </span>
                )}
              </div>
              <div className="">
                <label htmlFor=" hh" className="form-label ">
                  Kota / Kabupaten
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih Kota/Kabupaten..."
                  options={cities}
                  onChange={handleCityChange}
                  value={selectedCity}
                  isClearable
                />
                {error && (
                  <span className="text-danger-600 text-sm py-2">
                    {error.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
            <div className="">
              <Textinput
                label="Email Supplier"
                type="email"
                placeholder="Masukkan email supplier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.email}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                type="text"
                label="No Telepon Supplier"
                placeholder="Dapat memasukkan beberapa no telepon, contoh : 0852222 , 0812222 "
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={error ? "border-danger-500" : ""}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.phone_number}
                </span>
              )}
            </div>
          </div>

          <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-8">
            <div className="">
              <Textinput
                label="Jenis Bank"
                type="text"
                placeholder="BCA / BNI / BRI dsb"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.bank}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                type="text"
                label="Nama Bank Supplier"
                placeholder="Masukkan nama bank supplier yang valid (PT ...)"
                value={bank_account_name}
                onChange={(e) => setBankAccountName(e.target.value)}
                className={error ? "border-danger-500" : ""}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.bank_account_name}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                type="number"
                label="Nomor Rekening Supplier"
                placeholder="Masukkan nomor rekening supplier"
                value={bank_account_number}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className={error ? "border-danger-500" : ""}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.bank_account_number}
                </span>
              )}
            </div>
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
            <Button
              text="Reset"
              className="btn-primary light w-full"
              onClick={resetForm}
            />
            <Button
              text={isLoadingButton ? <LoadingButton /> : "Simpan"}
              className="btn-primary dark w-full "
              type="submit"
              onClick={onSubmit}
              disabled={isLoadingButton}
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

export default CreateSupplier;
