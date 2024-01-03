import {HttpClient}                from '@angular/common/http';
import {Injectable}                from '@angular/core';
import {Observable}                from 'rxjs';
import {OperationResult}           from '../common/models/operation.result.model';
import {HttpConfigService}         from '../services/http.config.service';
import {GetUserVotesRequestModel}  from './vote-button/models/get.user.votes.request.model';
import {GetUserVotesResponseModel} from './vote-button/models/get.user.votes.response.model';
import {VoteRequestPayload}        from './vote-button/models/vote-request-payload';

@Injectable({
              providedIn: 'root'
            })
export class VoteService
{

  constructor(private http: HttpClient,
              private httpConfigService: HttpConfigService)
  {
  }

  public vote(item: VoteRequestPayload): Observable<OperationResult[]>
  {
    return this.http.post<Array<OperationResult>>(`${this.httpConfigService.baseApiUrl}/votes/vote`, item);
  }

  public getVotes(item: GetUserVotesRequestModel): Observable<GetUserVotesResponseModel>
  {
    return this.http.post<GetUserVotesResponseModel>(`${this.httpConfigService.baseApiUrl}/votes/getvotes`, item);
  }
}
