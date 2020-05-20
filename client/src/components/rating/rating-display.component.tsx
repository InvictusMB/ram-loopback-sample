import _ from 'lodash';
import React from 'react';

const MAX_RATING = 5;

export function RatingDisplay({Shell, rating}: RatingDisplayProps) {
  const yellow = _.range(0, rating).map(i => (
    <Shell.StarIcon key={i} className="text-yellow-500" />
  ));
  const grey = _.range(rating, MAX_RATING).map(i => (
    <Shell.StarIcon key={i} className="text-gray-400" />
  ));
  return (
    <>
      {yellow}
      {grey}
    </>
  );
}

const dependencies = [
  Injected.Shell,
] as const;
Object.assign(RatingDisplay, {[Symbol.for('ram.deps')]: dependencies});

type RatingDisplayProps = PickInjected<typeof dependencies> & {
  rating: number,
};
