import React, { Fragment, useState } from 'react';
import cx from 'classnames';

import { CalculatorForm } from './CalculatorForm';
import { calculateYAN } from '../utils/calculate';
import styles from './styles.module.css';
import { Results } from './Results';

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
        <div className={styles.calculatorColumn}>
          <CalculatorForm onSubmit={handleSubmit} />
        </div>
        <div className={styles.calculatorColumn}>
          <Results results={results} />
        </div>
      </div>
    </div>
  );
};
