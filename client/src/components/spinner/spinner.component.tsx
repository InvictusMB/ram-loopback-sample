import React from 'react';
import {ReactComponent as SpinnerIcon} from './spinner.svg';

export function Spinner() {
  return (
    <div className="w-full text-teal-500 text-center">
      <div className="inline-block">
        <SpinnerIcon stroke="currentColor" />
      </div>
    </div>
  );
}

Object.assign(Spinner, {[Symbol.for('ram.deps')]: []});

