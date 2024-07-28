const ApiEndpoint = {
  // AUTH AREA
  LOGIN: 'cashier/auth/login',
  LOGOUT: 'cashier/auth/logout',
  DETAIL: 'cashier/account',
  CHANGE_PASSWORD: 'cashier/account/password/change',

  // USER AREA
  HO_APPROVE: "cashier/hos/can-approve-do",
  CUSTOMER: "cashier/customers",
  SALES_BY_SITE: "cashier/sales/by-site",
  CAR_MODEL: "cashier/car-models",
  APPROVAL_HO: "cashier/hos/can-approve-do",

  // DO AREA
  DO: "cashier/delivery-orders/create-by-me",
  DO_DETAIL: "cashier/delivery-orders",
  CREATE_DO: "cashier/delivery-orders/create",
  DO_RETURN: "cashier/do-returns/create-by-me",
  CREATE_DO_RETURN: "cashier/do-returns/create",
  DETAIL_DO_RETURN: "cashier/do-returns",
  DO_TEMP: "cashier/temp-delivery-orders/create-by-me",
  CREATE_DO_TEMP: "cashier/temp-delivery-orders/create",

  //STOCK
  STOCK: "cashier/products/stocks",
  STOCK_BY_BARCODE: "cashier/products/by-barcode",
  CART: "cashier/carts",
  ORDER: "cashier/orders/create",

  //ADMINISTRATIVE AREA PUBLIC
  GET_PROVINCE: 'administrative-area/provinces',
  GET_CITIES: 'administrative-area/cities',
  GET_WAREHOUSE: "cashier/sites/warehouse-by-city",
  GET_PRODUCT_LIST: "cashier/products/variant-by-city",
  GET_PRODUCT_BY_WH: "cashier/products/variant-by-warehouse-site",
  GET_PRODUCT_BY_SITE: "cashier/products/variant-by-site",
  STOCK_LIST_BY_WH: "cashier/delivery-orders/stock-by-warehouse-site",
}

export default ApiEndpoint
