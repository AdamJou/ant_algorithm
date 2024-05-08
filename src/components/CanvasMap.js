// src/components/CanvasMap.js
import React, { useRef, useEffect } from "react";

const CanvasMap = ({ cities, bestRoute }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Zakresy dla współrzędnych Polski
    const minLng = 14.0; // minimalna długość geograficzna
    const maxLng = 24.0; // maksymalna długość geograficzna
    const minLat = 49.0; // minimalna szerokość geograficzna
    const maxLat = 55.0; // maksymalna szerokość geograficzna

    // Skalowanie współrzędnych do rozmiarów canvas
    const scaleX = (lng) => ((lng - minLng) / (maxLng - minLng)) * width;
    const scaleY = (lat) => ((maxLat - lat) / (maxLat - minLat)) * height;

    // Wyczyść płótno
    ctx.clearRect(0, 0, width, height);

    // Rysowanie miast
    cities.forEach((city, index) => {
      const x = scaleX(city.y);
      const y = scaleY(city.x);
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.fillText(city.name, x + 5, y - 5);
    });

    // Rysowanie tras
    if (bestRoute.length > 1) {
      // Rysuj linię trasy między miastami
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();

      bestRoute.forEach((cityIndex, index) => {
        const city = cities[cityIndex];
        const x = scaleX(city.y);
        const y = scaleY(city.x);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        // Numeracja kolejności
        ctx.fillStyle = "black";
        ctx.fillText(index + 1, x - 10, y - 10);
      });

      // Połącz ostatnie miasto z pierwszym innym kolorem
      const lastCity = cities[bestRoute[bestRoute.length - 1]];
      const firstCity = cities[bestRoute[0]];
      ctx.strokeStyle = "orange";
      ctx.moveTo(scaleX(lastCity.y), scaleY(lastCity.x));
      ctx.lineTo(scaleX(firstCity.y), scaleY(firstCity.x));
      ctx.stroke();

      ctx.closePath();
    }
  }, [cities, bestRoute]);

  return (
    <canvas
      ref={canvasRef}
      width="600"
      height="400"
      style={{ border: "1px solid black" }}
    />
  );
};

export default CanvasMap;
