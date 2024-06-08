// Plik: AntColonyOptimization.js

// Funkcja obliczająca odległość między dwoma miastami na podstawie współrzędnych
export function distance(city1, city2) {
  const dx = city1.x - city2.x;
  const dy = city1.y - city2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Implementacja algorytmu mrówkowego
export function antColonyOptimization(
  cities,
  numAnts,
  numIterations,
  evaporationRate,
  alpha,
  beta,
  startIndex
) {
  // Inicjalizacja feromonów
  let pheromones = Array(cities.length)
    .fill()
    .map(() => Array(cities.length).fill(1));

  // Inicjalizacja najlepszej trasy i jej długości
  let bestTour = [];
  let bestTourLength = Infinity;

  // Główna pętla algorytmu
  for (let iteration = 0; iteration < numIterations; iteration++) {
    const ants = Array(numAnts)
      .fill()
      .map(() => {
        return {
          tour: [startIndex],
          visited: new Set([startIndex]),
          tourLength: 0,
        };
      });

    // Iteracja przez wszystkie miasta
    for (const ant of ants) {
      while (ant.tour.length < cities.length) {
        const currentCity = ant.tour[ant.tour.length - 1];
        const unvisitedCitiesIndices = cities
          .map((_, index) => index)
          .filter((index) => !ant.visited.has(index));

        const probabilities = unvisitedCitiesIndices.map((index) => {
          const pheromone = pheromones[currentCity][index];
          const dist = distance(cities[currentCity], cities[index]);
          return Math.pow(pheromone, alpha) * Math.pow(1 / dist, beta);
        });

        const sumProbabilities = probabilities.reduce(
          (acc, val) => acc + val,
          0
        );
        const normalizedProbabilities = probabilities.map(
          (val) => val / sumProbabilities
        );

        const random = Math.random();
        let cumulativeProbability = 0;
        let selectedCityIndex = -1;

        for (let i = 0; i < normalizedProbabilities.length; i++) {
          cumulativeProbability += normalizedProbabilities[i];
          if (random < cumulativeProbability) {
            selectedCityIndex = unvisitedCitiesIndices[i];
            break;
          }
        }

        if (selectedCityIndex === -1) {
          selectedCityIndex =
            unvisitedCitiesIndices[unvisitedCitiesIndices.length - 1];
        }

        ant.tour.push(selectedCityIndex);
        ant.visited.add(selectedCityIndex);
        ant.tourLength += distance(
          cities[currentCity],
          cities[selectedCityIndex]
        );
      }

      // Dodajemy odległość między ostatnim a pierwszym miastem (zamykamy pętlę)
      ant.tourLength += distance(
        cities[ant.tour[ant.tour.length - 1]],
        cities[startIndex]
      );

      // Aktualizacja najlepszej trasy
      if (ant.tourLength < bestTourLength) {
        bestTour = ant.tour.slice();
        bestTourLength = ant.tourLength;
      }
    }

    // Aktualizacja feromonów
    for (let i = 0; i < cities.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        pheromones[i][j] *= 1 - evaporationRate;
      }
    }

    for (let j = 1; j < bestTour.length; j++) {
      pheromones[bestTour[j - 1]][bestTour[j]] += 1 / bestTourLength;
      pheromones[bestTour[j]][bestTour[j - 1]] += 1 / bestTourLength;
    }
  }

  return bestTour.map((index) => cities[index]);
}
