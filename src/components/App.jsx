import React, { Fragment, useState } from 'react';
import cx from 'classnames';

import { CalculatorForm } from './CalculatorForm';
import { calculateYAN } from '../utils/calculate';
import styles from './styles.module.css';

const NutrientTable = ({ label, nutrient }) => (
  <div className="mb-8">
    <div className={styles.sectionLabel}>{label}</div>
    <div className={styles.table}>
      <div className={styles.tableRow}>
        <div className={styles.tableCol}>Total</div>
        <div className={styles.tableCol}>
          <span>{nutrient.totalGrams.toFixed(3)}</span>
          <span>g</span>
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCol}></div>
        <div className={styles.tableCol}>
          <span>{nutrient.gramsPerLiter.toFixed(3)}</span>
          <span>g/L</span>
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCol}></div>
        <div className={styles.tableCol}>
          <span>{nutrient.totalTsps.toFixed(3)} (estimated)</span>
          <span>tsp</span>
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCol}>Total Nitrogen</div>
        <div className={styles.tableCol}>
          <span>{Math.round(nutrient.totalNitrogen)}</span>
          <span>PPM</span>
        </div>
      </div>
    </div>
  </div>
);

export const App = () => {
  const [results, setResults] = useState(null);

  const handleSubmit = (values) => {
    setResults(calculateYAN(values));
  };

  return (
    <div className="p-4">
      <div className="text-center mb-8">
        <div className="text-2xl">YAN Nutritent Calculator 2.1</div>
        <a
          className={cx(styles.link, 'text-sm')}
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/1W8Pp52vFx9g-Uk7aq4WK66Kg_TI5nTrI32sBc5fGaPU/edit#gid=0"
        >
          Original Google sheet
        </a>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <div
          className={cx(styles.calculatorColumn, 'border-t-4 border-t-sky-600')}
        >
          <CalculatorForm onSubmit={handleSubmit} />
        </div>
        <div
          className={cx(styles.calculatorColumn, 'border-t-4 border-t-sky-600')}
        >
          {results ? (
            <Fragment>
              <div className="mb-8">
                <div className={styles.sectionLabel}>Results</div>
                <div className={styles.table}>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCol}>Brix</div>
                    <div className={styles.tableCol}>
                      {results.brix.toFixed(1)}
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCol}>Sugar</div>
                    <div className={styles.tableCol}>
                      <span>{Math.round(results.sugarGramsPerLiter)}</span>
                      <span>g/L</span>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCol}>Target YAN</div>
                    <div className={styles.tableCol}>
                      <span>{Math.round(results.targetYAN)}</span>
                      <span>mgN/L</span>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCol}>Volume</div>
                    <div className={styles.tableCol}>
                      <span>{results.liters.toFixed(3)}</span>
                      <span>L</span>
                    </div>
                  </div>
                </div>
              </div>
              <NutrientTable label="Fermaid O" nutrient={results.fermaidO} />
              {!results.fermaidOOnly && (
                <Fragment>
                  <NutrientTable
                    label="Fermaid K"
                    nutrient={results.fermaidK}
                  />
                  <NutrientTable label="DAP" nutrient={results.dap} />
                </Fragment>
              )}
            </Fragment>
          ) : (
            <div>Results go here</div>
          )}
        </div>
      </div>
    </div>
  );
};
