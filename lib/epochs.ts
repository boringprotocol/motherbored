// Boring Epochs
// Commencing Jan 1 2023 00:00:00
// Defining number of milliseconds in one week
// Defininf starting date for the epochs
// Exporting function to generate the epochs
// Getting starting time in milliseconds since the Unix epoch (January 1, 1970)
// Array to store the epochs
// Looping to run for 260 times (5 years x 52 weeks per year)
// Or, 520 for epochs for 10 years
// Add the interval (ONE_WEEK_IN_MILLISECONDS) to the start time for each iteration
// Return the array of epochs

// lib/epochs.ts

export const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
export const START_DATE = new Date(2023, 0, 1); // January 1, 2023

// Function to generate epoch timestamps
export const getEpochsTime = (): number[] => {
  const startTime = START_DATE.getTime();
  const epochs: number[] = [];
  for (let i = 0; i < 520; i++) {
    epochs.push(startTime + i * ONE_WEEK_IN_MILLISECONDS);
  }
  return epochs;
};

// Function to generate epoch data with sum
export const getEpochsData = (): { name: string; sum: number }[] => {
  const epochsTime = getEpochsTime();
  const epochsData = epochsTime.map((epoch, index) => ({
    name: `epoch-${index + 1}`,
    sum: 126000000,
  }));
  return epochsData;
};
