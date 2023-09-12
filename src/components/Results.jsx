import React, { Fragment } from 'react';

import { InfoTooltip } from './InfoTooltip';
import styles from './styles.module.css';

const NutrientTable = ({ label, nutrient, initialTooltipContent }) => (
  <div className="mb-8">
    <div className={styles.sectionLabel}>{label}</div>
    <div className={styles.table}>
      <div className={styles.tableRow}>
        <div className={styles.tableCol}>
          <span>Grams Per Liter</span>
          <InfoTooltip useMaxWidth={false} className="font-mono">
            {initialTooltipContent ? (
              initialTooltipContent
            ) : (
              <div>
                const gramsPerLiter = Math.min(targetYAN / ppmPerGram,
                maxGramsPerLiter);
              </div>
            )}
          </InfoTooltip>
        </div>
        <div className={styles.tableCol}>
          <span>{nutrient.gramsPerLiter.toFixed(3)}</span>
          <span className="text-gray-600">g/L</span>
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCol}>
          <span>Total Grams</span>
          <InfoTooltip useMaxWidth={false} className="font-mono">
            const totalGrams = gramsPerLiter * liters;
          </InfoTooltip>
        </div>
        <div className={styles.tableCol}>
          <span>{nutrient.totalGrams.toFixed(3)}</span>
          <span className="text-gray-600">g</span>
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCol}>
          <span>Total Teaspoons</span>
          <InfoTooltip useMaxWidth={false} className="font-mono">
            const totalTsps = totalGrams / tspConversion;
          </InfoTooltip>
        </div>
        <div className={styles.tableCol}>
          <span>{nutrient.totalTsps.toFixed(3)}</span>
          <span className="text-gray-600">~ tsp</span>
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCol}>
          <span>Total Nitrogen</span>
          <InfoTooltip useMaxWidth={false} className="font-mono">
            const totalNitrogen = gramsPerLiter * ppmPerGram;
          </InfoTooltip>
        </div>
        <div className={styles.tableCol}>
          <span>{Math.round(nutrient.totalNitrogen)}</span>
          <span className="text-gray-600">PPM</span>
        </div>
      </div>
    </div>
  </div>
);

export const Results = ({ results }) => {
  if (!results) return <div>Click calculate to view results</div>;

  const { downloadName, downloadURL } = getDownloadInfo(results);

  return (
    <Fragment>
      <div className="mb-8">
        <div className={styles.sectionLabel}>Results</div>
        <div className={styles.table}>
          <div className={styles.tableRow}>
            <div className={styles.tableCol}>
              <span>Brix</span>
              <InfoTooltip useMaxWidth={false} className="font-mono">
                <div>const a = 182.9622 * specificGravity ** 3;</div>
                <div>const b = 777.3009 * specificGravity ** 2;</div>
                <div>const c = 1264.517 * specificGravity - 670.1831;</div>
                <div>const brix = a - b + c;</div>
              </InfoTooltip>
            </div>
            <div className={styles.tableCol}>{results.brix.toFixed(1)}</div>
          </div>
          <div className={styles.tableRow}>
            <div className={styles.tableCol}>
              <span>Sugar</span>
              <InfoTooltip useMaxWidth={false} className="font-mono">
                const sugarGramsPerLiter = specificGravity * brix * 10;
              </InfoTooltip>
            </div>
            <div className={styles.tableCol}>
              <span>{Math.round(results.sugarGramsPerLiter)}</span>
              <span className="text-gray-600">g/L</span>
            </div>
          </div>
          <div className={styles.tableRow}>
            <div className={styles.tableCol}>
              <span>Target YAN</span>
              <InfoTooltip useMaxWidth={false} className="font-mono">
                const targetYAN = sugarGramsPerLiter * nutritionMultiplier -
                offsetPPM;
              </InfoTooltip>
            </div>
            <div className={styles.tableCol}>
              <span>{Math.round(results.targetYAN)}</span>
              <span className="text-gray-600">mgN/L</span>
            </div>
          </div>
          <div className={styles.tableRow}>
            <div className={styles.tableCol}>
              <span>Volume</span>
              <InfoTooltip useMaxWidth={false} className="font-mono">
                const liters = isUnitGallon ? volume * US_GALLONS_TO_LITERS :
                volume;
              </InfoTooltip>
            </div>
            <div className={styles.tableCol}>
              <span>{results.liters.toFixed(3)}</span>
              <span className="text-gray-600">L</span>
            </div>
          </div>
        </div>
      </div>
      <NutrientTable
        label="Fermaid O"
        nutrient={results.fermaidO}
        initialTooltipContent={
          <>
            <div>
              const maxOverride = fermaidOOnly ? Infinity :
              fermaidOMaxGramsPerLiter;
            </div>
            <div>
              const gramsPerLiter = Math.min(targetYAN / ppmPerGram,
              maxOverride);
            </div>
          </>
        }
      />
      {!results.fermaidOOnly && (
        <Fragment>
          <NutrientTable
            label="Fermaid K"
            nutrient={results.fermaidK}
            initialTooltipContent={
              <>
                <div>
                  const yanOverride = targetYAN - fermaidO.totalNitrogen;
                </div>
                <div>
                  const gramsPerLiter = Math.min(yanOverride / ppmPerGram,
                  maxGramsPerLiter);
                </div>
              </>
            }
          />
          <NutrientTable
            label="DAP"
            nutrient={results.dap}
            initialTooltipContent={
              <>
                <div>
                  const yanOverride = targetYAN - fermaidO.totalNitrogen -
                  fermaidK.totalNitrogen;
                </div>
                <div>
                  const gramsPerLiter = Math.min(yanOverride / ppmPerGram,
                  maxGramsPerLiter);
                </div>
              </>
            }
          />
        </Fragment>
      )}
      <div>
        <a download={downloadName} href={downloadURL} className={styles.link}>
          Download Results
        </a>
      </div>
    </Fragment>
  );
};

function getDownloadInfo(results) {
  if (!results) return { downloadName: '', downloadURL: '' };

  const {
    input,
    brix,
    sugarGramsPerLiter,
    targetYAN,
    liters,
    fermaidOOnly,
    fermaidO,
    fermaidK,
    dap,
  } = results;

  const {
    specificGravity,
    nutritionRequirement,
    offsetPPM,
    fermaidOMultiplier,
  } = input;

  const inputSection = [
    '## Input',
    `Specific Gravity = ${specificGravity}`,
    `Offset PPM = ${offsetPPM}`,
    `Nutrition Requirement = ${nutritionRequirement}`,
    `Fermaid O Multiplier = ${fermaidOMultiplier}`,
    '',
  ];

  const resultsSection = [
    '## Results',
    `Brix = ${brix.toFixed(1)}`,
    `Sugar = ${Math.round(sugarGramsPerLiter)} g/L`,
    `Target YAN = ${Math.round(targetYAN)} mgN/L`,
    `Volume = ${liters.toFixed(3)} L`,
    '',
  ];

  const nutritionSection = [
    '## Nutrient Additions',
    getNutritionInfo('Fermaid O', fermaidO),
  ];

  if (!fermaidOOnly) {
    nutritionSection.push(
      getNutritionInfo('Fermaid K', fermaidK),
      getNutritionInfo('DAP', dap)
    );
  }

  const text = [inputSection, resultsSection, nutritionSection]
    .flat(2)
    .join('\n');

  // Create a blog object with the file content which you want to add to the file
  const file = new Blob([text], { type: 'text/plain' });

  // Add file name
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();

  return {
    downloadName: `yan-${year}-${month}-${day}.txt`,
    downloadURL: URL.createObjectURL(file),
  };
}

function getNutritionInfo(title, nutrient) {
  return [
    `- ${title}`,
    `  - Total Grams = ${nutrient.totalGrams.toFixed(3)} g`,
    `  - Total Teaspoons = ${nutrient.totalTsps.toFixed(3)} ~ tsp`,
    '',
  ];
}
