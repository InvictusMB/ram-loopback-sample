import React, {useState} from 'react';
import {format} from 'date-fns';
import sanitize from 'sanitize-html';

import {RestaurantWithRelations, ReviewWithRelations, UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function ReviewDetailsView(props: ReviewDetailsViewProps) {
  const {Shell, review, restaurant, restaurantStore, userProfileStore} = props;
  const response = (review.reviewResponses ?? [])[0];

  const [editReview, setEditReview] = useState(false);
  const [reviewComment, setReviewComment] = useState(review.comment);

  const [editResponse, setEditResponse] = useState(false);
  const [reviewResponse, setReviewResponse] = useState(response?.comment);

  const allowedRoles = [
    UserRolesEnum.Admin,
  ];
  const isEditAllowed = isAllowed(allowedRoles, userProfileStore.userProfile);

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
      {editReview && (
        <div className="flex bg-gray-200">
          <Shell.CommentEdit {...{
            className: 'w-full',
            value: reviewComment,
            onChange: setReviewComment,
          }} />
          <Shell.ButtonAccept {...{
            className: 'text-green-500 mx-2',
            onClick: async () => {
              review.comment = reviewComment;
              await restaurantStore.updateReview(review);
              setEditReview(false);
            },
          }} />
          <Shell.ButtonCancel{...{
            className: 'text-teal-500 mr-4',
            onClick: () => {
              setReviewComment(review.comment);
              setEditReview(false);
            },
          }} />
        </div>
      )}
      {!editReview && (
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
              {isEditAllowed && !editReview && (
                <Shell.ButtonEdit {...{
                  className: 'ml-2 text-gray-500 self-start mt-2',
                  onClick: e => {
                    e.preventDefault();
                    setEditReview(true);
                  },
                }} />
              )}
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
      )}
      {response && !editResponse && (
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
              {isEditAllowed && !editReview && (
                <Shell.ButtonEdit {...{
                  className: 'ml-4 mr-4 text-gray-500 self-start mt-2',
                  onClick: e => {
                    e.preventDefault();
                    setEditResponse(true);
                  },
                }} />
              )}
              <div className="mt-2 mr-2">
                <Shell.DeleteItem {...{
                  error: restaurantStore.deleteReviewResponse.error,
                  executeDelete: async () => {
                    await restaurantStore.deleteReviewResponse(review, response);
                  },
                }} />
              </div>
              <div
                className="self-end mr-4 whitespace-no-wrap px-4 py-2 border-teal-500 rounded-lg bg-green-200 italic"
                dangerouslySetInnerHTML={{__html: sanitize(response.comment)}}
              />
            </div>
          </div>
        </div>
      )}
      {editResponse && (
        <div className="flex bg-gray-200 mt-2">
          <Shell.CommentEdit {...{
            className: 'w-full',
            value: reviewResponse,
            onChange: setReviewResponse,
          }} />
          <Shell.ButtonAccept {...{
            className: 'text-green-500 mx-2',
            onClick: async () => {
              response.comment = reviewResponse;
              await restaurantStore.updateReviewResponse(review, response);
              setEditResponse(false);
            },
          }} />
          <Shell.ButtonCancel{...{
            className: 'text-teal-500 mr-4',
            onClick: () => {
              setReviewResponse(response.comment);
              setEditResponse(false);
            },
          }} />
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
  Injected.userProfileStore,
] as const;
Object.assign(ReviewDetailsView, {[Symbol.for('ram.deps')]: dependencies});

type ReviewDetailsViewProps = PickInjected<typeof dependencies> & {
  review: ReviewWithRelations,
  restaurant: RestaurantWithRelations
};
