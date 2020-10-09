import {hooks} from '@ram-stack/core';
import sanitize from 'sanitize-html';

import {RestaurantWithRelations, ReviewWithRelations} from '../openapi/models';
import {extractMessages} from '../utils';

export function ReviewResponseAddView(props: ReviewResponseAddViewProps) {
  const {Shell, restaurant, review, userProfileStore, restaurantStore} = props;
  const [comment, setComment] = hooks.useState('');

  const {userProfile} = userProfileStore;
  if (!userProfile || (review.reviewResponses?.length || 0) > 0 || restaurant.ownerId !== userProfile.id) {
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
    await restaurantStore.createReviewResponse(review, {
      comment: sanitize(comment),
    }).catch();
    setComment('');
  }

  return (
    <div className="mb-4 mt-2">
      <div className="w-full font-bold p-2 bg-teal-200">Write a response</div>
      <div className="bg-gray-200 pl-4 flex">
        <Shell.CommentEdit className="w-full" {...{
          value: comment,
          placeholder: 'Response comment',
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

ReviewResponseAddView.dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.restaurantStore,
];
type ReviewResponseAddViewProps = {
  restaurant: RestaurantWithRelations,
  review: ReviewWithRelations
} & PickInjected<typeof ReviewResponseAddView.dependencies>;

