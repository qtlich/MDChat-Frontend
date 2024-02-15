import {OperationResult} from '../../../common/models/operation.result.model';

/**
 * Create|edit|delete channel 0,1,2
 * API POST: /channel/cud
 */
export class ChannelCudResponseModel extends OperationResult
{
  constructor()
  {
    super();
  }
}
