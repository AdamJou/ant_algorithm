import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const DataForm = ({ formData, setFormData, initialCities, disabled }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCityChange = (event) => {
    setFormData({ ...formData, startIndex: event.target.value });
  };

  return (
    <FormControl fullWidth disabled={disabled} margin="normal">
      <TextField
        label="Ant count"
        type="number"
        name="numAnts"
        value={formData.numAnts}
        onChange={handleChange}
        disabled={disabled}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Iteration count"
        type="number"
        name="numIterations"
        value={formData.numIterations}
        onChange={handleChange}
        disabled={disabled}
        margin="normal"
        fullWidth
        inputProps={{ max: 5000 }} // Limit the number of iterations to 5000
      />
      <TextField
        label="Evaporation rate"
        type="number"
        name="evaporationRate"
        value={formData.evaporationRate}
        onChange={handleChange}
        disabled={disabled}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Alpha"
        type="number"
        name="alpha"
        value={formData.alpha}
        onChange={handleChange}
        disabled={disabled}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Beta"
        type="number"
        name="beta"
        value={formData.beta}
        onChange={handleChange}
        disabled={disabled}
        margin="normal"
        fullWidth
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="start-city-label">Starting city</InputLabel>
        <Select
          labelId="start-city-label"
          id="start-city-select"
          value={formData.startIndex}
          label="Starting city"
          onChange={handleCityChange}
          disabled={disabled}
        >
          {initialCities.map((city, index) => (
            <MenuItem key={index} value={index}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FormControl>
  );
};

export default DataForm;
