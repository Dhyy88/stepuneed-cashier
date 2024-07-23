import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import axios from "../../../API/Axios";
import ApiEndpoint from "../../../API/Api_EndPoint";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Select from "react-select";
import Switch from "@/components/ui/Switch";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import LoadingButton from "../../../components/LoadingButton";

const CreateDoTemp = () => {
  const navigate = useNavigate();

  const [dataProduct, setDataProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [document_number, setDocumentNumber] = useState("");

  const [variants, setVariants] = useState([""]);
  const [quantity, setQuantity] = useState([""]);

  const [selectedVariantDetails, setSelectedVariantDetails] = useState([]);

  const previousPage = () => {
    navigate(-1);
  };

  const handleAddProduct = () => {
    setVariants([...variants, ""]);
    setQuantity([...quantity, ""]);
    setSelectedVariantDetails([...selectedVariantDetails, null]);
  };

  const handleRemoveProduct = (index) => {
    const updatedVariants = [...variants];
    const updatedQuantity = [...quantity];
    const updatedSelectedVariantDetails = [...selectedVariantDetails];

    updatedVariants.splice(index, 1);
    updatedQuantity.splice(index, 1);
    updatedSelectedVariantDetails.splice(index, 1);

    setVariants(updatedVariants);
    setQuantity(updatedQuantity);
    setSelectedVariantDetails(updatedSelectedVariantDetails);
  };

  const handleVariantChange = (value, index) => {
    const updatedSelectedVariantDetails = [...selectedVariantDetails];
    updatedSelectedVariantDetails[index] = value;
    setSelectedVariantDetails(updatedSelectedVariantDetails);
  };

  const handleQuantityChange = (value, index) => {
    const updatedQuantity = [...quantity];
    updatedQuantity[index] = value;
    setQuantity(updatedQuantity);
  }

  const fetchVariants = async () => {
    try {
      const response = await axios.post(ApiEndpoint.GET_PRODUCT_BY_SITE);
      const formattedVariants = response?.data?.data
        ?.flatMap((dataProduct) => {
          if (!dataProduct.variants || dataProduct.variants.length === 0) {
            return dataProduct
              ? {
                  value: dataProduct.uid,
                  label: `${dataProduct.full_name}`,
                  stock: `${dataProduct.stocks_count}`,
                  extra: `${dataProduct.price}`,
                }
              : null;
          } else {
            const primaryVariantUid = dataProduct.primary_variant?.uid;
            const primaryVariantExistsInVariants =
              primaryVariantUid &&
              dataProduct.variants.some(
                (variant) => variant.uid === primaryVariantUid
              );

            if (primaryVariantExistsInVariants) {
              return dataProduct.variants.map((variant) => ({
                value: variant.uid,
                label: `${dataProduct.product.name} `,
                stock: `${dataProduct.stocks_count}`,
                extra: `Rp. ${variant.price.toLocaleString("id-ID")}`,
              }));
            } else {
              const primaryVariant = dataProduct.primary_variant;
              const primaryVariantData = primaryVariant
                ? [
                    {
                      value: primaryVariant.uid,
                      label: `${dataProduct.product.name}`,
                      stock: `${dataProduct.stocks_count}`,
                      extra: `Rp ${primaryVariant.price.toLocaleString(
                        "id-ID"
                      )}`,
                    },
                  ]
                : [];

              return [
                ...primaryVariantData,
                ...dataProduct.variants.map((variant) => ({
                  value: variant.uid,
                  label: `${dataProduct.product.name}`,
                  stock: `${dataProduct.stocks_count}`,
                  extra: `Rp ${variant.price.toLocaleString("id-ID")}`,
                })),
              ];
            }
          }
        })
        .filter((variant) => variant !== null);

      setDataProduct(formattedVariants);
    } catch (error) {
      console.error("Error fetching product variants:", error);
    }
  };

  useEffect(() => {
    // if (selected_warehouse_site) {
      fetchVariants();
    // }
  }, []);

  const getFilteredOptions = (index) => {
    const selectedVariantIds = selectedVariantDetails
      .filter((_, i) => i !== index)
      .map((variant) => variant?.value);

    return (dataProduct || []).filter(
      (variant) => !selectedVariantIds.includes(variant.value)
    );
  };

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("document_number", document_number || "");

    const updatedVariants = variants.map((variant, index) => ({
      ...variant,
      quantity: quantity[index] || "",
      uid: selectedVariantDetails[index] || "",
    }));

    updatedVariants.forEach((variant, index) => {
      formData.append(
        `products[${index}][variant]`,
        variant?.uid?.value || ""
      );
      formData.append(`products[${index}][quantity]`, variant?.quantity || "")
    });

    Swal.fire({
      icon: "warning",
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      setIsLoading(true);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${ApiEndpoint.CREATE_DO_TEMP}`,
            formData
          );
          if (response.status === 200) {
            Swal.fire("Berhasil", "DO sementara berhasil diterbitkan", "success");
            setIsLoading(false);
            navigate("/doreturn");
          } else {
            setValidation("Terjadi kesalahan saat mengirim data");
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat mengirim data",
            });
            setIsLoading(false);
          }
        } catch (error) {
          setError(error.response.data.errors);
          Swal.fire("Gagal", "Terjadi kesalahan saat mengirim data", "error");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });
  };

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
            options={getFilteredOptions(index)}
            value={selectedVariantDetails[index]}
            onChange={(value) => handleVariantChange(value, index)}
            isClearable
          />
        </div>
        <div className="flex justify-between items-end space-x-5">
          <div className="flex-1">
            <Textinput
              label="Jumlah *"
              type="text"
              placeholder="Tentukan jumlah yang diinginkan"
              value={quantity[index]}
              onChange={(e) => handleQuantityChange(e.target.value, index)}
            />
          </div>
          <div className="flex-none relative">
            <button
              className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white mr-2"
              onClick={() => handleRemoveProduct(index)}
            >
              <Icon icon="heroicons:trash" />
            </button>
            <button
              className="inline-flex items-center justify-center h-10 w-10 bg-primary-500 text-lg border rounded border-primary-500 text-white"
              onClick={() => handleAddProduct(index)}
            >
              <Icon icon="heroicons:plus" />
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
            <p>Produk: {selectedVariantDetails[index].full_name}</p>
            <p>Harga Produk: {selectedVariantDetails[index].extra}</p>
            <p>No seri: {selectedVariantDetails[index].serial_number}</p>
          </div>
        </Alert>
      )}
    </div>
  );

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Tambah DO Sementara"}>
        <Card className="mb-3">
          <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
            <Textinput
              label="No DO sementara*"
              type="text"
              placeholder="Tentukan no DO sementara (DT-001)"
              value={document_number}
              onChange={(e) => setDocumentNumber(e.target.value)}
            />
          </div>
        </Card>

        <Card className="mb-4">
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

export default CreateDoTemp;
