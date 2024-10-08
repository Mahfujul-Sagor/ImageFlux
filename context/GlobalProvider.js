import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, getSession } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);

          return getSession();
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .then((sessionRes) => {
        if (sessionRes) setSession(sessionRes);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        session,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;