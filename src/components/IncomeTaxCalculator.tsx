import React, { useReducer } from 'react';
import FormField from './FormField';

type State = {
  assessmentYear: string;
  ageCategory: string;
  grossSalaryIncome: number;
  otherSourcesIncome: number;
  interestIncome: number;
  rentalIncome: number;
  selfOccupiedInterest: number;
  letOutInterest: number;
  basicDeductions80C: number;
  nps80CCD1B: number;
  medicalInsurance80D: number;
  charity80G: number;
  educationalLoan80E: number;
  savingsInterest80TTA_TTB: number;
  basicSalary: number;
  da: number;
  hra: number;
  rentPaid: number;
  isMetroCity: boolean;
};

type Action = { type: 'SET_FIELD', field: keyof State, value: string | number | boolean };

const initialState: State = {
  assessmentYear: '2023 - 2024',
  ageCategory: 'Below 60',
  grossSalaryIncome: 0,
  otherSourcesIncome: 0,
  interestIncome: 0,
  rentalIncome: 0,
  selfOccupiedInterest: 0,
  letOutInterest: 0,
  basicDeductions80C: 0,
  nps80CCD1B: 0,
  medicalInsurance80D: 0,
  charity80G: 0,
  educationalLoan80E: 0,
  savingsInterest80TTA_TTB: 0,
  basicSalary: 0,
  da: 0,
  hra: 0,
  rentPaid: 0,
  isMetroCity: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};

const IncomeTaxCalculator = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (field: keyof State, value: string | number | boolean) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const calculateTax = () => {
    const {
      grossSalaryIncome, otherSourcesIncome, interestIncome, rentalIncome,
      selfOccupiedInterest, letOutInterest, basicDeductions80C, nps80CCD1B,
      medicalInsurance80D, charity80G, educationalLoan80E, savingsInterest80TTA_TTB,
      basicSalary, da, hra, rentPaid, isMetroCity, ageCategory
    } = state;

    const grossTotalIncome = grossSalaryIncome + otherSourcesIncome + interestIncome + rentalIncome;

    const hraExemption = Math.min(
      isMetroCity ? 0.5 * (basicSalary + da) : 0.4 * (basicSalary + da),
      hra,
      rentPaid - 0.1 * (basicSalary + da)
    );

    const deductibles = basicDeductions80C + nps80CCD1B + medicalInsurance80D + 
                        charity80G + educationalLoan80E + savingsInterest80TTA_TTB + 
                        selfOccupiedInterest + letOutInterest;

    const netTaxableIncome = grossTotalIncome - hraExemption - deductibles;

    let tax = 0;
    if (ageCategory === 'Below 60') {
      if (netTaxableIncome > 1000000) {
        tax += (netTaxableIncome - 1000000) * 0.3;
        tax += 500000 * 0.2;
        tax += 250000 * 0.05;
      } else if (netTaxableIncome > 500000) {
        tax += (netTaxableIncome - 500000) * 0.2;
        tax += 250000 * 0.05;
      } else if (netTaxableIncome > 250000) {
        tax += (netTaxableIncome - 250000) * 0.05;
      }
    } else if (ageCategory === '60 to 80 years') {
      if (netTaxableIncome > 1000000) {
        tax += (netTaxableIncome - 1000000) * 0.3;
        tax += 500000 * 0.2;
        tax += 200000 * 0.05;
      } else if (netTaxableIncome > 500000) {
        tax += (netTaxableIncome - 500000) * 0.2;
        tax += 200000 * 0.05;
      } else if (netTaxableIncome > 300000) {
        tax += (netTaxableIncome - 300000) * 0.05;
      }
    } else if (ageCategory === 'Above 80 years') {
      if (netTaxableIncome > 1000000) {
        tax += (netTaxableIncome - 1000000) * 0.3;
        tax += 500000 * 0.2;
      } else if (netTaxableIncome > 500000) {
        tax += (netTaxableIncome - 500000) * 0.2;
      }
    }

    const educationCess = 0.04 * tax;
    let surcharge = 0;
    if (netTaxableIncome > 10000000) {
      surcharge = 0.15 * tax;
    } else if (netTaxableIncome > 5000000) {
      surcharge = 0.10 * tax;
    }

    const totalTax = tax + educationCess + surcharge;

    alert(`Your calculated tax is: ₹${totalTax.toFixed(2)}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Income Tax Calculator</h2>
        <div className="space-y-6">
          <FormField
            label="Assessment year"
            value={state.assessmentYear}
            onChange={(e) => handleChange('assessmentYear', e.target.value)}
            type="select"
            options={['2023 - 2024']}
          />
          <FormField
            label="Age category"
            value={state.ageCategory}
            onChange={(e) => handleChange('ageCategory', e.target.value)}
            type="select"
            options={['Below 60', '60 to 80 years', 'Above 80 years']}
          />
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-t pt-4">Income</h3>
            <FormField label="Gross salary income" value={state.grossSalaryIncome} onChange={(e) => handleChange('grossSalaryIncome', Number(e.target.value))} />
            <FormField label="Annual income from other sources" value={state.otherSourcesIncome} onChange={(e) => handleChange('otherSourcesIncome', Number(e.target.value))} />
            <FormField label="Annual income from interest" value={state.interestIncome} onChange={(e) => handleChange('interestIncome', Number(e.target.value))} />
            <FormField label="Annual income from let-out house property (rental income)" value={state.rentalIncome} onChange={(e) => handleChange('rentalIncome', Number(e.target.value))} />
            <FormField label="Annual interest paid on home loan (self-occupied)" value={state.selfOccupiedInterest} onChange={(e) => handleChange('selfOccupiedInterest', Number(e.target.value))} />
            <FormField label="Annual interest paid on home loan (let-out)" value={state.letOutInterest} onChange={(e) => handleChange('letOutInterest', Number(e.target.value))} />
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-t pt-4">Deductions</h3>
            <FormField label="Basic Deductions u/s 80C" value={state.basicDeductions80C} onChange={(e) => handleChange('basicDeductions80C', Number(e.target.value))} />
            <FormField label="Contribution to NPS u/s 80CCD(1B)" value={state.nps80CCD1B} onChange={(e) => handleChange('nps80CCD1B', Number(e.target.value))} />
            <FormField label="Medical Insurance Premium u/s 80D" value={state.medicalInsurance80D} onChange={(e) => handleChange('medicalInsurance80D', Number(e.target.value))} />
            <FormField label="Donation to Charity u/s 80G" value={state.charity80G} onChange={(e) => handleChange('charity80G', Number(e.target.value))} />
            <FormField label="Interest on Educational Loan u/s 80E" value={state.educationalLoan80E} onChange={(e) => handleChange('educationalLoan80E', Number(e.target.value))} />
            <FormField label="Interest on Deposits in Saving Account u/s 80TTA/TTB" value={state.savingsInterest80TTA_TTB} onChange={(e) => handleChange('savingsInterest80TTA_TTB', Number(e.target.value))} />
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-t pt-4">Exemptions</h3>
            <FormField label="Basic Salary Received per Annum" value={state.basicSalary} onChange={(e) => handleChange('basicSalary', Number(e.target.value))} />
            <FormField label="Dearness Allowance (DA) Received per Annum" value={state.da} onChange={(e) => handleChange('da', Number(e.target.value))} />
            <FormField label="HRA Received per Annum" value={state.hra} onChange={(e) => handleChange('hra', Number(e.target.value))} />
            <FormField label="Total Rent Paid per Annum" value={state.rentPaid} onChange={(e) => handleChange('rentPaid', Number(e.target.value))} />
            <div className="flex items-center space-x-3">
              <label className="font-medium">Do you live in a metro city?</label>
              <input
                type="checkbox"
                checked={state.isMetroCity}
                onChange={(e) => handleChange('isMetroCity', e.target.checked)}
                className="h-5 w-5"
              />
            </div>
          </div>
          <button onClick={calculateTax} className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">CALCULATE</button>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculator;
