import React from 'react';
import {ReactComponent as StarSvg} from './star.svg';

export function StarIcon({className = ''}) {
  return (
    <div className={`inline-block h-4 w-4 mt-1 ${className}`}>
      <StarSvg stroke="currentColor" />
    </div>
  );
}

Object.assign(StarIcon, {[Symbol.for('ram.deps')]: []});
