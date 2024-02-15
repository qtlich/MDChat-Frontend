import {HttpClient}                from '@angular/common/http';
import {Injectable}                from '@angular/core';
import {Observable}                from 'rxjs';
import {BaseRestApi}               from '../../../common/core/base.rest.api';
import {AppConfigService}          from '../../../common/services/app.config.service';
import {GetUserVotesRequestModel}  from '../models/get.user.votes.request.model';
import {GetUserVotesResponseModel} from '../models/get.user.votes.response.model';
import {VoteV1RequestModel}        from '../models/vote-v1-request.model';
import {VoteV1ResponseModel}       from '../models/vote-v1-response.model';

@Injectable({providedIn: 'root'})
export class VoteRestService extends BaseRestApi
{

  constructor(httpClient: HttpClient,
              configService: AppConfigService)
  {
    super(httpClient, configService);
  }

  public vote(item: VoteV1RequestModel): Observable<VoteV1RequestModel>
  {
    return this.post<VoteV1RequestModel, VoteV1ResponseModel>(`/votes/vote`, item);
  }

  public getVotes(item: GetUserVotesRequestModel): Observable<GetUserVotesResponseModel>
  {
    return this.post<GetUserVotesRequestModel, GetUserVotesResponseModel>(`/votes/get`, item);
  }
}
