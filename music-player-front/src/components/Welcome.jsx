import { Card } from "@blueprintjs/core";
import { useCallback, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader";
import SimpleMenu from "./menu";

const Welcome = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  const fetchUserDetails = useCallback(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "users/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, details: data };
        });
      } else {
        if (response.status === 401) {
          window.location.reload();
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, details: null };
          });
        }
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [userContext.details, fetchUserDetails]);

  return userContext.details === null ? (
    "Error Loading User details."
  ) : !userContext.details ? (
    <Loader />
  ) : (
    <>
      <div className='welcome'>
        <h1 className='mainHeading'>
          Welcome {userContext.details.firstName}!
        </h1>
        <SimpleMenu />
      </div>
      <Card elevation='1' className='mainCard'>
        <>
          <p> Space for player </p>
        </>
      </Card>
    </>
  );
};

export default Welcome;
