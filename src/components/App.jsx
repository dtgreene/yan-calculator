import React, { useState, useEffect } from 'react';
import cx from 'classnames';

import { CalculatorForm } from './CalculatorForm';
import { calculateYAN } from '../utils/calculate';
import styles from './styles.module.css';

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
          <div className="mb-8">
            <div className={styles.sectionLabel}>Results</div>
            {results ? (
              <div className="flex flex-col gap-4">
                
              </div>
            ) : (
              <div>Nothing to see here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
