import React from "react";
import { Box, Modal, Backdrop, Fade, Typography, Chip } from "@mui/material";

const BestRouteModal = ({ open, onClose, bestTour, bestSettings }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            borderRadius: 2,

            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            maxWidth: "90%",
            maxHeight: "70vh",

            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          <Typography
            id="transition-modal-title"
            align="center"
            variant="h6"
            component="h2"
          >
            Best route and settings
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
              Route:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                position: "relative",
                mt: 1,
              }}
            >
              {bestTour.map((city, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <Box
                      sx={{
                        width: "20px",
                        height: "2px",
                        bgcolor: "black",
                        position: "relative",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                  <Chip
                    label={`${index + 1}. ${city.name}`}
                    sx={{ fontSize: "0.75rem" }}
                  />
                </React.Fragment>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Settings:
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              Ant count: {bestSettings.numAnts}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              Iteration count: {bestSettings.numIterations}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              Evaporation rate: {bestSettings.evaporationRate}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              Alfa: {bestSettings.alpha}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              Beta: {bestSettings.beta}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              Starting city index: {bestSettings.startIndex}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default BestRouteModal;
