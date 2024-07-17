import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/TextInput";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ReceiveManualStock = () => {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [delivery_order, setDeliveryOrder] = useState("");

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

  const onSubmit = async () => {
    const confirmResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin no DO yang dimasukkan sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Terima",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) { 
      try {
        const requestData = {
          delivery_order: delivery_order
        };
        await axios.post(
          `${ApiEndpoint.MANUAL_STOCK}/${uid}`,
          requestData
        );

        Swal.fire("Sukses", "Manual berhasil diterima", "success").then(
          () => {
            navigate("/manualstocks");
          }
        );
      } catch (err) {
        setError(err.response.data.errors);
        Swal.fire("Gagal", err.response.data.message, "error");
      }
    }
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <Card title={"Penerbitan Stock Opname"}>
          <div className="text-base text-slate-600 dark:text-slate-300 mb-5">
            <Textinput
              label="No DO *"
              placeholder=""
              value={delivery_order}
              onChange={(e) => setDeliveryOrder(e.target.value)}
            />
          </div>

          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
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
        </Card>
      </div>
    </>
  );
};

export default ReceiveManualStock;
