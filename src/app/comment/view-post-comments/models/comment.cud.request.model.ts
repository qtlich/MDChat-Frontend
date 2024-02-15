import {OPERATION_TYPES} from '../../../common/core/enums/operation.types';

/**
 * Create, update, delete post
 * API POST: /comments/cud
 */
export class CommentCudRequestModel
{
  constructor(public operationType?:OPERATION_TYPES,
              public commentId?:number,
              public parentId?:number,
              public postId?:number,
              public comment?:string)
  {
  }
}
