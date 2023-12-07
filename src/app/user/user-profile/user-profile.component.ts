import {Component, OnInit}                                        from '@angular/core';
import {PostService}                                              from 'src/app/shared/post.service';
import {ActivatedRoute, Router}                                   from '@angular/router';
import {CommentService}                                           from 'src/app/comment/comment.service';
import {PostModel}                                                from 'src/app/shared/post-model';
import {CommentPayload}                                           from 'src/app/comment/comment.payload';
import {AuthService}                                              from '../../auth/shared/auth.service';
import {ChangeUserInfoRequestModel}                               from '../../auth/shared/models/change.user.info.request.model';
import {isAllOperationsSuccess, isEmptyArray, isEmptyStringField} from '../../common/core.free.functions';
import {MessageService}                                           from 'primeng/api';
import {UserInfoRequestModel}                                     from './models/user.info.request.model';
import {UserInfoResponseModel}                                    from './models/user.info.response.model';
import {BaseComponent}                                            from '../../common/components/base.component/base.component';

@Component({
             selector:    'app-user-profile',
             templateUrl: './user-profile.component.html',
             styleUrls:   ['./user-profile.component.css']
           })
export class UserProfileComponent extends BaseComponent implements OnInit
{
  public currentUserName: string;
  public newUserName: string;
  public newEmail: string;
  public created: string;
  public modified: string;
  public newPassword: string;
  public newConfirmPassword: string;
  public enabled: boolean;
  posts: PostModel[];
  comments: CommentPayload[];
  postLength: number;
  commentLength: number;
  private _userId: number;

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _authService: AuthService,
              private _postService: PostService,
              private _commentService: CommentService,
              messageService: MessageService)
  {
    super(messageService);
    this.currentUserName = this._activatedRoute.snapshot.params.name;

    this._postService
        .getAllPostsByUser(this.currentUserName)
        .subscribe(data =>
                   {
                     this.posts = data;
                     this.postLength = data.length;
                   });
    this._commentService
        .getAllCommentsByUser(this.currentUserName)
        .subscribe(data =>
                   {
                     this.comments = data;
                     this.commentLength = data.length;
                   });
    this.__loadUserInfo(this.currentUserName);
  }

  public onChangeUserInfoClick(): void
  {
    if (this.__isValidInputData())
    {
      this._authService
          .changeUserInfo(new ChangeUserInfoRequestModel())
          .subscribe(data =>
                     {
                       if (isAllOperationsSuccess(data))
                       {
                         this.__loadUserInfo(this.newUserName);
                         this.currentUserName = this.newUserName;
                         this._router.navigateByUrl(`/user-profile/${this.newUserName}`);
                       }
                     }, error => this.showError('Can\'nt change user info'));
    }
  }

  ngOnInit(): void
  {
  }

  private __loadUserInfo(userName: string): void
  {
    this.__clearUserInfo();
    this._authService
        .getUserInfo(new UserInfoRequestModel(userName))
        .subscribe((data: Array<UserInfoResponseModel>) =>
                   {
                     if (!isEmptyArray(data))
                     {
                       const item: UserInfoResponseModel = data[0];
                       this._userId = item.id;
                       this.newUserName = item.username;
                       this.newEmail = item.email;
                       this.created = item.created;
                       this.modified = item.modified;
                       this.enabled = item.enabled;
                     }
                   },
                   error => this.showError('Can\'t retrieve user info'));
  }

  private __clearUserInfo(): void
  {
    this._userId = null;
    this.newUserName = null;
    this.newEmail = null;
    this.created = null;
    this.modified = null;
    this.enabled = null;
  }

  private __isValidInputData(): boolean
  {
    if (isEmptyStringField(this.newUserName))
    {
      this.showWarning('Please input Username');
      return false;
    }
    if (isEmptyStringField(this.newEmail))
    {
      this.showWarning(`Please input email`);
      return false;
    }
    if (isEmptyStringField(this.newUserName))
    {
      this.showWarning(`Please input username`);
      return false;
    }
    if (isEmptyStringField(this.newPassword))
    {
      this.showWarning(`Please input password`);
      return false;
    }
    if (isEmptyStringField(this.newConfirmPassword))
    {
      this.showWarning(`Please input confirmation password`);
      return false;
    }
    if (this.newPassword !== this.newConfirmPassword)
    {
      this.showWarning(`Passwords do not match`);
      return false;
    }
    return true;
  }

}
