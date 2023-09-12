import React, { useState } from 'react';
import cx from 'classnames';

import { CalculatorForm } from './CalculatorForm';
import { Results } from './Results';
import GitHubIcon from '../icons/GitHub';
import { calculateYAN } from '../utils/calculate';
import styles from './styles.module.css';

export const App = () => {
  const [results, setResults] = useState(null);

  const handleSubmit = (values) => {
    setResults(calculateYAN(values));
  };

  return (
    <div className="p-4 relative">
      <div className="text-center mb-8">
        <div className="text-2xl">YAN Nutritent Calculator 2.1</div>
        <a
          className={cx(styles.link, 'text-sm')}
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/1W8Pp52vFx9g-Uk7aq4WK66Kg_TI5nTrI32sBc5fGaPU/edit#gid=0"
        >
          Original by Reddit user /u/balathustrius
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
      <div className="absolute right-0 top-0 max-md:relative max-md:flex max-md:justify-center p-4">
        <a
          target="_blank"
          href="https://github.com/dtgreene/yan-calculator"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <GitHubIcon className="w-8 h-8" />
        </a>
      </div>
    </div>
  );
};
