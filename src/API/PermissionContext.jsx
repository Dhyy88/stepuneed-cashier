import React, { createContext, useContext } from "react";

const AbilityContext = createContext(null);

export const AbilityProvider = ({ children, ability }) => {
  const isSpv = localStorage.getItem("is_spv") === "true";
  const isHO = localStorage.getItem("is_spv") === "false";

  if (isSpv) {
    ability.can([{ actions: "manage", subject: "Pengguna" }]);
    ability.can([{ actions: "manage", subject: "Tambah Cabang" }]);
    ability.can([{ actions: "manage", subject: "Ubah Cabang" }]);
    ability.can([{ actions: "manage", subject: "PO" }]);
    ability.can([{ actions: "manage", subject: "Laporan" }]);
  } else {
    ability.can([{ actions: "read", subject: "Pengguna" }]);
    ability.can([{ actions: "read", subject: "Tambah Cabang" }]);
    ability.can([{ actions: "read", subject: "Ubah Cabang" }]);
    ability.can([{ actions: "read", subject: "PO" }]);
    ability.can([{ actions: "read", subject: "Laporan" }]);
  }
  
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => {
  const ability = useContext(AbilityContext);

  return ability;
};
