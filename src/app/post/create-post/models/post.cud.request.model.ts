import {OPERATION_TYPES} from '../../../common/core/enums/operation.types';

/**
 * Create, update, delete post
 * API POST: /posts/cud
 */
export class PostCudRequestModel
{
  constructor(public operationType?:OPERATION_TYPES,
              public postId?:number,
              public channelId?:number,
              public postName?:string,
              public postDescription?:string,
              public url?:string,
              public commentsLocked?:boolean)
  {
  }
}
