import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Restaurant} from './restaurant.model';

@model({
  settings: {
    hiddenProperties: ['restaurantId']
  }
})
export class Review extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  rating: number;

  @property({
    type: 'string',
    required: true,
  })
  comment: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @belongsTo(() => Restaurant)
  restaurantId: number;

  constructor(data?: Partial<Review>) {
    super(data);
  }
}

export interface ReviewRelations {
  // describe navigational properties here
}

export type ReviewWithRelations = Review & ReviewRelations;
