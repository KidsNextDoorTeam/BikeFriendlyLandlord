import { useState } from 'react';

/**
 * @returns 
 * alert - current alert text
 * setAlert - method to set Alert text
 * alertSeverity - 'error', 'wanring', 'info', 'success'
 * setAlertSeverity - method to set alert severity
 * 
 */
export default function useAlert() {
  const [alert, setAlert] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState(null);
  return {
    alert,
    setAlert,
    alertSeverity,
    setAlertSeverity
  };
}