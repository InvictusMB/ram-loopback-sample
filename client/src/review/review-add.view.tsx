import {format, subYears} from 'date-fns';
import React, {useState} from 'react';
import sanitize from 'sanitize-html';

import {RestaurantWithRelations} from '../openapi/models';
import {extractMessages} from '../utils';

export function ReviewAddView(props: ReviewAddViewProps) {
  const {Shell, restaurant, userProfileStore, restaurantStore} = props;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [date, setDate] = useState(toDisplay(new Date()));

  const {userProfile} = userProfileStore;
  if (!userProfile || restaurant.ownerId === userProfile.id) {
    return null;
  }

  if (restaurantStore.createReview.pending) {
    return (
      <Shell.Spinner />
    );
  }

  const errors = extractMessages(
    restaurantStore.createReview.error,
    'Something went wrong...',
  );

  async function createReview() {
    await restaurantStore.createReview(userProfile, restaurant, {
      rating,
      comment: sanitize(comment),
      date: new Date(date),
      authorId: userProfile?.id,
    }).catch();
    setComment('');
    setRating(0);
    setDate(toDisplay(new Date()));
  }

  return (
    <div className="mb-4">
      <div className="w-full font-bold p-2 bg-teal-200">Write a review</div>
      <div className="w-full h-10 bg-gray-100 flex pt-2 pl-8 flex justify-left">
        <div className="-mt-1 flex-shrink-0"><Shell.Avatar id={userProfile.id} /></div>
        <div className="text-center text-gray-500 font-bold ml-2">{userProfile.name}</div>
        <div className="w-full" />

        <div className="flex justify-center mr-4">
          <Shell.RatingEdit {...{
            value: rating,
            onChange: setRating,
          }} />
        </div>

        <div className="flex justify-center flex-shrink-0 mr-4">
          Date of visit:
          <div className="ml-2 font-bold">
            <input
              type="date"
              value={date}
              max={toDisplay(new Date())}
              min={toDisplay(subYears(new Date(), 1))}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-200 pl-4 flex">
        <Shell.CommentEdit className="w-full" {...{
          value: comment,
          placeholder: 'Review comment',
          onChange: setComment,
        }} />
        <Shell.ButtonPrimary className="rounded-lg self-start py-2" onClick={createReview}>
          Send
        </Shell.ButtonPrimary>
      </div>
      <div className="">
        {errors.map((e, i) => (
          <p className="text-red-500 text-xs italic px-3 py-2 bg-gray-200" key={i}>{e}</p>
        ))}
      </div>
    </div>
  );
}

function toDisplay(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

const dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.restaurantStore,
] as const;
Object.assign(ReviewAddView, {[Symbol.for('ram.deps')]: dependencies});

type ReviewAddViewProps = PickInjected<typeof dependencies> & {
  restaurant: RestaurantWithRelations
};

