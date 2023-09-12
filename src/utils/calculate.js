const US_GALLONS_TO_LITERS = 3.78541;
const NUTRITION_MULTIPLIERS = {
  'Very Low': 0.5,
  Low: 0.75,
  Medium: 0.9,
  High: 1.25,
};
const NUTRITION_GRAMS_TO_TSPS = {
  fermaidO: 2.48,
  fermaidK: 3.63,
  dap: 3.9,
};

export function calculateYAN({
  specificGravity,
  nutritionRequirement,
  offsetPPM,
  volume,
  volumeUnit,
  fermaidOOnly,
  fermaidOMultiplier,
  fermaidOMaxGramsPerLiter,
  fermaidOPPMPerGram,
  fermaidKMaxGramsPerLiter,
  fermaidKPPMPerGram,
  dapMaxGramsPerLiter,
  dapPPMPerGram,
}) {
  const brix = getBrix(specificGravity);
  const sugarGramsPerLiter = specificGravity * brix * 10;
  const nutritionMultiplier = NUTRITION_MULTIPLIERS[nutritionRequirement];
  const targetYAN = sugarGramsPerLiter * nutritionMultiplier - offsetPPM;

  const isUnitGallon = volumeUnit.toUpperCase().includes('GALLON');
  const liters = isUnitGallon ? volume * US_GALLONS_TO_LITERS : volume;

  // Fermaid O
  const fermaidO = getNutrientAdditions(
    targetYAN,
    liters,
    NUTRITION_GRAMS_TO_TSPS.fermaidO,
    fermaidOPPMPerGram * fermaidOMultiplier,
    fermaidOOnly ? Infinity : fermaidOMaxGramsPerLiter
  );
  const fermaidK = getNutrientAdditions(
    targetYAN - fermaidO.totalNitrogen,
    liters,
    NUTRITION_GRAMS_TO_TSPS.fermaidK,
    fermaidKPPMPerGram,
    fermaidKMaxGramsPerLiter
  );
  const dap = getNutrientAdditions(
    targetYAN - fermaidO.totalNitrogen - fermaidK.totalNitrogen,
    liters,
    NUTRITION_GRAMS_TO_TSPS.dap,
    dapPPMPerGram,
    dapMaxGramsPerLiter
  );

  const totalNitrogen =
    fermaidO.totalNitrogen + fermaidK.totalNitrogen + dap.totalNitrogen;
  const remainderNitrogen = targetYAN - totalNitrogen;

  return {
    input: {
      specificGravity,
      nutritionRequirement,
      offsetPPM,
      volume,
      volumeUnit,
      fermaidOOnly,
      fermaidOMultiplier,
      fermaidOMaxGramsPerLiter,
      fermaidOPPMPerGram,
      fermaidKMaxGramsPerLiter,
      fermaidKPPMPerGram,
      dapMaxGramsPerLiter,
      dapPPMPerGram,
    },
    brix,
    sugarGramsPerLiter,
    targetYAN,
    liters,
    fermaidOOnly,
    fermaidO,
    fermaidK,
    dap,
    totalNitrogen,
    remainderNitrogen,
  };
}

function getNutrientAdditions(
  targetYAN,
  liters,
  tspConversion,
  ppmPerGram,
  maxGramsPerLiter
) {
  const gramsPerLiter = Math.min(targetYAN / ppmPerGram, maxGramsPerLiter);
  const totalGrams = gramsPerLiter * liters;
  const totalTsps = totalGrams / tspConversion;
  const totalNitrogen = gramsPerLiter * ppmPerGram;

  return {
    gramsPerLiter,
    totalGrams,
    totalTsps,
    totalNitrogen,
  };
}

/**
 * Via MeadMakr.com's Allen Jones:
 * - (182.9622 * SG^3) - (777.3009 * SG^2) + (1264.5170 * SG) - 670.1831
 * @param {number} gravity
 * @returns The Brix value for this gravity
 */
function getBrix(gravity) {
  return (
    182.9622 * gravity ** 3 -
    777.3009 * gravity ** 2 +
    1264.517 * gravity -
    670.1831
  );
}
