import _ from 'lodash';

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

RatingDisplay.dependencies = [
  Injected.Shell,
];
type RatingDisplayProps = PickInjected<typeof RatingDisplay.dependencies> & {
  rating: number,
};
