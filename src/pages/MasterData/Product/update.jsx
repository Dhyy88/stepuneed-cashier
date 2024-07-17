import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ApiEndpoint from "../../../API/Api_EndPoint";
import axios from "../../../API/Axios";
import "swiper/swiper-bundle.min.css";
import Textinput from "@/components/ui/Textinput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Fileinput from "@/components/ui/Fileinput";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Swal from "sweetalert2";
import { Modal, Select } from "antd";
import { TreeSelect } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import Alert from "@/components/ui/Alert";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [data_cars, setDataCars] = useState({
    // data_cars: [],
    current_page: 1,
    last_page: 1,
    prev_page_url: null,
    next_page_url: null,
  });
  const [data_variant_generator, setDataVariantGenerator] = useState([]);
  const [query, setQuery] = useState({
    search: "",
    is_active: "",
    paginate: 9999,
  });

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [min_order, setMinOrder] = useState("");
  const [warranty, setWarranty] = useState("");
  const [is_active, setIsActive] = useState(false);
  const [primary_image, setPrimaryImage] = useState(null);
  const [images, setImages] = useState([]);
  const [variant_name, setVariantName] = useState("");
  const [variant_options, setVariantOptions] = useState([]);
  const [error, setError] = useState("");
  const [car_models, setCarModel] = useState("");
  const [variants, setVariants] = useState([
    {
      sku: "",
      price: "",
      is_primary: false,
      image: null,
    },
  ]);
  const [price, setPrice] = useState([]);
  const [sku, setSku] = useState([]);
  const [sku_single, setSkuSingle] = useState("");
  const [price_single, setPriceSingle] = useState("");
  const [check_is_variant, setCheckIsVariant] = useState(false);
  const [check_is_primary_variant, setCheckPrimaryVariant] = useState(false);
  const [variantCarStatus, setVariantCarStatus] = useState(true);
  const [disabledForms, setDisabledForms] = useState([false]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("");
  const [visibleSubCategories, setVisibleSubCategories] = useState({});
  const [treeData, setTreeData] = useState([]);
  const [isSubmitGenerator, setIsSubmitGenerator] = useState(false);
  const [variant_generator_data, setIsVariantGeneratorData] = useState(null);
  const [selected_cars_by_uid, setSelectedCarsByUid] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commonPrice, setCommonPrice] = useState("");
  const [isModalOpenCars, setIsModalOpenCars] = useState(false);
  const [primaryImageOld, setPrimaryImageOld] = useState(null);
  const [imageOld, setImageOld] = useState([]);
  const [variantImages, setVariantImages] = useState([]);
  // const [variantSKU, setVariantSKU] = useState([]);
  // const [variantPrice, setVariantPrice] = useState([]);

  const [deleted_images, setDeletedImages] = useState([]);

  const getDataById = () => {
    try {
      if (uid) {
        axios.get(`${ApiEndpoint.PRODUCTS}/${uid}`).then((response) => {
          const productUid = response?.data?.data;
          setCategory(productUid?.category_uid);
          setName(productUid?.name);
          setDescription(productUid?.description);
          setMinOrder(productUid?.minimal_order);
          setWarranty(productUid?.warranty);
          setIsActive(productUid?.is_active);
          setPrimaryImageOld(response?.data?.data?.primary_image);
          setImageOld(response?.data?.data?.images);
          setVariantImages(
            response?.data?.data?.variants.map((variant) => variant.image)
          );
          if (productUid?.variants && productUid?.variants.length > 0) {
            const variantsData = productUid.variants.map((variant) => ({
              sku: variant.sku,
              price: variant.price,
              is_primary: variant.is_primary,
            }));
            setVariants(variantsData);
            const primaryVariantIndex = variantsData.findIndex(
              (variant) => variant.is_primary
            );
            setCheckPrimaryVariant(
              primaryVariantIndex !== -1 ? primaryVariantIndex : false
            );
          }

          if (productUid?.variant_type?.variant_name !== null) {
            setVariantName(productUid?.variant_type?.variant_name);
            setVariantOptions(productUid?.variant_type?.variant_options);
            setSelectedCarsByUid(productUid?.variant_type?.car_models || []);
            // console.log(productUid?.variant_type?.car_models);
            setCheckIsVariant(true);
          } else {
            setCheckIsVariant(false);
            // setSku(productUid.variants[0].sku);
            // setPrice(productUid.variants[0].price);
            setSkuSingle(productUid?.primary_variant?.sku);
            setPriceSingle(productUid?.primary_variant?.price);
          }
        });
      }
    } catch (error) {
      setError(err.response.data.errors);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDataById();
  }, [uid]);

  useEffect(() => {
    if (check_is_variant) {
      onSetupVariants();
    }
  }, [check_is_variant]);

  const getCategoryLabelByUid = async (categoryUid) => {
    try {
      const category = selectedCategory.find(
        (category) => category.uid === categoryUid
      );
      if (category) {
        setSelectedCategoryLabel(category.name);
      }
    } catch (error) {
      console.error("Error fetching category label:", error);
    }
  };

  useEffect(() => {
    if (category && selectedCategory.length > 0) {
      getCategoryLabelByUid(category);
    }
  }, [category, selectedCategory]);

  const handleSkuChange = (value, index) => {
    const updatedSku = [...sku];
    const updatedVariants = [...variants];
    updatedSku[index] = value;
    updatedVariants[index] = { ...updatedVariants[index], sku: value };

    setSku(updatedSku);
    setVariants(updatedVariants);
  };

  const handlePriceChange = (value, index) => {
    const updatedPrice = [...price];
    updatedPrice[index] = value;
    setPrice(updatedPrice);

    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], price: value };
    setVariants(updatedVariants);
  };

  const handleFileChangeVariantImages = (e, index) => {
    const files = e.target.files;
    const file = files[0];

    if (!variants[index]) {
      return;
    }

    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      image: file,
    };

    setVariants(updatedVariants);
  };

  const handlePrimaryVariantChange = (index) => {
    setCheckPrimaryVariant(index);

    const updatedVariants = variants.map((variant, i) => ({
      ...variant,
      is_primary: i === index,
    }));

    setVariants(updatedVariants);
  };

  const handleCheckboxChange = (carModelUid) => {
    const updatedCarModels = selected_cars_by_uid.includes(carModelUid)
      ? selected_cars_by_uid.filter((uid) => uid !== carModelUid)
      : [...selected_cars_by_uid, carModelUid];

    setSelectedCarsByUid(updatedCarModels);
  };

  const handleOpenModalCars = () => {
    setIsModalOpenCars(true);
  };

  const handleFileChangePrimary = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrimaryImage(file);
      setPrimaryImageOld(null);
    }
  };

  const handleFileChangeImages = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files).map((file) => file);
    setImages(filesArray);
    // setImageOld(null);
  };

  const handleDeleteImage = (index) => {
    if (deleted_images.includes(index)) {
      setDeletedImages(deleted_images.filter((i) => i !== index));
    } else {
      setDeletedImages([...deleted_images, index]);
    }
  };

  const mapSelectedCategoryToTreeData = (category) => {
    return category.map((item) => {
      if (item.sub_count > 0) {
        return {
          title: item.name,
          value: item.uid,
          children: mapSelectedCategoryToTreeData(item.sub_categories),
          disabled: true,
        };
      } else {
        return {
          title: item.name,
          value: item.uid,
        };
      }
    });
  };

  const handleTreeSelectChange = (value, label) => {
    if (label && label.trigger && label.trigger.dataRef) {
      const labelData = label.trigger.dataRef;
      setCategory(labelData.value);
    }
    if (Array.isArray(value) && value.length > 0) {
      const selectedUIDs = value.map((selectedValue) => {
        const selectedItem = selectedCategory.find(
          (item) => item.uid === selectedValue
        );
        return selectedItem ? selectedItem.uid : null;
      });
      setCategory(selectedUIDs.filter((uid) => uid !== null));
    }
  };

  const filterTreeNode = (input, treeNode) => {
    const title = treeNode.props?.title || "";
    return title.toLowerCase().includes(input.toLowerCase());
  };

  useEffect(() => {
    const getCategory = () => {
      axios.get(ApiEndpoint.CATEGORIES).then((response) => {
        setSelectedCategory(response.data.data);
      });
    };

    getCategory();
  }, []);

  useEffect(() => {
    const selectedCategoryTreeData =
      mapSelectedCategoryToTreeData(selectedCategory);
    setTreeData(selectedCategoryTreeData);
  }, [selectedCategory]);

  const onSubmitCars = async () => {
    try {
      setIsModalOpenCars(false);
      if (selected_cars_by_uid.length > 0) {
        setCarModel(selected_cars_by_uid);
      }
    } catch (error) {
      Swal.fire("Error", "Gagal memilih data mobil", "error");
    }
  };

  const onResetCheckCars = async () => {
    setSelectedCarsByUid([]);
  };

  const handleCancelModalCars = () => {
    setIsModalOpenCars(false);
  };

  const handleSelectChange = (selected) => {
    setVariantOptions(selected);
    const initialStatus = selected.reduce((acc, option) => {
      acc[option] = true;
      return acc;
    }, {});
    setVariantCarStatus(initialStatus);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const newTag = { label: event.target.value, value: event.target.value };
      event.target.value = "";
      event.preventDefault();
    }
  };

  const onSetupVariants = async () => {
    try {
      await handleVariantGenerator(selected_cars_by_uid);
      setIsSubmitGenerator(true);
      // setSelectedCarsByUid([]);
    } catch (error) {
      Swal.fire("Error", "Gagal mengatur variasi", "error");
    }
  };

  async function getDataCars(query) {
    try {
      const response = await axios.post(ApiEndpoint.CARS, {
        page: query?.page,
        paginate: query?.paginate,
        search: query?.search,
      });
      setDataCars(response?.data?.data?.data);
      // setIsModalOpenCars(true);
    } catch (error) {
      Swal.fire("Gagal", "Gagal memuat data mobil", "error");
    }
  }

  useEffect(() => {
    getDataCars(query);
  }, [query]);

  async function handleVariantGenerator(selectedCars) {
    try {
      const requestData = {};

      if (variant_name && variant_options.length > 0) {
        requestData.variant_name = variant_name;
        requestData.variant_options = variant_options || [];
      }

      if (selectedCars.length > 0) {
        requestData.car_models = selectedCars;
      }

      const response = await axios.post(
        ApiEndpoint.VARIANT_GENERATOR,
        requestData
      );

      setDataVariantGenerator(response?.data?.data);
    } catch (error) {
      // Swal.fire("Gagal", "Masukkan minimal 1 opsi variasi", "error");
    }
  }

  useEffect(() => {
    if (isSubmitGenerator && data_variant_generator) {
      setIsVariantGeneratorData(data_variant_generator);
    }
  }, [data_variant_generator, isSubmitGenerator]);

  const onSubmit = async (e) => {
    // setIsLoading(true);
    e.preventDefault();
    const active = is_active ? 1 : 0;
    const is_variant = check_is_variant ? true : false;

    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("min_order", min_order);
    formData.append("warranty", warranty || "");
    formData.append("is_active", active);
    formData.append("check_is_variant", is_variant);

    if (check_is_variant) {
      formData.append("variant_name", variant_name);

      for (let i = 0; i < variant_options.length; i++) {
        formData.append("variant_options[]", variant_options[i]);
        console.log(variant_options[i]);
      }
      for (let i = 0; i < selected_cars_by_uid.length; i++) {
        formData.append("car_models[]", selected_cars_by_uid[i]);
        console.log(selected_cars_by_uid[i]);
      }
      console.log(variant_generator_data);
      variant_generator_data.forEach((variantGenerator, index) => {
        formData.append(`variants[${index}][sku]`, variants[index].sku || "");
        formData.append(
          `variants[${index}][price]`,
          variants[index].price || ""
        );
        formData.append(
          `variants[${index}][is_primary]`,
          variants[index].is_primary ? 1 : 0
        );

        if (variants && variants[index].image) {
          formData.append(`variants[${index}][image]`, variants[index]?.image);
        }

        if (variants && variant_generator_data[index]?.variant?.option) {
          formData.append(
            `variants[${index}][variant_option]`,
            variant_generator_data[index]?.variant?.option || ""
          );
        }

        if (variants && variant_generator_data[index]?.car_model?.uid) {
          formData.append(
            `variants[${index}][car_model]`,
            variant_generator_data[index]?.car_model?.uid || ""
          );
        }
      });
    } else {
      formData.append("sku", sku_single);
      formData.append("price", price_single);
    }

    if (primary_image) {
      formData.append("primary_image", primary_image || "");
    }

    for (let i = 0; i < images.length; i++) {
      formData.append("images[]", images[i]);
    }

    for (let i = 0; i < deleted_images.length; i++) {
      formData.append("deleted_images[]", deleted_images[i]);
    }

    Swal.fire({
      icon: "warning",
      title: "Konfirmasi",
      text: "Anda yakin data yang dimasukkan sudah benar?",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbaharui",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      setIsLoading(true);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${ApiEndpoint.PRODUCTS}/${uid}`,
            formData
          );
          if (response.status === 200) {
            Swal.fire("Berhasil", "Produk telah diperbaharui", "success");
            setIsLoading(false);
            navigate("/products");
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
          Swal.fire("Gagal", error?.response?.data?.message, "error");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });
  };

  const previousPage = () => {
    navigate(-1);
  };

  return (
    <div className="lg:col-span-12 col-span-12">
      <Card title={"Perbaharui Produk"}>
        <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Kategori Produk *
            </label>
            <TreeSelect
              treeData={treeData}
              value={selectedCategoryLabel}
              showSearch
              style={{ width: "100%" }}
              placeholder="Pilih Kategori"
              onChange={(value, label, extra) =>
                handleTreeSelectChange(value, label, extra)
              }
              filterTreeNode={filterTreeNode}
              notFoundContent={
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    padding: 10,
                  }}
                >
                  <div className="">
                    <span className="text-slate-900 dark:text-white text-[100px]  transition-all duration-300 ">
                      <Icon icon="heroicons:exclamation-triangle" />
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-900 dark:text-white text-[30px]">
                      Tidak ada data
                    </span>
                  </div>
                </div>
              }
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.category}
              </span>
            )}
          </div>
          {selectedCategory && selectedCategory.subCount > 0 && (
            <div className="">
              <label htmlFor="subCategory" className="form-label">
                Sub Kategori Produk *
              </label>
              <TreeSelect
                treeData={visibleSubCategories}
                treeCheckable
                style={{ width: "100%" }}
                placeholder="Pilih Sub Kategori"
                treeCheckStrictly
              />
            </div>
          )}
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
          <div className="">
            <Textinput
              type="text"
              label="Nama Produk *"
              placeholder="Masukkan nama produk"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">{error.name}</span>
            )}
          </div>
          <div className="">
            <Textinput
              type="number"
              label="Minimal Pesanan *"
              placeholder="Masukkan angka minimal pesanan"
              value={min_order}
              onChange={(e) => setMinOrder(e.target.value)}
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.min_order}
              </span>
            )}
          </div>
          <div className="">
            <Textinput
              type="number"
              label="Garansi produk (optional) "
              placeholder="Garansi produk berupa angka per bulan"
              value={warranty}
              // onChange={(e) => {
              //   const value = e.target.value;
              //   if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
              //     setWarranty(value);
              //   }
              // }}
              onChange={(e) => setWarranty(e.target.value)}
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.warranty}
              </span>
            )}
          </div>
        </div>
        <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Deskripsi Produk *
            </label>
            <ReactQuill
              theme="snow"
              placeholder="Masukkan deskripsi produk..."
              value={description}
              onChange={setDescription}
              modules={{
                toolbar: [
                  [{ size: ["small", false, "large", "huge"] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                    { align: [] },
                  ],
                  [
                    {
                      color: [
                        "#000000",
                        "#e60000",
                        "#ff9900",
                        "#ffff00",
                        "#008a00",
                        "#0066cc",
                        "#9933ff",
                        "#ffffff",
                        "#facccc",
                        "#ffebcc",
                        "#ffffcc",
                        "#cce8cc",
                        "#cce0f5",
                        "#ebd6ff",
                        "#bbbbbb",
                        "#f06666",
                        "#ffc266",
                        "#ffff66",
                        "#66b966",
                        "#66a3e0",
                        "#c285ff",
                        "#888888",
                        "#a10000",
                        "#b26b00",
                        "#b2b200",
                        "#006100",
                        "#0047b2",
                        "#6b24b2",
                        "#444444",
                        "#5c0000",
                        "#663d00",
                        "#666600",
                        "#003700",
                        "#002966",
                        "#3d1466",
                        "custom-color",
                      ],
                    },
                  ],
                ],
              }}
            />
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.description}
              </span>
            )}
          </div>
        </div>
        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Gambar Utama *
            </label>
            <Alert
              icon="heroicons-outline:exclamation"
              className="light-mode alert-warning mb-5"
            >
              <p>
                Format gambar JPG/JPEG dengan rasio 1:1 , Abaikan form ini jika
                tidak ingin mengubah gambar !
              </p>
            </Alert>
            <Fileinput
              selectedFile={primary_image}
              onChange={handleFileChangePrimary}
              preview
              isClearable={true}
            />
            {primaryImageOld && (
              <div className="flex flex-wrap space-x-5 rtl:space-x-reverse justify-center">
                <div className="xl:w-1/5 md:w-1/3 w-1/2 rounded mt-6 border p-2  border-slate-200  ">
                  <img
                    src={primaryImageOld?.url}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
              </div>
            )}
            {error && (
              <span className="text-danger-600 text-xs py-2">
                {error.primary_image}
              </span>
            )}
          </div>
          <div className="">
            <label htmlFor=" hh" className="form-label ">
              Gambar Pendukung (optional)
            </label>
            <Alert
              icon="heroicons-outline:exclamation"
              className="light-mode alert-warning mb-5"
            >
              <p>
                Format gambar JPG/JPEG dengan rasio 1:1. Abaikan form ini jika
                tidak ingin mengubah gambar dan untuk menghapus gambar silahkan
                ceklis gambar yang ingin dihapus !
              </p>
            </Alert>
            <Fileinput
              name="basic"
              selectedFiles={images}
              onChange={handleFileChangeImages}
              multiple
              preview
            />
            {imageOld && imageOld.length > 0 && (
              <div className="flex flex-wrap space-x-5 rtl:space-x-reverse">
                {imageOld?.map((item, index) => (
                  <div
                    className="xl:w-1/5 md:w-1/3 w-1/2 rounded mt-6 border p-2  border-slate-200"
                    key={index}
                  >
                    <div className="mb-2">
                      <img
                        src={item.url}
                        alt={`Image ${index}`}
                        className="object-cover w-full h-full rounded"
                      />
                    </div>
                    <div className="">
                      <Checkbox
                        label="Hapus Gambar"
                        activeClass="ring-danger-500 bg-danger-500"
                        value={deleted_images.includes(item.uid)}
                        onChange={() => handleDeleteImage(item.uid)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Card title="Opsi Produk" className="mb-5">
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 ">
            <div className="flex row gap-20">
              <Switch
                label="Status Produk (Optional)"
                activeClass="bg-success-500"
                value={is_active}
                onChange={() => setIsActive(!is_active)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
              <Switch
                label="Variasi Produk (Optional)"
                activeClass="bg-success-500"
                value={check_is_variant}
                onChange={() => setCheckIsVariant(!check_is_variant)}
                badge
                prevIcon="heroicons-outline:check"
                nextIcon="heroicons-outline:x"
              />
            </div>
          </div>
        </Card>

        {check_is_variant ? (
          <>
            <Alert
              // dismissible
              icon="heroicons-outline:exclamation"
              className="light-mode alert-warning mb-5"
            >
              <p>
                1. Untuk fungsi memilih model mobil, anda akan menerbitkan produk
                dengan tipe mobil tertentu. Jika tidak memilih, maka produk ini
                berlaku untuk semua tipe mobil !
              </p>
              <p>
                2. Ketika mengubah Opsi variasi ataupun Model Mobil, mohon untuk
                menekan tombol terapkan variasi !
              </p>
            </Alert>
            <Card title="Variasi Produk" className="mb-5">
              <div className="flex row gap-5 mb-5">
                <div className="w-96">
                  <Textinput
                    type="text"
                    label="Nama Variasi *"
                    placeholder=""
                    value={variant_name}
                    onChange={(e) => setVariantName(e.target.value)}
                  />
                  {error && (
                    <span className="text-danger-600 text-xs py-2">
                      {error.varian_name}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor=" hh" className="form-label ">
                    Opsi Variasi *
                  </label>
                  <Select
                    mode="tags"
                    style={{ width: "100%", height: 40 }}
                    onChange={handleSelectChange}
                    value={variant_options}
                    tokenSeparators={[","]}
                    disabled={variant_name.trim() === ""}
                    onKeyDown={handleKeyDown}
                  />
                  {error && (
                    <span className="text-danger-600 text-xs py-2">
                      {error.variant_options}
                    </span>
                  )}
                </div>
                <div className="w-48">
                  <label htmlFor=" hh" className="form-label ">
                    Pilih Model Mobil ?
                  </label>
                  <button
                    className="btn-sm btn-primary"
                    type="button"
                    onClick={handleOpenModalCars}
                    style={{ height: 40, width: "100%", borderRadius: 10 }}
                  >
                    Tambah model
                  </button>
                  <Modal
                    width={1500}
                    title="Model Mobil"
                    open={isModalOpenCars}
                    centered
                    footer
                    onCancel={handleCancelModalCars}
                  >
                    <Card>
                      <div className="flex row w-full justify-between items-center mb-2 gap-5">
                        <div className="w-full">
                          <Textinput
                            onChange={(event) =>
                              setQuery({
                                ...query,
                                search: event.target.value,
                              })
                            }
                            placeholder="Cari model mobil..."
                          />
                        </div>
                        <div className="">
                          <button
                            className="action-btn flex btn-danger"
                            type="button"
                            onClick={onResetCheckCars}
                            style={{ height: 40, width: 40 }}
                          >
                            <Icon icon="heroicons:arrow-path" />
                          </button>
                        </div>
                      </div>
                    </Card>
                    <Card className="mt-2">
                      <div className="flex row ">
                        <ul>
                          <div className="grid xl:grid-cols-10 md:grid-cols-10 grid-cols-1 gap-5 h-full ">
                            {Array.isArray(data_cars) &&
                              data_cars.map((car) => (
                                <li key={car.uid} className="flex row ">
                                  <Checkbox
                                    value={selected_cars_by_uid.includes(
                                      car.uid
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(car.uid)
                                    }
                                  />
                                  {`${car?.full_name}`}
                                </li>
                              ))}
                          </div>
                        </ul>
                      </div>
                    </Card>
                    <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mt-10">
                      <Button
                        text="Konfirmasi"
                        className="btn-primary dark w-full"
                        onClick={onSubmitCars}
                      />
                    </div>
                  </Modal>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <Button
                  text="Terapkan Variasi"
                  className="btn-outline-success light"
                  onClick={onSetupVariants}
                />
              </div>
            </Card>
            {variant_generator_data?.length > 0 && (
              <Card title={`Variasi`} className="mt-5">
                {variant_generator_data?.map((item, index) => (
                  <Card key={index} className="mt-5">
                    <div className="flex justify-between mb-5">
                      <div className="">
                        <span className="text-success-500">
                          {item?.variant?.option ? (
                            `Opsi Variasi : ${item?.variant?.option}`
                          ) : (
                            <></>
                          )}
                          <br />
                          {item?.car_model?.full_name ? (
                            `Model Mobil : ${item?.car_model?.full_name}`
                          ) : (
                            <></>
                          )}
                        </span>
                      </div>
                      <div className="flex row justify-end gap-10">
                        <div className="">
                          <Switch
                            label="Utama"
                            activeClass="bg-success-500"
                            badge
                            prevIcon="heroicons-outline:check"
                            nextIcon="heroicons-outline:x"
                            value={index === check_is_primary_variant}
                            onChange={() => handlePrimaryVariantChange(index)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 mb-5">
                      <div className="">
                        <Textinput
                          type="text"
                          label="SKU Variasi Produk *"
                          placeholder=""
                          disabled={disabledForms[index]}
                          value={variants[index] ? variants[index].sku : ""}
                          onChange={(e) =>
                            handleSkuChange(e.target.value, index)
                          }
                        />
                      </div>
                      <div className="">
                        <Textinput
                          type="number"
                          label="Harga Variasi Produk *"
                          placeholder=""
                          disabled={disabledForms[index]}
                          value={variants[index] ? variants[index].price : ""}
                          onChange={(e) =>
                            handlePriceChange(e.target.value, index)
                          }
                        />
                      </div>
                      <div className="">
                        <label htmlFor=" hh" className="form-label ">
                          Gambar Variasi Produk
                        </label>
                        <Fileinput
                          selectedFile={
                            variants[index] ? variants[index].image : null
                          }
                          onChange={(e) =>
                            handleFileChangeVariantImages(e, index)
                          }
                          isClearable={true}
                          disabled={disabledForms[index]}
                          preview
                        />
                        {variants[index] && variantImages[index] && (
                          <>
                            <div className="flex flex-wrap space-x-5 rtl:space-x-reverse justify-center">
                              <div className="xl:w-1/5 md:w-1/3 w-1/2 rounded mt-6 border p-2  border-slate-200  ">
                                <img
                                  src={variantImages[index]?.url}
                                  className="object-cover w-full h-full rounded"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap space-x-5 rtl:space-x-reverse justify-center">
                              <label
                                htmlFor=" hh"
                                className="form-label text-center"
                              >
                                Gambar Lama
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </Card>
            )}
          </>
        ) : (
          <>
            <div className="grid xl:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-5 mb-5">
              <div className="">
                <Textinput
                  type="text"
                  label="SKU Produk *"
                  placeholder="Masukkan sku produk"
                  value={sku_single}
                  onChange={(e) => setSkuSingle(e.target.value)}
                />
              </div>
              <div className="">
                <Textinput
                  type="text"
                  label="Harga Produk *"
                  placeholder="Masukkan harga produk"
                  value={price_single}
                  onChange={(e) => setPriceSingle(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mt-10">
          <Button
            text="Batal"
            className="btn-primary light w-full"
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

export default UpdateProduct;
