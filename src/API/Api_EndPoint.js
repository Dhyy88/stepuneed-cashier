const ApiEndpoint = {
  // AUTH AREA
    LOGIN: 'warehouse/auth/login',
    LOGOUT: 'warehouse/auth/logout',
    DETAIL: 'warehouse/account',
    CHANGE_PASSWORD: 'warehouse/account/password/change',

  //STOCK OPNAME
    STOCKOPNAME: "warehouse/stocks/opname",
    RECEIVE_PO: "warehouse/purchase-order-receive",
    PO_NUMBER: "warehouse/purchase-order-receive/purchase-order-detail",

  // STOCK
    STOCK: "warehouse/stocks",
    LOCATION_STOCK: "warehouse/stocks/locations",
    VARIANTS: "warehouse/variants",
    MANUAL_STOCK: "warehouse/manual-stock-receive",

  //HO ACCOUNT
    HO: 'ho/hos',
    HO_CREATE: 'ho/hos/create',

    //SITE AREA
    SITES: 'ho/sites',
    CREATE_SITES: 'ho/sites/create',
    STORE_LIST: 'ho/sites/store',
    WAREHOUSE_LIST: 'ho/sites/warehouse',
    STORE_WH_LIST: 'ho/sites/store-warehouse',

    //WAREHOUSE AREA
    WAREHOUSE: 'ho/warehouses',
    CREATE_WAREHOUSE: 'ho/warehouses/create',

    //PRODCTS
    PRODUCTS : 'ho/products',
    VARIANT_GENERATOR: 'ho/products/variant-generator',
    CREATE_PRODUCTS: 'ho/products/create',

    //ADMINISTRATIVE AREA PUBLIC
    GET_PROVINCE: 'administrative-area/provinces',
    GET_CITIES: 'administrative-area/cities',

    //PERMISSION AREA
    GET_PERMISSION : 'ho/roles/permission-list',
    ROLE : 'ho/roles',
    POST_ROLES: 'ho/hos'
  }
  
  export default ApiEndpoint
  