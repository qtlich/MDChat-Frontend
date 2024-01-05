import {Component, Input, OnInit}                  from '@angular/core';
import {faArrowDown, faArrowUp}                    from '@fortawesome/free-solid-svg-icons';
import {VoteRequestPayload}                        from './models/vote-request-payload';
import {VoteType}                                  from './vote-type';
import {VoteService}                               from '../vote.service';
import {AuthService}                               from 'src/app/auth/shared/auth.service';
import {PostService}                               from '../post.service';
import {MessageService}                            from 'primeng/api';
import {BaseComponent}                             from '../../common/components/base.component/base.component';
import {isAllOperationsSuccess, isNullOrUndefined} from '../../common/core.free.functions';
import {OperationResult}                           from '../../common/models/operation.result.model';
import {Router}                                    from '@angular/router';
import {redirectUrlStorageNameConst}               from '../../common/constants/core.free.constants';
import {LocalStorageService}      from 'ngx-webstorage';
import {GetUserVotesRequestModel} from './models/get.user.votes.request.model';

@Component({
             selector:    'app-vote-button',
             templateUrl: './vote-button.component.html',
             styleUrls:   ['./vote-button.component.css']
           })
export class VoteButtonComponent extends BaseComponent implements OnInit
{

  @Input() postId: number;
  @Input() commentId: number;
  @Input() countVoted: number = 0;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  upvoteColor: string;
  downvoteColor: string;
  isLoggedIn: boolean;
  countVotes: number;

  constructor(private voteService: VoteService,
              private _authService: AuthService,
              private postService: PostService,
              private _router: Router,
              private _localStorageService: LocalStorageService,
              messageService: MessageService)
  {
    super(messageService);
    this._authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  }

  ngOnInit(): void
  {

    this.__updateVoteDetails();
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  public upvotePost()
  {
    if (this.isLoggedIn)
    {
      this.__vote(new VoteRequestPayload(VoteType.UPVOTE,
                                         this.postId,
                                         !isNullOrUndefined(this.commentId) ? this.commentId : null));
    }
    else
    {
      this._localStorageService.store(redirectUrlStorageNameConst, this._router.url);
      this._router.navigateByUrl('/login');
    }
    this.downvoteColor = '';
  }

  public downvotePost()
  {
    this.__vote(new VoteRequestPayload(VoteType.DOWNVOTE,
                                       this.postId,
                                       !isNullOrUndefined(this.commentId) ? this.commentId : null));
    this.upvoteColor = '';
  }

  private __vote(item: VoteRequestPayload): void
  {
    this.voteService.vote(item).subscribe((data: OperationResult[]) =>
                                          {
                                            if (isAllOperationsSuccess(data))
                                            {
                                              this.__updateVoteDetails();
                                            }
                                            this.showMessages(data);
                                          }, error => this.showError(error.error.message));
  }

  private __updateVoteDetails(): void
  {
    // this.voteService
    //     .getVotes(new GetUserVotesRequestModel(this.postId))
    //     .subscribe(post =>
    //                {
    //                  // this.post = post;
    //                });
  }
}
