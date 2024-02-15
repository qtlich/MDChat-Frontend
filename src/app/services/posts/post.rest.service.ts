import {HttpClient}                         from '@angular/common/http';
import {Injectable}                         from '@angular/core';
import {Observable}                         from 'rxjs';
import {BaseRestApi}                        from '../../common/core/base.rest.api';
import {AppConfigService}                   from '../../common/services/app.config.service';
import {CreatePostPayload}                  from '../../post/create-post/create-post.payload';
import {PostCudRequestModel}                from '../../post/create-post/models/post.cud.request.model';
import {PostCudResponseModel}               from '../../post/create-post/models/post.cud.response.model';
import {PostModel}                          from '../../shared/post-model';
import {GetAllPostsRequestModel}            from './models/get.all.posts.request.model';
import {GetAllPostsResponseModel}           from './models/get.all.posts.response.model';
import {GetAllUserPostsRequestModel}        from './models/get.all.user.posts.request.model';
import {GetPostByIdDtoRequestModel}         from './models/get.post.by.id.dto.request.model';
import {GetPostByIdDtoResponseModel}        from './models/get.post.by.id.dto.response.model';
import {GetUserPostsUniversalRequestModel}  from './models/get.user.posts.universal.request.model';
import {GetUserPostsUniversalResponseModel} from './models/get.user.posts.universal.response.model';
import {BookmarkPostRequestModel}           from './models/bookmark.post.request.model';
import {SaveUnsavePostResponsetModel}       from './models/save.unsave.post.response.model';
import {ShowHidePostRequestModel}           from './models/show.hide.post.request.model';
import {ShowHidePostResponseModel}          from './models/show.hide.post.response.model';

@Injectable({
              providedIn: 'root'
            })
export class PostRestService extends BaseRestApi
{

  constructor(httpClient: HttpClient,
              configService: AppConfigService)
  {
    super(httpClient, configService);
  }

  public getUserPostsUniversal(item: GetUserPostsUniversalRequestModel): Observable<GetUserPostsUniversalResponseModel[]>
  {
    return this.post<GetUserPostsUniversalRequestModel, GetUserPostsUniversalResponseModel[]>(`/posts/universal-posts`, item);
  }

  public postCUD(item: PostCudRequestModel): Observable<PostCudResponseModel[]>
  {
    return this.post<PostCudRequestModel, PostCudResponseModel[]>(`/posts/cud`, item);
  }

  public getPost(item: GetPostByIdDtoRequestModel): Observable<GetPostByIdDtoResponseModel[]>
  {
    return this.post<GetPostByIdDtoRequestModel, GetPostByIdDtoResponseModel[]>(`/posts/view-post`, item);
  }

  public showHidePost(item: ShowHidePostRequestModel): Observable<ShowHidePostResponseModel[]>
  {
    return this.post<ShowHidePostRequestModel, ShowHidePostResponseModel[]>(`/posts/hide-post`, item);
  }

  public saveUnsavePost(item: BookmarkPostRequestModel): Observable<SaveUnsavePostResponsetModel[]>
  {
    return this.post<ShowHidePostRequestModel, ShowHidePostResponseModel[]>(`/posts/bookmark-post`, item);
  }

  public getAllPostsByUser(name: string): Observable<PostModel[]>
  {
    return this.get<PostModel[]>(`/posts/by-user/${name}`);
  }

  public getCommentsCount(postId: number): Observable<number>
  {
    return this.get<number>(`/posts/get-comments-count/${postId}`);
  }

  public getPostsByChannel(channelId: number): Observable<PostModel[]>
  {
    return this.get<PostModel[]>(`/posts/chposts/${channelId}`);
  }
}
