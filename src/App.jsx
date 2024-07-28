import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AbilityProvider, useAbility } from "./API/PermissionContext";
import { createMongoAbility } from "@casl/ability";
import Layout from "./layout/Layout";
import Loading from "@/components/Loading";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Login = lazy(() => import("./pages/auth/login"));
const Error = lazy(() => import("./pages/404"));
const Error403 = lazy(() => import("./pages/403"));
const ComingSoonPage = lazy(() => import("./pages/utility/coming-soon"));
const UnderConstructionPage = lazy(() => import("./pages/utility/under-construction"));

// DO
const DO = lazy(() => import("./pages/MasterDO"));
const CreateDO = lazy(() => import("./pages/MasterDO/create"));
const DetailDO = lazy(() => import("./pages/MasterDO/detail"));

// DO RETURN
const DOReturn = lazy(() => import("./pages/MasterDO/DOReturn"));
const CreateDOReturn = lazy(() => import("./pages/MasterDO/DOReturn/create"));
const DetailDOReturn = lazy(() => import("./pages/MasterDO/DOReturn/detail"));

// Temp DO
const DOTemp = lazy(() => import("./pages/MasterDO/TempDO"));
const CreateDoTemp = lazy(() => import("./pages/MasterDO/TempDO/create"));

// Temp DO
const Product = lazy(() => import("./pages/Product"));
const Order = lazy(() => import("./pages/Order"));

// Master Account Setting
const Profiles = lazy(() => import("./pages/MasterUser/MasterAccount")); 
const ProfileSetting = lazy(() => import("./pages/MasterUser/MasterAccount/profile_setting"));
const PasswordSetting = lazy(() => import("./pages/MasterUser/MasterAccount/password_setting"));

// Master User
const Users = lazy(() => import("./pages/MasterUser/MasterAccountUser"));
const DetailUser = lazy(() => import("./pages/MasterUser/MasterAccountUser/detail"));

function App() {
  const ability = createMongoAbility();
    return (
      <AbilityProvider ability={ability}>
        <main className="App relative">
          <Routes>
            <Route path="/" element={ <Suspense fallback={<Loading />}> <Login /> </Suspense>} />
            <Route path="/*" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />

              {/* Route DO */}
              <Route path="do" element={<DO />} />
              <Route path="do/create" element={<CreateDO />} />
              <Route path="do/detail/:uid" element={<DetailDO />} />

              {/* Route DO Return */}
              <Route path="doreturn" element={<DOReturn />} />
              <Route path="doreturn/create" element={<CreateDOReturn />} />
              <Route path="doreturn/detail/:uid" element={<DetailDOReturn />} />

              {/* Route DO Temp */}
              <Route path="dotemp" element={<DOTemp />} />
              <Route path="dotemp/create" element={<CreateDoTemp />} />

              {/* Route Master */}
              <Route path="product" element={<Product />} />
              <Route path="order" element={<Order />} />
              
              {/* Route User */}
              <Route path="profile" element={<Profiles />} />
              <Route path="profile/setting" element={<ProfileSetting />} />
              <Route path="profile/setting/password" element={<PasswordSetting />} />
              <Route path="users" element={ <Suspense fallback={<Loading />}> <UserProtect /> </Suspense> } />
              <Route path="users/detail/:uid" element={<DetailUser />} />

              {/* Route Error */}
              <Route path="*" element={<Navigate to="/404" />} />
              <Route path="#" element={<Navigate to="/403" />} />
            </Route>

            <Route path="/404" element={ <Suspense fallback={<Loading />}> <Error /> </Suspense> } />
            <Route path="/403" element={ <Suspense fallback={<Loading />}> <Error403 /> </Suspense> } />
            <Route path="/coming-soon" element={ <Suspense fallback={<Loading />}> <ComingSoonPage /> </Suspense> } />
            <Route path="/under-construction" element={ <Suspense fallback={<Loading />}> <UnderConstructionPage /> </Suspense> } />
          </Routes>
        </main>
      </AbilityProvider>
    );
  }

  function ProtectedComponent({ action, permission, component }) {
  const ability = useAbility();
  const isSpv = localStorage.getItem("is_spv") === "true";
    if (isSpv || ability.can(action, permission)) {
      return component;
    }
    return <Navigate to="/403" />;
  }

  function UserProtect() {
    return (
      <ProtectedComponent
        action="read"
        permission="Pengguna"
        component={<Users />}
      />
    );
  }
  // function CreateSiteProtect() {
  //   return (
  //     <ProtectedComponent
  //       action="read"
  //       permission="Tambah Cabang"
  //       component={<CreateSite />}
  //     />
  //   );
  // }
  // function UpdateSiteProtect() {
  //   return (
  //     <ProtectedComponent
  //       action="read"
  //       permission="Ubah Cabang"
  //       component={<UpdateSite />}
  //     />
  //   );
  // }

export default App;
