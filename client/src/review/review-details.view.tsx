import React from 'react';
import {format} from 'date-fns';
import sanitize from 'sanitize-html';

import {RestaurantWithRelations, ReviewWithRelations} from '../openapi/models';

export function ReviewDetailsView({Shell, review, restaurant, restaurantStore}: ReviewDetailsViewProps) {
  const response = (review.reviewResponses ?? [])[0];

  return (
    <div className="mb-4">
      <div className="w-full h-10 bg-gray-200 flex pt-2 pl-8 flex justify-left">
        <div className="-mt-1 flex-shrink-0"><Shell.Avatar id={review.authorId} /></div>
        <div className="text-center text-gray-500 font-bold ml-2">{review.author?.name}</div>
        <div className="w-full" />
        <div className="flex justify-center mr-4">
          <Shell.RatingDisplay rating={review.rating} />
        </div>
        <div className="flex justify-center flex-shrink-0 mr-4">
          Date of visit:
          <div className="ml-2 font-bold">{format(new Date(review.date), 'yyyy-MM-dd')}</div>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col">
          <div className="px-4 my-2 flex-shrink-0 flex">
            <div className="text-gray-500 font-bold mr-2">{review.author?.name}</div>
            <div>wrote:</div>
          </div>
          <div className="flex">
            <div
              className="self-end whitespace-no-wrap ml-10 px-4 py-2 border-teal-500 rounded-lg bg-gray-200 italic"
              dangerouslySetInnerHTML={{__html: sanitize(review.comment)}}
            />
            <div className="ml-4 mt-2">
              <Shell.DeleteItem {...{
                error: restaurantStore.deleteReview.error,
                executeDelete: async () => {
                  await restaurantStore.deleteReview(review);
                },
              }} />
            </div>
          </div>
        </div>
        <div className="w-full" />
      </div>
      {response && (
        <div className="flex">
          <div className="w-full" />
          <div className="flex flex-col">
            <div className="px-4 my-2 mr-8 flex content-center align-middle justify-start flex-shrink-0">
              <div className="inline-block mr-2 w-8">
                <Shell.Avatar id={restaurant.ownerId} />
              </div>
              <span className="text-gray-500 font-bold mr-2">{restaurant.owner?.name}</span>replied:
            </div>
            <div className="flex">
              <div className="ml-4 mt-2">
                <Shell.DeleteItem {...{
                  error: restaurantStore.deleteReviewResponse.error,
                  executeDelete: async () => {
                    await restaurantStore.deleteReviewResponse(review, response);
                  },
                }} />
              </div>
              <div
                className="self-end mx-4 whitespace-no-wrap px-4 py-2 border-teal-500 rounded-lg bg-green-200 italic"
                dangerouslySetInnerHTML={{__html: sanitize(response.comment)}}
              />
            </div>
          </div>
        </div>
      )}
      <Shell.ReviewResponseAddView {...{
        restaurant,
        review,
      }} />
    </div>
  );
}


const dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
] as const;
Object.assign(ReviewDetailsView, {[Symbol.for('ram.deps')]: dependencies});

type ReviewDetailsViewProps = PickInjected<typeof dependencies> & {
  review: ReviewWithRelations,
  restaurant: RestaurantWithRelations
};
