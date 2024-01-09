import {HttpClient}                from '@angular/common/http';
import {Injectable}                from '@angular/core';
import {Observable}                from 'rxjs';
import {HttpConfigService}         from '../services/http.config.service';
import {GetUserVotesRequestModel}  from './vote-button/models/get.user.votes.request.model';
import {GetUserVotesResponseModel} from './vote-button/models/get.user.votes.response.model';
import {VoteV1RequestModel}        from './vote-button/models/vote-v1-request.model';
import {VoteV1ResponseModel}       from './vote-button/models/vote-v1-response.model';

@Injectable({
              providedIn: 'root'
            })
export class VoteService
{

  constructor(private http: HttpClient,
              private httpConfigService: HttpConfigService)
  {
  }

  public vote(item: VoteV1RequestModel): Observable<VoteV1ResponseModel>
  {
    return this.http.post<VoteV1ResponseModel>(`${this.httpConfigService.baseApiUrl}/votes/vote`, item);
  }

  public getVotes(item: GetUserVotesRequestModel): Observable<GetUserVotesResponseModel>
  {
    return this.http.post<GetUserVotesResponseModel>(`${this.httpConfigService.baseApiUrl}/votes/get`, item);
  }
}
