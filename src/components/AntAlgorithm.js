// Calculating distance between cities
export function distance(city1, city2) {
  const dx = city1.x - city2.x;
  const dy = city1.y - city2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Algorithm impl
export function antColonyOptimization(
  cities,
  numAnts,
  numIterations,
  evaporationRate,
  alpha,
  beta,
  startIndex
) {
  // Pheromone init
  let pheromones = Array(cities.length)
    .fill()
    .map(() => Array(cities.length).fill(1));

  // Best route init
  let bestTour = [];
  let bestTourLength = Infinity;

  // Algorith main loop
  for (let i = 0; i < numIterations; i++) {
    // Starting form first city
    const ants = Array(numAnts)
      .fill()
      .map(() => {
        return {
          tour: [startIndex],
          visited: new Set([startIndex]),
          tourLength: 0,
        };
      });

    // Iterating over all cities
    for (const ant of ants) {
      while (ant.tour.length < cities.length) {
        const currentCity = ant.tour[ant.tour.length - 1];
        const unvisitedCities = cities.filter(
          (city, index) => !ant.visited.has(index)
        );
        const probabilities = unvisitedCities.map((city, index) => {
          const pheromone = pheromones[currentCity][index];
          const dist = distance(cities[currentCity], city);
          return Math.pow(pheromone, alpha) * Math.pow(1 / dist, beta);
        });
        const sumProbabilities = probabilities.reduce(
          (acc, val) => acc + val,
          0
        );
        const cumulatedProbabilities = probabilities.map(
          (val) => val / sumProbabilities
        );
        const random = Math.random();
        let selectedCityIndex = 0;
        let cumulativeProbability = 0;
        for (let i = 0; i < cumulatedProbabilities.length; i++) {
          cumulativeProbability += cumulatedProbabilities[i];
          if (random < cumulativeProbability) {
            selectedCityIndex = i;
            break;
          }
        }
        const selectedCity = unvisitedCities[selectedCityIndex];
        ant.tour.push(cities.indexOf(selectedCity));
        ant.visited.add(cities.indexOf(selectedCity));
        ant.tourLength += distance(cities[currentCity], selectedCity);
      }
      // Add distance between first and last city
      ant.tourLength += distance(
        cities[ant.tour[ant.tour.length - 1]],
        cities[startIndex]
      );
      // Best route uptade
      if (ant.tourLength < bestTourLength) {
        bestTour = ant.tour;
        bestTourLength = ant.tourLength;
      }
    }

    // Pheromones update
    for (let i = 0; i < cities.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        pheromones[i][j] *= 1 - evaporationRate;
      }
    }
    // Add pheromones to the best route
    for (let j = 1; j < bestTour.length; j++) {
      pheromones[bestTour[j - 1]][bestTour[j]] += 1 / bestTourLength;
      pheromones[bestTour[j]][bestTour[j - 1]] += 1 / bestTourLength;
    }
  }

  return bestTour.map((index) => cities[index]);
}
