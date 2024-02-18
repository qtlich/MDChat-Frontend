import {HttpClient}                           from '@angular/common/http';
import {Injectable}                           from '@angular/core';
import {Observable}                           from 'rxjs';
import {BaseRestApi}                          from '../../common/core/base.rest.api';
import {AppConfigService}                     from '../../common/services/app.config.service';
import {CommentCudRequestModel}               from './models/comment.cud.request.model';
import {CommentCudResponseModel}              from './models/comment.cud.response.model';
import {GetAllCommentsRequestModel}           from './models/get.all.comments.request.model';
import {GetAllCommentsResponseModel}          from './models/get.all.comments.response.model';
import {GetUserCommentsUniverseRequestModel}  from './models/get.user.comments.universe.request.model';
import {GetUserCommentsUniverseResponseModel} from './models/get.user.comments.universe.response.model';

@Injectable({
              providedIn: 'root'
            })
export class CommentRestService extends BaseRestApi
{
  constructor(httpClient: HttpClient,
              configService: AppConfigService)
  {
    super(httpClient, configService);
  }

  public getAllPostComments(item: GetAllCommentsRequestModel): Observable<GetAllCommentsResponseModel[]>
  {
    return this.post<GetAllCommentsRequestModel, GetAllCommentsResponseModel[]>(`/comments/by-post`, item);
  }

  public commentCUD(item: CommentCudRequestModel): Observable<CommentCudResponseModel[]>
  {
    return this.post<CommentCudRequestModel, CommentCudResponseModel[]>(`/comments/cud`, item);
  }

  public getUserCommentsUniversal(item: GetUserCommentsUniverseRequestModel): Observable<GetUserCommentsUniverseResponseModel[]>
  {
    return this.post<GetUserCommentsUniverseRequestModel, GetUserCommentsUniverseResponseModel[]>(`/comments/universal-comments`,item);
  }
}
