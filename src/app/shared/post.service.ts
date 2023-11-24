import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostModel} from './post-model';
import {Observable} from 'rxjs';
import {CreatePostPayload} from '../post/create-post/create-post.payload';
import {HttpConfigService} from "../services/http.config.service";
import {OperationResult} from "../common/operation.result.model";

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
    return this.http.delete<Array<OperationResult>>(`${this.httpConfigService.baseApiUrl}/posts/delete/${postId}`);
  }

  getAllPosts(): Observable<Array<PostModel>>
  {
    return this.http.get<Array<PostModel>>(`${this.httpConfigService.baseApiUrl}/posts/all`);
  }

  createPost(postPayload: CreatePostPayload): Observable<any>
  {
    return this.http.post(`${this.httpConfigService.baseApiUrl}/posts/create`, postPayload);
  }

  getPost(id: number): Observable<PostModel>
  {
    return this.http.get<PostModel>(`${this.httpConfigService.baseApiUrl}/posts/by-id/` + id);
  }

  getAllPostsByUser(name: string): Observable<PostModel[]>
  {
    return this.http.get<PostModel[]>(`${this.httpConfigService.baseApiUrl}/posts/by-user/` + name);
  }
}
