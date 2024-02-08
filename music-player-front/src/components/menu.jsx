// eslint-disable-next-line no-unused-vars
import { useContext } from "react";
import { Menu, MenuItem, Position, Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import * as popover2 from "@blueprintjs/popover2";
import { UserContext } from "../context/UserContext";
import "../App.css";

function SimpleMenu() {
  const [userContext, setUserContext] = useContext(UserContext);
  const logoutHandler = () => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "users/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async () => {
      setUserContext((oldValues) => {
        return { ...oldValues, details: undefined, token: null };
      });
      window.localStorage.setItem("logout", Date.now());
    });
  };

  const refetchHandler = () => {
    setUserContext((oldValues) => {
      return { ...oldValues, details: undefined };
    });
  };

  const menu = (
    <Menu className='mainMenu'>
      <MenuItem text='Your Profile' />
      <MenuItem text='Settings' />
      <MenuItem text='Refetch' onClick={refetchHandler} />
      <MenuItem text='Logout' onClick={logoutHandler} intent='danger' />
    </Menu>
  );
  return (
    <div>
      <popover2.Popover2 content={menu} position={Position.BOTTOM_RIGHT}>
        <Button icon='menu' />
      </popover2.Popover2>
    </div>
  );
}

export default SimpleMenu;
