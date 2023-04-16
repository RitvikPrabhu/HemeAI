import React from "react";
import { styled } from "@mui/material/styles";
import { Button, Paper, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/router";

const PopupContainer = styled(Paper)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  maxWidth: "95vw",
  maxHeight: "95vh",
  overflow: "auto",
  backgroundColor: "#f8d7da",
  color: "#721c24",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const CloseButton = styled(Button)({
  position: "absolute",
  top: "8px",
  right: "8px",
  minWidth: 0,
});

const AbnormalResultsPopup = ({ title, body, showButton, onClose }) => {
  const router = useRouter();

  function handleButtonClick(event) {
    router.push({
      pathname: "/DiseaseDetection",
    });
  }

  return (
    <PopupContainer>
      <CancelIcon sx={{ fontSize: 40 }} />
      <Typography variant="h5" align="center" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        {body}
      </Typography>
      {showButton && (
        <Button
          variant="contained"
          component="label"
          style={{ backgroundColor: "#721c24" }}
          onClick={handleButtonClick}
        >
          Run Disease Detection
        </Button>
      )}
      <CloseButton onClick={onClose}>
        <CancelIcon />
      </CloseButton>
    </PopupContainer>
  );
};

export default AbnormalResultsPopup;
