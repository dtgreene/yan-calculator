import React, { Fragment } from 'react';
import cx from 'classnames';
import { Field, Form, Formik, useField } from 'formik';

import { InfoTooltip } from './InfoTooltip';
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

const NumberField = ({ label, name, tooltipContent, ...other }) => (
  <div className="flex flex-col gap-2 flex-1">
    <div className="flex gap-1 items-center">
      <Label>{label}</Label>
      {tooltipContent && <InfoTooltip>{tooltipContent}</InfoTooltip>}
    </div>
    <Field type="number" className={styles.inputField} name={name} {...other} />
  </div>
);

const Select = ({ label, name, options, tooltipContent }) => {
  const field = useField(name);

  const handleChange = (event) => {
    field[2].setValue(event.target.value);
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex gap-1 items-center">
        <Label>{label}</Label>
        {tooltipContent && <InfoTooltip>{tooltipContent}</InfoTooltip>}
      </div>
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
              <NumberField
                label="Offset PPM"
                name="offsetPPM"
                tooltipContent="This will be subtracted from the target YAN."
              />
            </div>
            <div className="flex gap-4">
              <Select
                label="Yeast Nutrition Requirement"
                name="nutritionRequirement"
                options={nutritionValues}
                tooltipContent={
                  <>
                    <div className="mb-2">
                      The Nutrition multiplier when calculating the target YAN.
                      The following values are used:
                    </div>
                    <div className="border">
                      <div className="flex border-b">
                        <div className="flex-1 p-1">Very Low</div>
                        <div className="flex-1 p-1 border-l">0.50</div>
                      </div>
                      <div className="flex border-b">
                        <div className="flex-1 p-1">Low</div>
                        <div className="flex-1 p-1 border-l">0.75</div>
                      </div>
                      <div className="flex border-b">
                        <div className="flex-1 p-1">Medium</div>
                        <div className="flex-1 p-1 border-l">0.90</div>
                      </div>
                      <div className="flex">
                        <div className="flex-1 p-1">High</div>
                        <div className="flex-1 p-1 border-l">1.25</div>
                      </div>
                    </div>
                  </>
                }
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
                tooltipContent={
                  <>
                    <div className="mb-2">
                      This is a multiplier value that applies to Fermaid O only.
                    </div>
                    <div className="mb-2">
                      According to ScottLabs, Fermaid O functions as though it
                      contained 3x-4x the same amount of inorganic nitrogen,
                      especially when the yeast is rehydrated with Go-Ferm.
                    </div>
                    <div>
                      <a
                        className="underline cursor-pointer hover:text-gray-400 transition-colors"
                        target="_blank"
                        href="https://scottlabsltd.com/content/files/Documents/SLL/Fermentation%20Protocols/FermentationManagement.pdf"
                      >
                        Click here to read more
                      </a>
                    </div>
                  </>
                }
              />
            </div>
            <Radio label="Fermaid O Only" name="fermaidOOnly" />
            <Radio label="Advanced Options" name="showAdvanced" />
          </div>
        </div>
        {values.showAdvanced && (
          <Fragment>
            <div className="mb-8">
              <div className={styles.sectionLabel}>Fermaid O</div>
              <div className="flex gap-4">
                {!values.fermaidOOnly && (
                  <NumberField
                    label="Max g/L"
                    name="fermaidOMaxGramsPerLiter"
                    tooltipContent="Lallemand claims a risk of adding yeasty flavors to wine at above .45 g/L. There's some lee-way here, however."
                  />
                )}
                <NumberField
                  label="mgN/L per gram"
                  name="fermaidOPPMPerGram"
                  tooltipContent="Default: 40"
                />
              </div>
            </div>
            {!values.fermaidOOnly && (
              <Fragment>
                <div className="mb-8">
                  <div className={styles.sectionLabel}>Fermaid K</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <NumberField
                        label="Max g/L"
                        name="fermaidKMaxGramsPerLiter"
                        tooltipContent={
                          <>
                            <div className="mb-4">
                              TTB Limit: .50 g/L
                              <br />
                              US Unit Limit: ~4 lb/1000 gal
                            </div>
                            <div>
                              Elsewhere you may see this limit listed as .25 g/l
                              because Scott Labs published incorrect information
                              (translation error) for years.
                            </div>
                          </>
                        }
                      />
                      <NumberField
                        label="mgN/L per gram"
                        name="fermaidKPPMPerGram"
                        tooltipContent="Default: 100"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <div className={styles.sectionLabel}>DAP</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <NumberField
                        label="Max g/L"
                        name="dapMaxGramsPerLiter"
                        tooltipContent={
                          <>
                            TTB Limit: .96g/L
                            <br />
                            US Unit Limit: ~3.63 g/gal
                          </>
                        }
                      />
                      <NumberField
                        label="mgN/L per gram"
                        name="dapPPMPerGram"
                        tooltipContent="Default: 210"
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
