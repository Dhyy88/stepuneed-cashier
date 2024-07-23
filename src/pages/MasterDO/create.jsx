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

const CreateDO = () => {
  const navigate = useNavigate();

  const [dataProduct, setDataProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [warehouse_site, setWarehouseSite] = useState(null);
  const [document_number, setDocumentNumber] = useState("");

  const [is_new_customer, setIsNewCustomer] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [customer_first_name, setCustomerFirstName] = useState("");
  const [customer_last_name, setCustomerLastName] = useState("");

  const [is_new_customer_car, setIsNewCustomerCar] = useState(false); //Boolean
  const [customer_car, setCustomerCar] = useState([]);
  const [car_model, setIsCarModel] = useState(null);
  const [customer_car_type, setIsCustomerCarType] = useState("");
  const [customer_car_color, setIsCustomerCarColor] = useState("");

  const [sales, setSales] = useState(null);
  const [approve_by, setApproveBy] = useState(null);
  const [variants, setVariants] = useState([""]);
  const [quantity, setQuantity] = useState([""]);

  const [selectedVariantDetails, setSelectedVariantDetails] = useState([]);
  const [selected_warehouse_site, setSelectedWarehouseSite] = useState(null);
  const [selected_customer, setSelectedCustomer] = useState(null);
  const [selected_car_model, setSelectedCarModel] = useState(null);
  const [selected_sales, setSelectedSales] = useState(null);
  const [selected_approval, setSelectedApproval] = useState(null);
  const [selected_customer_car, setSelectedCustomerCar] = useState(null);

  const [check_is_new_customer, setCheckIsNewCustomer] = useState(false); // CHECK IF NEW CUSTOMER
  const [check_is_new_customer_car, setCheckIsNewCustomerCar] = useState(false); // CHECK IF NEW CUSTOMER CAR

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
    const updatedVariants = [...variants];
    updatedVariants[index] = value.value;
    setVariants(updatedVariants);

    const updatedSelectedVariantDetails = [...selectedVariantDetails];
    updatedSelectedVariantDetails[index] = value;
    setSelectedVariantDetails(updatedSelectedVariantDetails);
  };

  const handleQuantityChange = (value, index) => {
    const updatedQuantity = [...quantity];
    updatedQuantity[index] = value;
    setQuantity(updatedQuantity);
  };

  const getWarehouse = () => {
    axios.get(ApiEndpoint.GET_WAREHOUSE).then((response) => {
      setWarehouseSite(response?.data?.data);
    });
  };

  const getCustomer = () => {
    axios.post(ApiEndpoint.CUSTOMER).then((response) => {
      setCustomer(response?.data?.data);
    });
  };

  const getSales = () => {
    axios.get(ApiEndpoint.SALES_BY_SITE).then((response) => {
      setSales(response?.data?.data);
    });
  };

  const getApproval = () => {
    axios.get(ApiEndpoint.APPROVAL_HO).then((response) => {
      setApproveBy(response?.data?.data);
    });
  };

  const getCarModel = () => {
    axios.post(ApiEndpoint.CAR_MODEL).then((response) => {
      setIsCarModel(response?.data?.data);
    });
  };

  useEffect(() => {
    getWarehouse();
    getCustomer();
    getCarModel();
    getSales();
    getApproval();
  }, []);

  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
    if (selectedOption) {
      const selectedCustomer = customer.find(
        (c) => c.uid === selectedOption.value
      );
      if (selectedCustomer && selectedCustomer.customer_cars) {
        const customerCarsOptions = selectedCustomer.customer_cars.map(
          (car) => ({
            value: car.uid,
            label: `${car?.car_brand?.brand} ${car?.model} ${car?.year}, ${
              car?.type || ""
            }, ${car?.color || ""}`,
          })
        );
        setCustomerCar(customerCarsOptions);
      } else {
        setCustomerCar([]);
      }
    } else {
      setCustomerCar([]);
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await axios.post(ApiEndpoint.GET_PRODUCT_LIST);
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
    fetchVariants();
  }, []);

  const getFilteredOptions = (index) => {
    const selectedVariantIds = variants.filter((variant, i) => i !== index);
    return dataProduct.filter(
      (variant) => !selectedVariantIds.includes(variant.value)
    );
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
          />
        </div>
        <div className="flex justify-between items-end space-x-5">
          <div className="flex-1">
            <Textinput
              label="Jumlah Produk *"
              type="number"
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
            <p>Produk: {selectedVariantDetails[index].label}</p>
            <p>Harga Produk: {selectedVariantDetails[index].extra}</p>
            <p>Keseluruhan Jumlah Stok: {selectedVariantDetails[index].stock}</p>
          </div>
        </Alert>
      )}
    </div>
  );

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const new_customer = check_is_new_customer ? 1 : 0;
    const car_customer = check_is_new_customer ? 1 : (check_is_new_customer_car ? 1 : 0);

    const formData = new FormData();
    formData.append("warehouse_site", selected_warehouse_site?.value || "");
    formData.append("document_number", document_number || "");
   
    formData.append("is_new_customer", new_customer);

    const updatedVariants = variants.map((variant, index) => ({
      ...variant,
      quantity: quantity[index] || "",
      uid: selectedVariantDetails[index] || ""
    }));

    if (check_is_new_customer) {
      formData.append("is_new_customer_car", car_customer.toString());
      formData.append("customer_first_name", customer_first_name || "");
      formData.append("customer_last_name", customer_last_name || "");
      formData.append("car_model", selected_car_model?.value || "");
      formData.append("customer_car_type", customer_car_type || "");
      formData.append("customer_car_color", customer_car_color || ""); 
    } else {
      formData.append("customer", selected_customer?.value || "");
      if (check_is_new_customer_car) {
        formData.append("is_new_customer_car", car_customer.toString());
        formData.append("car_model", selected_car_model?.value || "");
        formData.append("customer_car_type", customer_car_type || "");
        formData.append("customer_car_color", customer_car_color || "")
      } else {
        formData.append("is_new_customer_car", car_customer.toString());
        formData.append("customer_car", selected_customer_car?.value || "");
      }
    }

    formData.append("sales", selected_sales?.value || "");
    formData.append("approve_by", selected_approval?.value || "");

    updatedVariants.forEach((variant, index) => {
      formData.append(`products[${index}][variant]`, variant?.uid?.value || "");
      formData.append(`products[${index}][quantity]`, variant?.quantity || "");
    })

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
            `${ApiEndpoint.CREATE_DO}`,
            formData
          );
          if (response.status === 200) {
            Swal.fire("Berhasil", "DO berhasil diterbitkan", "success");
            setIsLoading(false);
            navigate("/do");
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

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Tambah DO"}>
        <Card className="mb-3">
          <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
            <label htmlFor=" hh" className="form-label ">
              Pilih Cabang *
            </label>
            <Select
              className="react-select mt-2"
              classNamePrefix="select"
              placeholder="Pilih cabang..."
              options={warehouse_site?.map((item) => ({
                value: item.uid,
                label: item.name,
              }))}
              onChange={(selectedOption) =>
                setSelectedWarehouseSite(selectedOption)
              }
              value={selected_warehouse_site}
              isClearable
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">{error.site}</span>
            )}
          </div>
          <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
            <Textinput
              label="No DO *"
              type="text"
              placeholder="Tentukan no DO (DO-001)"
              value={document_number}
              onChange={(e) => setDocumentNumber(e.target.value)}
            />
          </div>
        </Card>
        <Card title="" className="mb-3">
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 ">
            <div className="flex row gap-20">
              <Switch
                label="Pelanggan Baru ?"
                activeClass="bg-success-500"
                value={check_is_new_customer}
                onChange={() => setCheckIsNewCustomer(!check_is_new_customer)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
            </div>
          </div>
        </Card>

        {check_is_new_customer ? (
          <>
            <Card className="mb-3">
              <Alert
                // dismissible
                icon="heroicons-outline:exclamation"
                className="light-mode alert-success mb-5"
              >
                <p>
                  Silahkan centang pelanggan baru jika data pelanggan belum ada
                </p>
              </Alert>
              <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
                <div className="">
                  <Textinput
                    type="text"
                    label="Nama Depan *"
                    placeholder="Masukkan nama depan pelanggan baru"
                    value={customer_first_name}
                    onChange={(e) => setCustomerFirstName(e.target.value)}
                  />
                </div>
                <div className="">
                  <Textinput
                    type="text"
                    label="Nama Belakang"
                    placeholder="Masukkan nama belakang pelanggan baru"
                    value={customer_last_name}
                    onChange={(e) => setCustomerLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                <div className="">
                  <label htmlFor=" hh" className="form-label ">
                    Model Mobil *
                  </label>
                  <Select
                    className="react-select mt-2"
                    classNamePrefix="select"
                    placeholder="Pilih mobil..."
                    options={car_model?.map((item) => ({
                      value: item.uid,
                      label: `${item?.full_name}`,
                    }))}
                    onChange={(selectedOption) =>
                      setSelectedCarModel(selectedOption)
                    }
                    value={selected_car_model}
                    isClearable
                  />
                </div>
                <div className="">
                  <Textinput
                    type="text"
                    label="Tipe Mobil"
                    placeholder="Masukkan tipe mobil jika tersedia"
                    value={customer_car_type}
                    onChange={(e) => setIsCustomerCarType(e.target.value)}
                  />
                </div>
                <div className="">
                  <Textinput
                    type="text"
                    label="Warna Mobil "
                    placeholder="Masukkan warna mobil jika tersedia"
                    value={customer_car_color}
                    onChange={(e) => setIsCustomerCarColor(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="mb-3">
              <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
                <label htmlFor=" hh" className="form-label ">
                  Pelanggan *
                </label>
                <Select
                  className="react-select mt-2"
                  classNamePrefix="select"
                  placeholder="Pilih pelanggan..."
                  options={customer?.map((item) => ({
                    value: item.uid,
                    label: `${item?.first_name} ${item?.last_name || ""}`,
                  }))}
                  onChange={handleCustomerChange}
                  value={selected_customer}
                  isClearable
                />
              </div>
              <div className="flex row mt-5">
                <Switch
                  label="Mobil Baru ?"
                  activeClass="bg-success-500"
                  value={check_is_new_customer_car}
                  onChange={() =>
                    setCheckIsNewCustomerCar(!check_is_new_customer_car)
                  }
                  badge
                  prevIcon="heroicons-outline:check"
                  nextIcon="heroicons-outline:x"
                />
              </div>

              {check_is_new_customer_car ? (
                <>
                  <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5 mt-5">
                    <div className="">
                      <label htmlFor=" hh" className="form-label ">
                        Model Mobil *
                      </label>
                      <Select
                        className="react-select mt-2"
                        classNamePrefix="select"
                        placeholder="Pilih mobil baru..."
                        options={car_model?.map((item) => ({
                          value: item.uid,
                          label: `${item?.full_name}`,
                        }))}
                        onChange={(selectedOption) =>
                          setSelectedCarModel(selectedOption)
                        }
                        value={selected_car_model}
                        isClearable
                      />
                    </div>
                    <div className="">
                      <Textinput
                        type="text"
                        label="Tipe Mobil"
                        placeholder="Masukkan tipe mobil jika tersedia"
                        value={customer_car_type}
                        onChange={(e) => setIsCustomerCarType(e.target.value)}
                      />
                    </div>
                    <div className="">
                      <Textinput
                        type="text"
                        label="Warna Mobil "
                        placeholder="Masukkan warna mobil jika tersedia"
                        value={customer_car_color}
                        onChange={(e) => setIsCustomerCarColor(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-5">
                    <label htmlFor=" hh" className="form-label ">
                      Model Mobil Pelanggan *
                    </label>
                    <Select
                      className="react-select mt-2"
                      classNamePrefix="select"
                      placeholder="Pilih mobil pelanggan..."
                      options={customer_car}
                      onChange={(selectedOption) =>
                        setSelectedCustomerCar(selectedOption)
                      }
                      value={selected_customer_car}
                      isClearable
                    />
                  </div>
                </>
              )}
            </Card>
          </>
        )}

        <Card className="mb-3">
          <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
            <label htmlFor=" hh" className="form-label ">
              Pilih Sales *
            </label>
            <Select
              className="react-select mt-2"
              classNamePrefix="select"
              placeholder="Pilih sales..."
              options={sales?.map((item) => ({
                value: item.uid,
                label: `${item?.profile?.first_name} ${item?.profile?.last_name || ""}`,
              }))}
              onChange={(selectedOption) =>
                setSelectedSales(selectedOption)
              }
              value={selected_sales}
              isClearable
            />
          </div>
          <div className="text-base text-slate-600 dark:text-slate-300 mb-4">
            <label htmlFor=" hh" className="form-label ">
              Pilih Persetujuan Admin (Optional)
            </label>
            <Select
              className="react-select mt-2"
              classNamePrefix="select"
              placeholder="Pilih admin..."
              options={approve_by?.map((item) => ({
                value: item.uid,
                label: `${item?.profile?.first_name} ${item?.profile?.last_name || ""}`,
              }))}
              onChange={(selectedOption) =>
                setSelectedApproval(selectedOption)
              }
              value={selected_approval}
              isClearable
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

export default CreateDO;
