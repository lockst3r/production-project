import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import "./styles/index.scss";
import { MainPageAsync } from "./pages/table-page/table-page.async";
import { DynamicForm } from "./pages/form-page/form-page.async";
import { NavBar } from "./components/nav-bar";
import { Link } from "./components/nav-bar/nav-bar.interfaces";

export const App = () => {
  const links: Link[] = [
    { id: "link-1", text: "Form", href: "/" },
    { id: "link-2", text: "Table", href: "/table" },
  ];

  return (
    <div className={"app"}>
      <NavBar links={links} />
      <Suspense fallback={<div>Loading</div>}>
        <Routes>
          <Route path={"/"} element={<DynamicForm />} />
          <Route path={"/table"} element={<MainPageAsync />} />
        </Routes>
      </Suspense>
    </div>
  );
};
