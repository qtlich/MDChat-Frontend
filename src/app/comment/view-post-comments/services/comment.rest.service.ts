import {HttpClient}                  from '@angular/common/http';
import {Injectable}                  from '@angular/core';
import {Observable}                  from 'rxjs';
import {BaseRestApi}                 from '../../../common/core/base.rest.api';
import {AppConfigService}            from '../../../common/services/app.config.service';
import {CommentCudRequestModel}      from '../models/comment.cud.request.model';
import {CommentCudResponseModel}     from '../models/comment.cud.response.model';
import {CommentPayload}              from '../models/comment.payload';
import {GetAllCommentsRequestModel}  from '../models/get.all.comments.request.model';
import {GetAllCommentsResponseModel} from '../models/get.all.comments.response.model';

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

  public getAllCommentsByUser(name: string)
  {
    return this.get<CommentPayload[]>(`/comments/by-user/` + name);
  }
}
