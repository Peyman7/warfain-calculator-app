import React, { useState } from 'react';

// Main App component
const App = () => {
  // State variables for INR, current weekly dosage, and calculated new dosage
  const [inr, setInr] = useState('');
  const [currentWeeklyDose, setCurrentWeeklyDose] = useState('');
  const [newWeeklyDose, setNewWeeklyDose] = useState(null);
  const [error, setError] = useState('');

  // Function to handle INR input change
  const handleInrChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid numbers (including decimals)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInr(value);
      setError(''); // Clear error when input changes
      setNewWeeklyDose(null); // Clear previous calculation
    } else {
      setError('Please enter a valid number for INR.');
    }
  };

  // Function to handle current weekly dosage input change
  const handleCurrentWeeklyDoseChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid numbers (including decimals)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCurrentWeeklyDose(value);
      setError(''); // Clear error when input changes
      setNewWeeklyDose(null); // Clear previous calculation
    } else {
      setError('Please enter a valid number for Current Weekly Dose.');
    }
  };

  // Function to calculate the new warfarin dosage
  const calculateDosage = () => {
    const inrValue = parseFloat(inr);
    const currentDoseValue = parseFloat(currentWeeklyDose);

    // Input validation
    if (isNaN(inrValue) || isNaN(currentDoseValue) || inrValue <= 0 || currentDoseValue <= 0) {
      setError('Please enter valid positive numbers for both INR and Current Weekly Dose.');
      setNewWeeklyDose(null);
      return;
    }

    // Target INR range: 2.0 - 3.0 (common therapeutic range)
    const targetMin = 2.0;
    const targetMax = 3.0;
    const targetMid = 2.5; // Mid-point for fine-tuning

    let calculatedDose = currentDoseValue;
    let adjustmentPercentage = 0;

    // Dosage adjustment logic
    if (inrValue < targetMin) {
      // INR is too low, increase dosage
      if (inrValue < 1.5) {
        adjustmentPercentage = 0.20; // Increase by 20% for very low INR
      } else if (inrValue < 2.0) {
        adjustmentPercentage = 0.10; // Increase by 10% for slightly low INR
      }
      calculatedDose = currentDoseValue * (1 + adjustmentPercentage);
    } else if (inrValue > targetMax) {
      // INR is too high, decrease dosage
      if (inrValue > 3.5) {
        adjustmentPercentage = 0.20; // Decrease by 20% for very high INR
      } else if (inrValue > 3.0) {
        adjustmentPercentage = 0.10; // Decrease by 10% for slightly high INR
      }
      calculatedDose = currentDoseValue * (1 - adjustmentPercentage);
    } else {
      // INR is within the target range, maintain dosage
      calculatedDose = currentDoseValue;
    }

    // Round the calculated dose to two decimal places for readability
    setNewWeeklyDose(calculatedDose.toFixed(2));
    setError(''); // Clear any previous errors
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Warfarin Dosage Calculator</h1>

        {/* Disclaimer */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-6" role="alert">
          <p className="font-bold">Important Disclaimer:</p>
          <p className="text-sm">This calculator provides a *simplified* dosage estimate for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult with your healthcare provider for any decisions regarding your medication and treatment plan.</p>
        </div>

        {/* Input for INR */}
        <div className="mb-4">
          <label htmlFor="inr" className="block text-gray-700 text-sm font-semibold mb-2">
            Current INR Result:
          </label>
          <input
            type="number"
            id="inr"
            value={inr}
            onChange={handleInrChange}
            placeholder="e.g., 2.3"
            className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out"
            step="0.1" // Allow decimal input
            min="0" // INR cannot be negative
          />
        </div>

        {/* Input for Current Weekly Dosage */}
        <div className="mb-6">
          <label htmlFor="currentDose" className="block text-gray-700 text-sm font-semibold mb-2">
            Current Weekly Warfarin Dosage (mg):
          </label>
          <input
            type="number"
            id="currentDose"
            value={currentWeeklyDose}
            onChange={handleCurrentWeeklyDoseChange}
            placeholder="e.g., 35"
            className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out"
            step="0.1" // Allow decimal input
            min="0" // Dosage cannot be negative
          />
        </div>

        {/* Error message display */}
        {error && (
          <p className="text-red-500 text-sm italic mb-4">{error}</p>
        )}

        {/* Calculate button */}
        <button
          onClick={calculateDosage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Calculate New Dosage
        </button>

        {/* Display new weekly dosage */}
        {newWeeklyDose !== null && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Suggested New Weekly Dosage:</h2>
            <p className="text-4xl font-extrabold text-blue-900">
              {newWeeklyDose} mg
            </p>
            <p className="text-sm text-gray-600 mt-2">
              (This is a calculated estimate based on a simplified algorithm.)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
