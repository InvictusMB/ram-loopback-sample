import React from 'react';
import _ from 'lodash';

const MAX_RATING = 5;

export function RatingEdit({Shell, value, onChange}: RatingEditProps) {
  const blank = _.range(0, MAX_RATING).map(i => (
    <Shell.StarIcon key={i} />
  ));
  const rows = _.range(MAX_RATING, 0, -1).map(i => (
    <div key={i} className="flex text-transparent hover:text-blue-500 absolute top-0">
      <button onClick={() => onChange(i)}>
        {_.range(0, i).map(j => <Shell.StarIcon key={j} />)}
      </button>
    </div>
  ));
  const yellow = _.range(0, value).map(i => (
    <Shell.StarIcon key={i} />
  ));
  return (
    <div className="relative">
      <div className="flex">
        {blank}
      </div>
      <div className="flex absolute top-0 text-yellow-500">
        {yellow}
      </div>
      {rows}
    </div>
  );
}

const dependencies = [
  Injected.Shell,
] as const;
Object.assign(RatingEdit, {[Symbol.for('ram.deps')]: dependencies});

type RatingEditProps = PickInjected<typeof dependencies> & {
  value?: number,
  onChange: (v: number) => void,
};
