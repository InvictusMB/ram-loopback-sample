import _ from 'lodash';
import React from 'react';

import {ReactComponent as ReviewSvg} from './news-paper.svg';
import {ReactComponent as TopSvg} from './align-top.svg';
import {ReactComponent as BottomSvg} from './align-bottom.svg';
import {ReactComponent as AverageSvg} from './bar-graph.svg';

export function RestaurantSummaryView({Shell, restaurant}: RestaurantSummaryViewProps) {
  return (
    <div className="w-full h-10 hover:bg-teal-100 flex pt-2">
      <div className="w-full pl-4 font-semibold text-gray-500">{restaurant.name}</div>
      <div className="-mt-1 w-16"><Shell.Avatar id={restaurant.ownerId} /></div>
      <div className="w-1/6 text-center text-gray-500 font-bold ml-2">{restaurant.owner?.name}</div>
      <div className="w-1/6 justify-center flex ml-4">
        <ReviewIcon />
        <div className="ml-2 font-bold">{restaurant.reviews?.length || 0}</div>
      </div>
      <div className="w-1/6 flex justify-center">
        <AvgIcon/>
        <div className="ml-2 font-bold">{avgReview(restaurant)}</div>
      </div>
      <div className="w-1/6 flex justify-center">
        <MaxIcon/>
        <div className="ml-2 font-bold">{maxReview(restaurant)}</div>
      </div>
      <div className="w-1/6 flex justify-center">
        <MinIcon/>
        <div className="ml-2 font-bold">{minReview(restaurant)}</div>
      </div>
    </div>
  );
}

function ReviewIcon() {
  return (
    <div className="inline-block h-4 w-4 text-blue-400 mt-1">
      <ReviewSvg stroke="currentColor" />
    </div>
  );
}

function MaxIcon() {
  return (
    <div className="inline-block h-4 w-4 text-blue-400 mt-1">
      <TopSvg stroke="currentColor" />
    </div>
  );
}

function MinIcon() {
  return (
    <div className="inline-block h-4 w-4 text-blue-400 mt-1">
      <BottomSvg stroke="currentColor" />
    </div>
  );
}

function AvgIcon() {
  return (
    <div className="inline-block h-4 w-4 text-blue-400 mt-1">
      <AverageSvg stroke="currentColor" />
    </div>
  );
}

const dependencies = [
  Injected.Shell,
] as const;
Object.assign(RestaurantSummaryView, {[Symbol.for('ram.deps')]: dependencies});

type RestaurantSummaryViewProps = {restaurant: Restaurant} & PickInjected<typeof dependencies>;

type Restaurant = RestaurantStore['restaurants'][number];
type RestaurantStore = PickInjected<[typeof Injected.restaurantStore]>[typeof Injected.restaurantStore];

function maxReview(r: Restaurant) {
  const ratings = (r.reviews ?? []).map(rv => rv.rating);
  if (!ratings.length) {
    return '-';
  }
  return Math.max(...ratings);
}

function minReview(r: Restaurant) {
  const ratings = (r.reviews ?? []).map(rv => rv.rating);
  if (!ratings.length) {
    return '-';
  }
  return Math.min(...ratings);
}

function avgReview(r: Restaurant) {
  const ratings = (r.reviews ?? []).map(rv => rv.rating);
  if (!ratings.length) {
    return '-';
  }
  return Math.round(_.sum(ratings) / ratings.length * 10) / 10;
}
