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

const UpdateCars = () => {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  const [model, setModel] = useState("");
  const [yearInputs, setYearInputs] = useState([""]);

  const [selected_brand, setSelectedBrand] = useState(null);
  const [brand, setBrand] = useState(null);

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.CARS}/${uid}`).then((response) => {
          const carBrand = response?.data?.data?.car_brand;
          setData(response?.data?.data);
          setModel(response?.data?.data?.model);
          setYearInputs(response?.data?.data?.year);
          if (carBrand) {
            setBrand({
              value: carBrand.uid,
              label: carBrand.brand,
            });
            setSelectedBrand({
              value: carBrand.uid,
              label: carBrand.brand,
            });
          }
        });
      }
    } catch (error) {
      setError(err.response.data.errors);
    }
  };

  const fetchBrand = async () => {
    try {
      const response = await axios.get(ApiEndpoint.BRANDS_CARS);
      const formattedBrand = response.data.data.map((item) => ({
        value: item.uid,
        label: item.brand,
      }));
      setBrand(formattedBrand);
    } catch (error) {
      console.error("Error fetching brand:", error);
    }
  };

  const handleBrandChange = (selected_brand) => {
    setSelectedBrand(selected_brand);
    setBrand(selected_brand ? selected_brand.value : null);
  };

  const onSubmit = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const requestData = {
          brand: selected_brand.value,
          model: model,
          year: yearInputs,
        };

        await axios.post(`${ApiEndpoint.CARS}/${uid}`, requestData);

        Swal.fire(
          "Sukses",
          "Model mobil berhasil diperbaharui",
          "success"
        ).then(() => {
          resetForm();
          navigate("/cars");
        });
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
      }
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  useEffect(() => {
    fetchBrand();
  }, []);

  const resetForm = () => {
    setModel(data ? data.model : "");
    setYearInputs(data ? data.year : "");
    setSelectedBrand(brand);
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Card title={"Ubah Model Mobil"}>
          <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
            <div className="">
              <Select
                className="react-select mt-2"
                classNamePrefix="select"
                placeholder="Pilih brand..."
                options={brand}
                onChange={handleBrandChange}
                value={selected_brand}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.brand}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                label="Model Mobil"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.model}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                label="Tahun Keluaran"
                type="text"
                value={yearInputs}
                onChange={(e) => setYearInputs(e.target.value)}
              />
              {error && (
                <span className="text-danger-600 text-sm py-2">
                  {error.year}
                </span>
              )}
            </div>
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
            {/* <Button
              text="Reset"
              className="btn-primary light w-full"
              onClick={resetForm}
            /> */}
            <Button
              text="Batal"
              className="btn-secondary light w-full "
              onClick={previousPage}
            />
            <Button
              text="Simpan"
              className="btn-primary dark w-full "
              onClick={onSubmit}
            />
          </div>
          {/* <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-5">
            <Button
              text="Batal"
              className="btn-secondary light w-full "
              onClick={previousPage}
            />
          </div> */}
        </Card>
      </div>
    </>
  );
};

export default UpdateCars;
