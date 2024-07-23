export const menuItems = [
  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    isOpen: true,
    isHide: true,
    link: '/dashboard'
  },  
  
  //Menu Master Inventory
  {
    isHeadr: true,
    title: "Master Data",
  },


  {
    title: "Master DO",
    icon: "heroicons-outline:rectangle-group",
    link: "/app/home",
    child: [
      {
        childtitle: "Data DO",
        childlink: "/do",
      },
      {
        childtitle: "Data DO Retur",
        childlink: "/doreturn"
      },  
      {
        childtitle: "Data DO Sementara",
        childlink: "/dotemp"
      },  
    ]
  },

  {
    title: "Data Stok",
    icon: "heroicons-outline:archive-box",
    link: '/stocks'
  },

  // {
  //   isHeadr: true,
  //   title: "Master Data Pengguna",
  //   isHide: true,
  // },

  {
    isHeadr: true,
    title: "Master Data Akun",
  },

  //Menu Master Pengguna
  {
    title: "Akun",
    icon: "heroicons-outline:users",
    link: "/app/home",
    child: [
      {
        childtitle: "Profil",
        childlink: "/profile",
        childicon: "heroicons-outline:users",
      },
    ]
  },
];

export const topMenu = [

  // Menu Dashboard
  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    link: "dashboard",
  },

  {
    title: "Master PO",
    icon: "heroicons-outline:clipboard-document",
    link: "/app/home",
    isHide: true,
    child: [
      {
        childtitle: "Data PO",
        link: "/po",
        childicon: "heroicons-outline:document",
      },
      {
        childtitle: "Penerimaan PO",
        link: "/receivepo",
        childicon: "heroicons-outline:clipboard-document-check",
      },
   
    ],
  },

  //Menu Master Pengguna
  {
    title: "Master Stock",
    icon: "heroicons-outline:archive-box-arrow-down",
    link: "/app/home",
    isHide: true,
    child: [
      {
        childtitle: "Data Stock",
        link: "/stock",
        childicon: "heroicons-outline:folder-open",
      },
      {
        childtitle: "Stock Opname",
        link: "/stockopname",
        childicon: "heroicons-outline:folder-open",
      },
   
    ],
  },
];

// import User1 from "@/assets/images/all-img/user.png";
// export const notifications = [
//   {
//     title: "Your order is placed",
//     desc: "Amet minim mollit non deser unt ullamco est sit aliqua.",

//     image: User1,
//     link: "#",
//   },
// ];

export const colors = {
  primary: "#4669FA",
  secondary: "#A0AEC0",
  danger: "#F1595C",
  black: "#111112",
  warning: "#FA916B",
  info: "#0CE7FA",
  light: "#425466",
  success: "#50C793",
  "gray-f7": "#F7F8FC",
  dark: "#1E293B",
  "dark-gray": "#0F172A",
  gray: "#68768A",
  gray2: "#EEF1F9",
  "dark-light": "#CBD5E1",
};

// export const hexToRGB = (hex, alpha) => {
//   var r = parseInt(hex.slice(1, 3), 16),
//     g = parseInt(hex.slice(3, 5), 16),
//     b = parseInt(hex.slice(5, 7), 16);

//   if (alpha) {
//     return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
//   } else {
//     return "rgb(" + r + ", " + g + ", " + b + ")";
//   }
// };



// BACKUP MENU

  //Menu Master Inventory 
  // {
  //   title: "POS",
  //   icon: "heroicons-outline:rectangle-group",
  //   link: "/app/home",
  //   child: [
  //     {
  //       childtitle: "Data Produk",
  //       link: "/products",
  //     },
  //     {
  //       childtitle: "Data Kategori",
  //       link: "/categories"
  //     },
  //     {
  //       childtitle: "Data Mobil",
  //       link: "/cars"
  //     }
  //   ]
  // },

  // //Menu Master Cabang 
  // {
  //   title: "Master Cabang",
  //   icon: "heroicons-outline:building-office-2",
  //   link: "/app/home",
  //   child: [
  //     {
  //       childtitle: "Data Cabang",
  //       link: "/sites",
  //     },
  //     {
  //       childtitle: "Tambah Cabang",
  //       link: "/sites/create",
  //     },
  //   ]
  // },

  // //Menu Master Dealer 
  // {
  //   title: "Master Dealer",
  //   icon: "heroicons-outline:truck",
  //   link: "/dealers",
  // },

  // // Menu Master Sales
  // {
  //   title: "Master Sales",
  //   icon: "heroicons-outline:user-group",
  //   link: "/app/home",
  //   child: [
  //     {
  //       childtitle: "Sales Army",
  //       link: "/army",
  //     },
  //     {
  //       childtitle: "Sales Internal",
  //       link: "/coming-soon"
  //       // link: "/salesInternal"
  //     }
  //   ]
  // },