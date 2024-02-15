import {Injectable}          from '@angular/core';
import {BaseService}         from '../../../common/services/base.service';
import {GlobalBusService}    from '../../../common/services/global.bus.service';
import {VOTE_TYPE_ACTION}    from '../models/vote-type';
import {VoteV1RequestModel}  from '../models/vote-v1-request.model';
import {VoteV1ResponseModel} from '../models/vote-v1-response.model';
import {VoteRestService}     from './vote.rest.service';

export interface IVoteResult
{
  voteType: VOTE_TYPE_ACTION,
  success: boolean,
  input: VoteV1RequestModel,
  result: VoteV1ResponseModel
}

@Injectable({providedIn: 'root'})
export class VoteDataService extends BaseService
{
  // private readonly _onVoteSubject: Subject<IVoteResult> = new Subject<IVoteResult>();
  // private readonly _onGetVoteSubject: Subject<GetUserVotesResponseModel> = new Subject<GetUserVotesResponseModel>();

  constructor(private _restService: VoteRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  // public onVoteEvent(): Observable<IVoteResult>
  // {
  //   return this._onVoteSubject;
  // }
  //
  // public onGetVoteEvent(): Observable<GetUserVotesResponseModel>
  // {
  //   return this._onGetVoteSubject;
  // }
  //
  // public getVote(item: GetUserVotesRequestModel): void
  // {
  //   this.toDb(item,
  //             input => this._restService.getVotes(input),
  //             data =>
  //             {
  //
  //             },
  //             `Can't get vote`);
  // }

  // public vote(item: VoteV1RequestModel): void
  // {
  //   this.toDb<VoteV1RequestModel, VoteV1RequestModel>(item,
  //                                                     input => this._restService.vote(input),
  //                                                     (data: VoteV1ResponseModel) =>
  //                                                     {
  //                                                       showOperationResultMessages(this.serviceBus, [data]);
  //                                                       const result: IVoteResult = {success: isAllOperationsSuccess([data]), voteType: this.__getVoteTypeAction(item), input: item, result: data};
  //                                                       this._onVoteSubject.next(result)
  //                                                       this.serviceBus.sendEvent<IVoteResult>(EActionType.ON_VOTE_ACTION, <IVoteResult>result);
  //                                                     },
  //                                                     `Can't vote`);
  // }
  //
  // private __getVoteTypeAction(item: VoteV1RequestModel): VOTE_TYPE_ACTION
  // {
  //   if (isNullOrUndefined(item.commentId))
  //   {
  //     return VOTE_TYPE_ACTION.ON_POST;
  //   }
  //   else
  //   {
  //     return VOTE_TYPE_ACTION.ON_COMMENT;
  //   }
  // }
}
