import {Component, Input, OnChanges, OnInit, SimpleChanges}                               from '@angular/core';
import {Router}                                                                           from '@angular/router';
import {faArrowDown, faArrowUp}                                                           from '@fortawesome/free-solid-svg-icons';
import {LocalStorageService}                                                              from 'ngx-webstorage';
import {MessageService}                                                                   from 'primeng/api';
import {take}                                                                             from 'rxjs/operators';
import {AuthService}                                                                      from 'src/app/auth/shared/auth.service';
import {BaseComponent}                                                                    from '../../common/components/base.component/base.component';
import {redirectUrlStorageNameConst}                                                      from '../../common/constants/core.free.constants';
import {errorToText, executeIf, isChangedAndNullOrUndefined, isNullOrUndefined, toNumber} from '../../common/core.free.functions';
import {OperationResult}                                                                  from '../../common/models/operation.result.model';
import {VoteService}                                                                      from '../vote.service';
import {GetUserVotesRequestModel}                                                         from './models/get.user.votes.request.model';
import {GetUserVotesResponseModel}                                                        from './models/get.user.votes.response.model';
import {VoteV1RequestModel}                                                               from './models/vote-v1-request.model';
import {VoteV1ResponseModel}                                                              from './models/vote-v1-response.model';
import {VoteType}                                                                         from './vote-type';

@Component({
             selector:    'vote-button',
             templateUrl: './vote-button.component.html',
             styleUrls:   ['./vote-button.component.css']
           })
export class VoteButtonComponent extends BaseComponent implements OnInit, OnChanges
{

  @Input() postId: number;
  @Input() commentId: number;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  isLoggedIn: boolean;
  public upVoted: boolean = false;
  public downVoted: boolean = false;
  public countVoted: number = 0;

  constructor(private voteService: VoteService,
              private _authService: AuthService,
              private _router: Router,
              private _localStorageService: LocalStorageService,
              messageService: MessageService)
  {
    super(messageService);
    this._authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  }
  public refresh()
  {
    this.__getVotes();
  }
  ngOnInit(): void
  {
    this.__getVotes();
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    console.log('ngOnChanges', changes);
    executeIf(isChangedAndNullOrUndefined(changes, 'postId'), () => this.__getVotes());
  }

  public onUpVoteClick(): void
  {
    this.__vote(VoteType.UPVOTE);
  }

  public onDownVoteClick(): void
  {
    this.__vote(VoteType.DOWNVOTE);
  }

  private __vote(voteType: VoteType): void
  {
    if (this.isLoggedIn)
    {
      this.voteService
          .vote(this.__prepareDataForVote(voteType))
          .pipe(take(1))
          .subscribe((item: VoteV1ResponseModel) =>
                     {
                       if (item.id > 0)
                       {
                         this.__getVotes();
                         this.countVoted = item.voteCount;
                         this.upVoted = item.upVoted;
                         this.downVoted = item.downVoted;
                       }
                       else
                       {
                         this.showMessages([new OperationResult(item.id, item.message)]);
                       }
                     }, error => this.showError(errorToText(error)));
    }
    else
    {
      this._localStorageService.store(redirectUrlStorageNameConst, this._router.url);
      this._router.navigateByUrl('/login');
    }
  }

  private __prepareDataForVote(voteType: VoteType): VoteV1RequestModel
  {
    return new VoteV1RequestModel(!isNullOrUndefined(this.postId) ? toNumber(this.postId) : null,
                                  !isNullOrUndefined(this.commentId) ? toNumber(this.commentId) : null,
                                  voteType);
  }

  private __getVotes(): void
  {
    this.voteService
        .getVotes(new GetUserVotesRequestModel(!isNullOrUndefined(this.postId) ? toNumber(this.postId) : null,
                                               !isNullOrUndefined(this.commentId) ? toNumber(this.commentId) : null))
        .pipe(take(1))
        .subscribe((item: GetUserVotesResponseModel) =>
                   {
                     this.countVoted = item.countVotes;
                     this.upVoted = item.upVoted;
                     this.downVoted = item.downVoted;
                   }, error => this.showError(errorToText(error)));
  }
}
