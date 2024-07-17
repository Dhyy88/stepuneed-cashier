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
import { useParams } from "react-router-dom";

const UpdateSupplier = () => {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

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

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.SUPPLIER}/${uid}`).then((response) => {
          setData(response?.data?.data);
          setCode(response?.data?.data?.code);
          setName(response?.data?.data?.name);
          setAddress(response?.data?.data?.address);
          setSelectedProvince({
            value: response?.data?.data?.province?.uid,
            label: response?.data?.data?.province?.name,
          });
          setSelectedCity({
            value: response?.data?.data?.city?.uid,
            label: response?.data?.data?.city?.name,
          });
          setEmail(response?.data?.data?.email);
          setPhoneNumber(response?.data?.data?.phone_number);
          setBank(response?.data?.data?.bank);
          setBankAccountName(response?.data?.data?.bank_account_name);
          setBankAccountNumber(response?.data?.data?.bank_account_number);
        });
      }
    } catch (error) {
      setError(err.response.data.errors);
      console.error("Error fetching data:", error);
    }
  };

  const onSubmit = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestData = {
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
        };

        if (selectedProvince) {
          requestData.province = selectedProvince.value;
        }

        if (selectedCity) {
          requestData.city = selectedCity.value;
        }

        await axios.post(`${ApiEndpoint.SUPPLIER}/${uid}`, requestData);

        Swal.fire("Sukses", "Supplier berhasil diperbaharui", "success").then(
          () => {
            resetForm();
            setSelectedProvince(null);
            setSelectedCity(null);
            navigate("/suppliers");
          }
        );
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
      }
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
    getDataById();
  }, [uid]);

  useEffect(() => {
    if (selectedProvince && selectedProvince.uid) {
      fetchCities(selectedProvince.uid);
    }
  }, [selectedProvince]);

  const resetForm = () => {
    setCode(data ? data.code : "");
    setName(data ? data.name : "");
    setAddress(data ? data.address : "");
    setSelectedProvince(
      data ? { value: data.province.uid, label: data.province.name } : null
    );
    setSelectedCity(
      data ? { value: data.city.uid, label: data.city.name } : null
    );
   setEmail(data ? data.email : "");
   setPhoneNumber(data ? data.phone_number : "");
   setBank (data ? data.bank : "");
   setBankAccountName (data ? data.bank_account_name : "");
   setBankAccountNumber (data ? data.bank_account_number : "");
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Card title={"Ubah Supplier SJM"}>
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
                placeholder="Dapat memasukkan beberapa no telepon contoh : 0852222 , 0812222 "
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

          <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
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
              text="Simpan"
              className="btn-primary dark w-full "
              onClick={onSubmit}
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

export default UpdateSupplier;
