import React, { useRef, useEffect } from "react";

const CanvasMap = ({ cities, bestRoute, shouldAnimate, setShouldAnimate }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const minLng = 14.0;
    const maxLng = 24.0;
    const minLat = 49.0;
    const maxLat = 55.0;

    const scaleX = (lng) => ((lng - minLng) / (maxLng - minLng)) * width;
    const scaleY = (lat) => ((maxLat - lat) / (maxLat - minLat)) * height;

    ctx.clearRect(0, 0, width, height);

    // Rysowanie miast
    cities.forEach((city) => {
      const x = scaleX(city.y);
      const y = scaleY(city.x);
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.fillText(city.name, x + 5, y - 5);
    });

    if (bestRoute.length > 1) {
      let currentStep = 0;
      const totalSteps = 100;
      const duration = 5000;
      const stepDuration = duration / totalSteps;
      let startTime;

      const drawSegment = (x1, y1, x2, y2, progress) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cx = x1 + dx * progress;
        const cy = y1 + dy * progress;
        return { cx, cy };
      };

      const animateLine = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / stepDuration, 1);

        const cityA = cities[bestRoute[currentStep]];
        const cityB = cities[bestRoute[(currentStep + 1) % bestRoute.length]];

        const x1 = scaleX(cityA.y);
        const y1 = scaleY(cityA.x);
        const x2 = scaleX(cityB.y);
        const y2 = scaleY(cityB.x);

        const { cx, cy } = drawSegment(x1, y1, x2, y2, progress);

        // Rysujemy aktualnie animowany segment
        ctx.strokeStyle = `hsl(${
          (currentStep / bestRoute.length) * 360
        }, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.fillText(currentStep + 1, x1 - 10, y1 - 10);

        if (progress < 1) {
          requestAnimationFrame(animateLine);
        } else {
          // Rysujemy całą linię po zakończeniu animacji segmentu
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          ctx.fillText(currentStep + 2, x2 - 10, y2 - 10);

          currentStep++;
          if (currentStep < bestRoute.length - 1) {
            startTime = timestamp;
            requestAnimationFrame(animateLine);
          } else {
            // Połącz ostatnie miasto z pierwszym
            const lastCity = cities[bestRoute[bestRoute.length - 1]];
            const firstCity = cities[bestRoute[0]];
            ctx.strokeStyle = "orange";
            ctx.beginPath();
            ctx.moveTo(scaleX(lastCity.y), scaleY(lastCity.x));
            ctx.lineTo(scaleX(firstCity.y), scaleY(firstCity.x));
            ctx.stroke();
            setShouldAnimate(false); // Zresetowanie flagi animacji po zakończeniu
          }
        }
      };

      requestAnimationFrame(animateLine);
    }
  }, [shouldAnimate, cities, bestRoute]);

  return (
    <canvas
      ref={canvasRef}
      width="600"
      height="500"
      style={{ border: "1px solid black" }}
    />
  );
};

export default CanvasMap;
