import React, { Fragment, useEffect, useState } from 'react';
import cx from 'classnames';
import { Field, Form, Formik, useField } from 'formik';

import styles from './styles.module.css';

const defaultFormValues = {
  specificGravity: 1.1,
  nutritionRequirement: 'Low',
  offsetPPM: 0,
  volume: 1,
  volumeUnit: 'Gallons, US',
  fermaidOOnly: true,
  showAdvanced: false,
  fermaidOMultiplier: 4,
  fermaidOMaxGramsPerLiter: 0.45,
  fermaidOPPMPerGram: 40,
  fermaidKMaxGramsPerLiter: 0.5,
  fermaidKPPMPerGram: 100,
  dapMaxGramsPerLiter: 0.96,
  dapPPMPerGram: 210,
};
const nutritionValues = ['Very Low', 'Low', 'Medium', 'High'];
const volumeUnits = ['Gallons, US', 'Liters'];

const Label = ({ children }) => (
  <label className="text-sm font-bold">{children}</label>
);

const Radio = ({ label, name }) => {
  const field = useField(name);

  const handleChange = (event) => {
    field[2].setValue(event.target.checked);
  };

  return (
    <div className="flex justify-between gap-2">
      <label className="text-sm font-bold">{label}</label>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={field[1].value}
          onChange={handleChange}
        />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
};

const NumberField = ({ label, name, ...other }) => (
  <div className="flex flex-col gap-2 flex-1">
    <Label>{label}</Label>
    <Field type="number" className={styles.inputField} name={name} {...other} />
  </div>
);

const Select = ({ label, name, options }) => {
  const field = useField(name);

  const handleChange = (event) => {
    field[2].setValue(event.target.value);
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <Label>{label}</Label>
      <select
        className={styles.inputField}
        value={field[1].value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export const CalculatorForm = ({ onSubmit }) => (
  <Formik
    initialValues={defaultFormValues}
    onSubmit={onSubmit}
    enableReinitialize
  >
    {({ values }) => (
      <Form>
        <div className="mb-8">
          <div className={styles.sectionLabel}>Batch Info</div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <NumberField
                label="Specific Gravity"
                step="0.01"
                name="specificGravity"
              />
              <NumberField label="Offset PPM" name="offsetPPM" />
            </div>
            <div className="flex gap-4">
              <Select
                label="Yeast Nutrition Requirement"
                name="nutritionRequirement"
                options={nutritionValues}
              />
            </div>
            <div className="flex gap-4">
              <NumberField label="Volume" name="volume" />
              <Select label="Unit" name="volumeUnit" options={volumeUnits} />
            </div>
            <div className="flex gap-4">
              <NumberField
                label="Fermaid O Multiplier"
                name="fermaidOMultiplier"
              />
            </div>
            <Radio label="Fermaid O Only" name="fermaidOOnly" />
            <Radio label="Advanced Options" name="showAdvanced" />
          </div>
        </div>
        {values.showAdvanced && (
          <Fragment>
            <div className="mb-8">
              <div className={styles.sectionLabel}>Fermaid O (4% N)</div>
              <div className="flex gap-4">
                {!values.fermaidOOnly && (
                  <NumberField
                    label="Max g/L"
                    name="fermaidOMaxGramsPerLiter"
                  />
                )}
                <NumberField label="mgN/L per gram" name="fermaidOPPMPerGram" />
              </div>
            </div>
            {!values.fermaidOOnly && (
              <Fragment>
                <div className="mb-8">
                  <div className={styles.sectionLabel}>Fermaid K (10% N)</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <NumberField
                        label="Max g/L"
                        name="fermaidKMaxGramsPerLiter"
                      />
                      <NumberField
                        label="mgN/L per gram"
                        name="fermaidKPPMPerGram"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <div className={styles.sectionLabel}>DAP (21% N)</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <NumberField label="Max g/L" name="dapMaxGramsPerLiter" />
                      <NumberField
                        label="mgN/L per gram"
                        name="dapPPMPerGram"
                      />
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
          </Fragment>
        )}
        <button className={cx(styles.button, 'w-full')} type="submit">
          Calculate
        </button>
      </Form>
    )}
  </Formik>
);
