import React, { useState, useContext, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import AlertContext from '../hooks/alertContext';
import Collapse from '@mui/material/Collapse';
// import Stack from '@mui/material/Stack';

export default function Alerts() {
  // TODO: Support multiple alerts with array 
  // (individual timers for each ? how to track with re - renders)
  const { alert, alertSeverity, setAlert, setAlertSeverity } = useContext(AlertContext);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      setAlert(null);
      setAlertSeverity(null);
    }, 5000);
  }, [alert]);

  return (
    // <Stack sx={{ width: '100%' }} spacing={2}>
    // </Stack>
    alert && alertSeverity &&
    <Collapse in={open} >
      <Alert severity={alertSeverity}>{alert}</Alert>
    </Collapse >
  );
}
