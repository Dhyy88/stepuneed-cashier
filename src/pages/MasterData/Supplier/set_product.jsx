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
import { useParams } from "react-router-dom";
import { index } from "d3-array";

const SetProduct = () => {
  const navigate = useNavigate();
  let { uid } = useParams();

  const [dataProduct, setDataProduct] = useState([]);
  const [selectedVariantDetails, setSelectedVariantDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [variants, setVariants] = useState([""]);
  const [alias, setAlias] = useState([""]);
  const [price, setPrice] = useState([""]);

  const previousPage = () => {
    navigate(-1);
  };

  const handleAddProduct = () => {
    setVariants([...variants, ""]);
    setAlias([...alias, ""]);
    setPrice([...price, ""]);
    setSelectedVariantDetails([...selectedVariantDetails, null]);
  };

  const handleRemoveProduct = (index) => {
    const updatedVariants = [...variants];
    const updatedAlias = [...alias];
    const updatedPrices = [...price];
    const updatedSelectedVariantDetails = [...selectedVariantDetails];

    updatedVariants.splice(index, 1);
    updatedAlias.splice(index, 1);
    updatedPrices.splice(index, 1);
    updatedSelectedVariantDetails.splice(index, 1);

    setVariants(updatedVariants);
    setAlias(updatedAlias);
    setPrice(updatedPrices);
    setSelectedVariantDetails(updatedSelectedVariantDetails);
  };

  const handleVariantChange = (value, index) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = value.value;
    setVariants(updatedVariants);

    const updatedSelectedVariantDetails = [...selectedVariantDetails];
    updatedSelectedVariantDetails[index] = value;
    setSelectedVariantDetails(updatedSelectedVariantDetails);
    const selectedVariant = dataProduct.find(variant => variant.value === value.value);
    if (selectedVariant) {
      const updatedAlias = [...alias];
      updatedAlias[index] = selectedVariant.alias;
      setAlias(updatedAlias);
    }
  };

  const handleAliasChange = (value, index) => {
    const updatedAlias = [...alias];
    updatedAlias[index] = value;
    setAlias(updatedAlias)
  }

  const handlePriceChange = (value, index) => {
    const updatedPrices = [...price];
    updatedPrices[index] = value;
    setPrice(updatedPrices);
  };

  const fetchVariants = async () => {
    try {
      const response = await axios.get(ApiEndpoint.ALL_VARIANT);
      const formattedVariants = response?.data?.data
        ?.flatMap((dataProduct) => {
          if (!dataProduct.variants || dataProduct.variants.length === 0) {
            return dataProduct
              ? {
                  value: dataProduct.uid,
                  label: `${dataProduct.product.name} - ${dataProduct.sku}`,
                  alias: `${dataProduct.full_name}`,
                  extra: `Rp ${dataProduct.price.toLocaleString(
                    "id-ID"
                  )}`,
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
                label: `${dataProduct.product.name} - ${variant.sku}`,
                alias: `${dataProduct.full_name}`,
                extra: `Rp. ${variant.price.toLocaleString("id-ID")}`,
              }));
            } else {
              const primaryVariant = dataProduct.primary_variant;
              const primaryVariantData = primaryVariant
                ? [
                    {
                      value: primaryVariant.uid,
                      label: `${dataProduct.product.name} - ${primaryVariant.sku}`,
                     alias: `${dataProduct.full_name}`,
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
                  label: `${dataProduct.product.name} - ${variant.sku}`,
                 alias: `${dataProduct.full_name}`,
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
    fetchVariants();
  }, []);
  

  const renderVariantInputs = (index) => (
    <div key={index}>
      <div className="grid xl:grid-cols-3 md:grid-cols-4 grid-cols-1 gap-5 mb-4">
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
        <div className="">
          <Textinput
            label="Nama Alias Produk *"
            type="text"
            placeholder="Tentukan alias produk"
            value={alias[index]}
            onChange={(e) => handleAliasChange(e.target.value, index)}
          />
        </div>
        <div className="flex justify-between items-end space-x-5">
          <div className="flex-1">
            <Textinput
              label="Harga Supplier (Optional)"
              type="number"
              placeholder="Tentukan nilai harga supplier"
              value={price[index]}
              onChange={(e) => handlePriceChange(e.target.value, index)}
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
            <p>Nama Produk : {selectedVariantDetails[index].label}</p>
            <p>Harga Jual : {selectedVariantDetails[index].extra}</p>
          </div>
        </Alert>
      )}
    </div>
  );

  const onSubmit = async () => {
    setIsLoading(true);
    const confirmation = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin pengaturan produk anda sudah benar?",
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
          variants: variants.map((variant, index) => ({
            uid: variant,
            alias: alias[index],
            price: price[index],
          })),
        };

        await axios.post(`${ApiEndpoint.SUPPLIER}/${uid}/set-products`, formData);
        Swal.fire("Berhasil!", "Produk berhasil diatur.", "success");
        setIsLoading(false);
        // navigate("/bundles");
        previousPage()
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          Swal.fire("Error!", error.response.data.message, "error");
          setError(error.response.data.errors);
        } else {
          setError("Terjadi kesalahan saat membuat Bundle.");
        }
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Atur produk supplier"}>
        {error &&
          Object.values(error).map((errMsg, i) => (
            <Alert
              icon="heroicons-outline:exclamation"
              className="light-mode alert-danger mb-5"
            >
              <span key={i} className="text-danger-600 text-xs py-2">
                {errMsg}
              </span>
            </Alert>
          ))}
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

export default SetProduct;
