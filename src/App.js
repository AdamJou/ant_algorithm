import React, { useState } from "react";
import "./App.css";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CanvasMap from "./components/CanvasMap";
import DataForm from "./components/DataForm";
import initialCities from "./components/Cities";
import { antColonyOptimization, distance } from "./components/AntAlgorithm";

function App() {
  const [cities, setCities] = useState(initialCities);
  const [bestTour, setBestTour] = useState([]);
  const [bestLength, setBestLength] = useState(Infinity);
  const [formData, setFormData] = useState({
    numAnts: 100,
    numIterations: 100,
    evaporationRate: 0.1,
    alpha: 1,
    beta: 4,
    startIndex: 0,
  });
  const [loading, setLoading] = useState(false); // Loading state to manage loader display

  const handleApplyChanges = () => {
    if (formData.numIterations > 5000) {
      alert("The number of iterations cannot exceed 5000.");
      return;
    }
    setLoading(true); // Activate the loader
    setTimeout(() => {
      // Execute the algorithm and update state
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
      setLoading(false); // Deactivate the loader
      const tourLength = calculateTotalDistance(bestTour);
      if (tourLength < bestLength) {
        setBestLength(tourLength);
      }
    }, 0); // setTimeout to ensure UI updates to show the loader
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DataForm
              formData={formData}
              setFormData={setFormData}
              initialCities={initialCities}
              disabled={loading}
              sx={{ maxWidth: 400 }} // Smaller form size
            />
            <Button
              variant="contained"
              onClick={handleApplyChanges}
              disabled={loading}
              sx={{
                mt: 2, // Adds margin top for spacing
                bgcolor: loading ? "grey.400" : "primary.main", // Conditionally set color
                color: loading ? "grey.600" : "common.white", // Adjust text color for better visibility
                ":hover": {
                  bgcolor: loading ? "grey.400" : "primary.dark", // Maintain grey color on hover when loading
                  color: loading ? "grey.600" : "common.white",
                },
              }}
            >
              Zastosuj zmiany
            </Button>
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
            }}
          >
            {loading ? (
              <Typography variant="h6" sx={{ mb: 2 }}>
                Przeliczanie...
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ mb: 2 }}>
                Długość trasy: {calculateTotalDistance(bestTour).toFixed(2)}{" "}
                jednostki
              </Typography>
            )}
            {loading ? (
              <div className="loader"></div>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  border: 1,
                  borderColor: "grey.300",
                  p: 1,
                }}
              >
                <CanvasMap
                  cities={cities}
                  bestRoute={bestTour.map((city) => cities.indexOf(city))}
                />
                {loading ? (
                  <div className="loader"></div>
                ) : bestTour.length > 0 ? (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Najlepszy wynik: {bestLength.toFixed(2)} jednostek
                    </Typography>
                  </>
                ) : (
                  ""
                )}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Najlepsza trasa:
            </Typography>
            {bestTour.map((city, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <CardContent>
                  <Typography variant="body1">
                    {index + 1}. {city.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
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
