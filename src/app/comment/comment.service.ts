import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommentPayload} from './comment.payload';
import {Observable} from 'rxjs';
import {HttpConfigService} from "../services/http.config.service";

@Injectable({
              providedIn: 'root'
            })
export class CommentService
{

  constructor(private httpClient: HttpClient,
              private httpConfigService: HttpConfigService)
  {
  }

  getAllCommentsForPost(postId: number): Observable<CommentPayload[]>
  {
    return this.httpClient.get<CommentPayload[]>(`${this.httpConfigService.baseApiUrl}/comments/by-post/` + postId);
  }

  postComment(commentPayload: CommentPayload): Observable<any>
  {
    return this.httpClient.post<any>(`${this.httpConfigService.baseApiUrl}/comments/create`, commentPayload);
  }

  getAllCommentsByUser(name: string)
  {
    return this.httpClient.get<CommentPayload[]>(`${this.httpConfigService.baseApiUrl}/comments/by-user/` + name);
  }
}
