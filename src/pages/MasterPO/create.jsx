import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import axios from "../../API/Axios";
import ApiEndpoint from "../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Select from "react-select";
import Switch from "@/components/ui/Switch";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import LoadingButton from "../../components/LoadingButton";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();

  const [dataProduct, setDataProduct] = useState([]);
  const [data_supplier, setDataSupplier] = useState(null);
  const [data_user, setDataUser] = useState([]);

  const [variants, setVariants] = useState([""]);
  const [quantity, setQuantity] = useState([""]);
  const [selectedVariantDetails, setSelectedVariantDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [document_number, setDocumentNumber] = useState("");
  const [document_date, setDocumentDate] = useState("");
  const [delivery_date, setDeliveryDate] = useState("");
  const [site, setSite] = useState([]);
  const [cost, setCost] = useState("");
  const [note, setNote] = useState("");
  const [is_draft, setIsDraft] = useState(false);

  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selected_user, setSelectedUser] = useState(null);

  const previousPage = () => {
    navigate(-1);
  };

  const getSite = async () => {
    try {
      const store_response = await axios.get(ApiEndpoint.STORE_LIST);
      const whstore_response = await axios.get(ApiEndpoint.STORE_WH_LIST);
      const site_response = [
        ...store_response?.data?.data,
        ...whstore_response?.data?.data,
      ];

      setSite(site_response);
    } catch (error) {
      Swal.fire("Gagal", error.response.data.message, "error");
    }
  };

  const getSupplier = () => {
    axios.get(ApiEndpoint.SUPPLIER).then((response) => {
      setDataSupplier(response?.data?.data);
    });
  };

  const getUser = () => {
    const response = axios.post(ApiEndpoint.HO).then((response) => {
      setDataUser(response?.data?.data);
    })
  }

  const handleAddProduct = () => {
    setVariants([...variants, ""]);
    setQuantity([...quantity, ""]);
    setSelectedVariantDetails([...selectedVariantDetails, null]);
  };

  const handleRemoveProduct = (index) => {
    const updatedVariants = [...variants];
    const updateQuantity = [...quantity];
    const updatedSelectedVariantDetails = [...selectedVariantDetails];

    updatedVariants.splice(index, 1);
    updateQuantity.splice(index, 1);
    updatedSelectedVariantDetails.splice(index, 1);

    setVariants(updatedVariants);
    setQuantity(updateQuantity);
    setSelectedVariantDetails(updatedSelectedVariantDetails);
  };

  const handleVariantChange = (value, index) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = value.value;
    setVariants(updatedVariants);

    const updatedSelectedVariantDetails = [...selectedVariantDetails];
    updatedSelectedVariantDetails[index] = value;
    setSelectedVariantDetails(updatedSelectedVariantDetails);
  };

  const handleQuantityChange = (value, index) => {
    const updateQuantity = [...quantity];
    updateQuantity[index] = value;
    setQuantity(updateQuantity);
  };

  const fetchVariants = async (uid) => {
    try {
      const response = await axios.get(`${ApiEndpoint.SUPPLIER}/${uid}`);
      const formattedVariants = response?.data?.data?.variants
        ?.flatMap((variant) => {
          const detail = variant.detail;
          
          return {
            value: variant.uid,
            label: `${detail.product_name_alias}`,
            extra: `Rp ${detail.price.toLocaleString("id-ID")}`,
            alias: detail.product_name_alias,
          };
        })
        .filter((variant) => variant !== null);
  
      setDataProduct(formattedVariants);
    } catch (error) {
      console.error("Error fetching supplier details:", error);
    }
  };

  useEffect(() => {
    if (selectedSupplier) {
      fetchVariants(selectedSupplier.value);
    }
  }, [selectedSupplier]);

  useEffect(() => {
    getSite();
    getSupplier();
    getUser()
  }, []);

  const renderVariantInputs = (index) => (
    <div key={index}>
      <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-4">
        <div className="">
          <label htmlFor={`variant_${index}`} className="form-label ">
            Pilih Produk *
          </label>
          <Select
            id={`variant_${index}`}
            className="react-select mt-2"
            classNamePrefix="select"
            placeholder="Pilih Produk..."
            options={dataProduct}
            value={selectedVariantDetails[index]}
            onChange={(value) => handleVariantChange(value, index)}
          />
        </div>
        <div className="flex justify-between items-end space-x-5">
          <div className="flex-1">
            <Textinput
              label="Jumlah *"
              type="number"
              placeholder="Tentukan banyaknya jumlah produk"
              value={quantity[index]}
              onChange={(e) => handleQuantityChange(e.target.value, index)}
            />
          </div>
          <div className="flex-none relative">
            <button
              className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
              onClick={() => handleRemoveProduct(index)}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </div>
        </div>
      </div>
      {selectedVariantDetails[index] && (
        <Alert
          icon="heroicons-outline:arrow-right"
          className="light-mode alert-success mb-5"
        >
          <div>
            <p>Produk: {selectedVariantDetails[index].label}</p>
            <p>Harga Produk: {selectedVariantDetails[index].extra}</p>
          </div>
        </Alert>
      )}
    </div>
  );

  const onSubmit = async () => {
    setIsLoading(true);
    const confirmation = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menerbitkan PO?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      reverseButtons: true,
    });
    setIsLoading(true);

    if (confirmation.isConfirmed) {
      try {
        const formData = {
          document_number,
          document_date,
          delivery_date,
          site: selectedSite?.value,
          supplier: selectedSupplier?.value,
          cost,
          note,
          is_draft,
          approve_by: selected_user?.value,
          variants: variants.map((uid, index) => ({
            uid,
            quantity: quantity[index],
          })),
        };

        await axios.post(`${ApiEndpoint.PO}/create`, formData);
        Swal.fire("Berhasil!", "PO berhasil diterbitkan.", "success");
        setIsLoading(false);
        navigate("/pobyme");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          Swal.fire("Error!", error.response.data.message, "error");
          setError(error.response.data.errors);
        } else {
          setError("Terjadi kesalahan saat menerbitkan PO.");
        }
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Penerbitan PO"}>
        <Card className="mb-4">
          <div className="grid xl:grid-cols-4 md:grid-cols-4 grid-cols-1 gap-5 mb-5">
            <div className="">
              <Textinput
                label="Nomor PO*"
                type="number"
                placeholder="Masukkan nomor PO"
                value={document_number}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
               {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.document_number}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                label="Tanggal Penerbitan*"
                type="date"
                placeholder="Masukkan tanggal penerbitan PO"
                value={document_date}
                onChange={(e) => setDocumentDate(e.target.value)}
              />
               {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.document_date}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                label="Tanggal Penerimaan*"
                type="date"
                placeholder="Masukkan tanggal penerimaan PO"
                value={delivery_date}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
               {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.delivery_date}
                </span>
              )}
            </div>
            <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
              <label htmlFor=" hh" className="form-label ">
                Cabang Penerima PO *
              </label>
              <Select
                className="react-select mt-2"
                classNamePrefix="select"
                placeholder="Pilih cabang penerima *"
                options={site?.map((branch) => ({
                  value: branch.uid,
                  label: branch.name,
                }))}
                onChange={(selectedOption) => setSelectedSite(selectedOption)}
                value={selectedSite}
                isClearable
              />
              {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.site}
                </span>
              )}
            </div>
          </div>
          <div className="grid xl:grid-cols-4 md:grid-cols-4 grid-cols-1 gap-5 mb-5">
            <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
              <label htmlFor=" hh" className="form-label ">
                Supplier *
              </label>
              <Select
                className="react-select mt-2"
                classNamePrefix="select"
                placeholder="Pilih supplier *"
                
                options={data_supplier?.map((item) => ({
                  value: item.uid,
                  label: item.name,
                }))}
                onChange={(selectedOption) => setSelectedSupplier(selectedOption)}
                value={selectedSupplier}
                isClearable
              />
              {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.supplier}
                </span>
              )}
            </div>
            <div className="">
              <Textinput
                label="Biaya (optional)"
                type="number"
                placeholder="Masukkan Biaya"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
              <label htmlFor=" hh" className="form-label ">
                Persetujuan PO *
              </label>
              <Select
                className="react-select mt-2"
                classNamePrefix="select"
                placeholder="Pilih admin untuk persetujuaan PO *"
                options={data_user?.map((item) => ({
                  value: item.uid,
                  label: item?.profile?.first_name,
                }))}
                onChange={(selectedOption) => setSelectedUser(selectedOption)}
                value={selected_user}
                isClearable
              />
              {error && (
                <span className="text-danger-600 text-xs py-2">
                  {error.site}
                </span>
              )}
            </div>
            <div className="">
              <label className="form-label ">Status Draft PO</label>
              <Switch
                activeClass="bg-success-500"
                value={is_draft}
                onChange={() => setIsDraft(!is_draft)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
            </div>
          </div>
          <div className="text-base text-slate-600 dark:text-slate-300 mb-5">
            <Textarea
              label="Catatan PO (Optional)"
              id="pn4"
              rows="6"
              placeholder="Tambahkan catatan PO dengan maksimal 50 kata"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </Card>

        <Card className="mb-4">
          <div className="flex justify-end mb-2">
            <Button
              text="Tambah Produk"
              className="btn-primary light"
              onClick={handleAddProduct}
            />
          </div>
          {variants.map((item, index) => renderVariantInputs(index))}
        </Card>

        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
          <Button
            text="Batal"
            className="btn-secondary light w-full"
            onClick={previousPage}
          />
          <Button
            text={isLoading ? <LoadingButton /> : "Simpan"}
            className="btn-primary dark w-full "
            type="submit"
            onClick={onSubmit}
            disabled={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default CreatePurchaseOrder;
