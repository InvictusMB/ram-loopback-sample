import {Entity, model, property} from '@loopback/repository';

@model()
export class ReviewResponse extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  comment: string;

  @property({
    type: 'string',
  })
  reviewId?: string;

  constructor(data?: Partial<ReviewResponse>) {
    super(data);
  }
}

export interface ReviewResponseRelations {
  // describe navigational properties here
}

export type ReviewResponseWithRelations = ReviewResponse & ReviewResponseRelations;
