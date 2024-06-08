import React, { useState } from "react";
import "./App.css";
import {
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import CanvasMap from "./components/CanvasMap";
import DataForm from "./components/DataForm";
import initialCities from "./components/Cities";
import { antColonyOptimization, distance } from "./components/AntAlgorithm";
import BestRouteModal from "./components/BestRouteModal";

function App() {
  const [cities, setCities] = useState(initialCities);
  const [bestTour, setBestTour] = useState([]);

  const [isNewBestFound, setIsNewBestFound] = useState(false);

  const [bestSettings, setBestSettings] = useState([]);

  const [bestLength, setBestLength] = useState(Infinity);
  const [formData, setFormData] = useState({
    numAnts: 20,
    numIterations: 100,
    evaporationRate: 0.1,
    alpha: 1,
    beta: 4,
    startIndex: 0,
  });
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const handleApplyChanges = () => {
    if (formData.numIterations > 5000) {
      alert("The number of iterations cannot exceed 5000.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const bestTour = antColonyOptimization(
        cities,
        formData.numAnts,
        formData.numIterations,
        formData.evaporationRate,
        formData.alpha,
        formData.beta,
        formData.startIndex
      );

      setBestTour(bestTour);
      setLoading(false);
      setIsCalculated(true);
      setShouldAnimate(true);
      setIsNewBestFound(false);
      const tourLength = calculateTotalDistance(bestTour);
      if (tourLength < bestLength) {
        setBestLength(tourLength);
        setIsNewBestFound(true);
        setBestSettings(formData);
      }
    }, 0);
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
    setIsNewBestFound(false);
  };

  return (
    <div className="App">
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: "80%",
          height: "100vh",
        }}
      >
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 400,
                textAlign: "center",
                backgroundColor: "#E4F5FF",
                borderRadius: 2,
                boxShadow: "5px 5px #B9CFDC",
                padding: 2,
                height: "90%",
              }}
            >
              <DataForm
                formData={formData}
                setFormData={setFormData}
                initialCities={initialCities}
                disabled={loading}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleApplyChanges}
                  disabled={loading}
                  sx={{
                    bgcolor: "#0C658E",
                    color: "common.white",
                    ":hover": {
                      bgcolor: "#31A7EF",
                      color: "common.white",
                    },
                  }}
                >
                  Apply changes
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {loading ? (
              <>
                <Typography variant="h6" color={"white"} sx={{ mb: 1 }}>
                  Calculating...
                </Typography>
                <CircularProgress disableShrink />
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 560,
                  textAlign: "center",
                  height: "90%",
                }}
              >
                <Typography variant="h6" color={"white"}>
                  Tour length: {calculateTotalDistance(bestTour).toFixed(2)}{" "}
                  units
                </Typography>
                <Box sx={{ width: "100%", position: "relative" }}>
                  <CanvasMap
                    cities={cities}
                    bestRoute={bestTour.map((city) => cities.indexOf(city))}
                    shouldAnimate={shouldAnimate}
                    setShouldAnimate={setShouldAnimate}
                  />
                </Box>
                {isCalculated && (
                  <>
                    {isNewBestFound && (
                      <Alert severity="info">
                        New best route has been found: {bestLength.toFixed(2)}{" "}
                        units{" "}
                      </Alert>
                    )}
                    {!isNewBestFound && (
                      <Typography variant="h6" color={"white"}>
                        Best result: {bestLength.toFixed(2)} units{" "}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={toggleModal}
                        variant="contained"
                        sx={{
                          bgcolor: "#0C658E",
                          color: "common.white",
                          ":hover": {
                            bgcolor: "#31A7EF",
                            color: "common.white",
                          },
                        }}
                      >
                        Show route details
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Grid>
          <BestRouteModal
            open={openModal}
            onClose={toggleModal}
            bestTour={bestTour}
            bestSettings={bestSettings}
          />
        </Grid>
      </Box>
    </div>
  );
}

function calculateTotalDistance(tour) {
  let totalDistance = 0;
  for (let i = 0; i < tour.length - 1; i++) {
    totalDistance += distance(tour[i], tour[i + 1]);
  }
  if (tour.length > 1 && tour[0] && tour[tour.length - 1]) {
    totalDistance += distance(tour[tour.length - 1], tour[0]);
  }
  return totalDistance;
}

export default App;
