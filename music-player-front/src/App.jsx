import "./App.css";
import { Card, Tab, Tabs } from "@blueprintjs/core";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";
import Loader from "./components/Loader";
import Login from "./components/Login";
import Register from "./components/Register";
import Welcome from "./components/Welcome";

function App() {
  const [currentTab, setCurrentTab] = useState("login");
  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = useCallback(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, token: data.token };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null };
        });
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return userContext.token === null ? (
    <>
      {/* <img className="iconImg" src="/leaf_angle.png" alt="" /> */}
      <Card elevation='1' className='mainCard '>
        <Tabs
          id='Tabs'
          className='reg-form'
          onChange={setCurrentTab}
          selectedTabId={currentTab}
        >
          <Tab id='login' title='Login' panel={<Login />} />
          <Tab id='register' title='Register' panel={<Register />} />
          <Tabs.Expander />
        </Tabs>
      </Card>
    </>
  ) : userContext.token ? (
    <Welcome />
  ) : (
    <Loader />
  );
}

export default App;
