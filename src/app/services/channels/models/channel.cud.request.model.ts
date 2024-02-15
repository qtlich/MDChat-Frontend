import {OPERATION_TYPES} from '../../../common/core/enums/operation.types';

/**
 * Create|edit|delete channel 0,1,2
 * API POST: /channel/cud
 */
export class ChannelCudRequestModel
{
  constructor(public operationType?:OPERATION_TYPES,
              public channelId?:number,
              public channelTypeId?:number,
              public channelName?:string,
              public channelDescription?:string,
              public deleted:boolean = false)
  {
  }
}
