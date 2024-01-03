import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostModel} from './post-model';
import {Observable} from 'rxjs';
import {CreatePostPayload} from '../post/create-post/create-post.payload';
import {HttpConfigService}       from '../services/http.config.service';
import {OperationResult}         from '../common/models/operation.result.model';
import {GetAllPostsRequestModel} from './post-tile/models/get.all.posts.request.model';
import {GetAllPostsResponseModel} from './post-tile/models/get.all.posts.response.model';
import {PostCudRequestModel} from '../post/create-post/models/post.cud.request.model';
import {PostCudResponseModel} from '../post/create-post/models/post.cud.response.model';

@Injectable({
              providedIn: 'root'
            })
export class PostService
{

  constructor(private http: HttpClient,
              private httpConfigService: HttpConfigService)
  {
  }

  public deletePost(postId: number): Observable<Array<OperationResult>>
  {
    return this.http.post<Array<OperationResult>>(`${this.httpConfigService.baseApiUrl}/posts/delete/${postId}`,{postId: postId});
  }

  getAllPosts(): Observable<Array<PostModel>>
  {
    return this.http.get<Array<PostModel>>(`${this.httpConfigService.baseApiUrl}/posts/all`);
  }
  getAllPostsV1(item:GetAllPostsRequestModel): Observable<Array<GetAllPostsResponseModel>>
  {
    return this.http.post<Array<GetAllPostsResponseModel>>(`${this.httpConfigService.baseApiUrl}/posts/v1/all`,item);
  }

  createPost(postPayload: CreatePostPayload): Observable<any>
  {
    return this.http.post(`${this.httpConfigService.baseApiUrl}/posts/create`, postPayload);
  }
  public postCUD(item: PostCudRequestModel): Observable<Array<PostCudResponseModel>>
  {
    return this.http.post<Array<PostCudResponseModel>>(`${this.httpConfigService.baseApiUrl}/posts/cud`, item);
  }

  getPost(id: number): Observable<PostModel>
  {
    return this.http.get<PostModel>(`${this.httpConfigService.baseApiUrl}/posts/by-id/` + id);
  }

  getAllPostsByUser(name: string): Observable<PostModel[]>
  {
    return this.http.get<PostModel[]>(`${this.httpConfigService.baseApiUrl}/posts/by-user/` + name);
  }

  public getPostsByChannel(channelId: number): Observable<PostModel[]>
  {
    return this.http.get<PostModel[]>(`${this.httpConfigService.baseApiUrl}/posts/chposts/${channelId}`);
  }
}
