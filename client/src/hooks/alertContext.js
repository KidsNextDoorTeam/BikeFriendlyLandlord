import React, { createContext, useState, useContext } from 'react';
const AlertContext = createContext();

function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);


  return <AlertContext.Provider
    value={{
      alert,
      setAlert,
      alertSeverity,
      setAlertSeverity
    }}
  >
    {children}
  </AlertContext.Provider>;
}

/**
 * @returns 
 * alert - current alert text
 * setAlert - method to set Alert text
 * alertSeverity - 'error', 'wanring', 'info', 'success'
 * setAlertSeverity - method to set alert severity
 * 
 */
const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) throw new Error('userAlert must be used within an AlertProvider');
  return context;
};
export {AlertProvider, useAlert};