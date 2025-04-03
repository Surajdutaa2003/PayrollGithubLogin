import React from "react";
import { Typography, Box } from "@mui/material";
import "../styles/Footer.scss"; 

const Footer = () => {
  return (
    <Box className="footer">
      <Typography variant="body2">
        © {new Date().getFullYear()} Employee Payroll System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
