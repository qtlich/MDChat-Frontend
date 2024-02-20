import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Router}                                                        from '@angular/router';
import {faArrowDown, faArrowUp, faChevronDown, faChevronUp}                               from '@fortawesome/free-solid-svg-icons';
import {LocalStorageService}                                                              from 'ngx-webstorage';
import {take}                                                                             from 'rxjs/operators';
import {AuthDataService}                                                                  from '../../auth/shared/auth.data.service';
import {BaseComponent}                                                                    from '../../common/components/base.component/base.component';
import {redirectUrlStorageNameConst}                                                                                      from '../../common/constants/core.free.constants';
import {errorToText, executeIf, isChangedAndNotNullOrUndefined, isChangedAndNullOrUndefined, isNullOrUndefined, toNumber} from '../../common/core/core.free.functions';
import {EActionType}                                                                                                      from '../../common/models/event.type';
import {OperationResult}                                                                  from '../../common/models/operation.result.model';
import {GlobalBusService}                                                                 from '../../common/services/global.bus.service';
import {GetUserVotesRequestModel}                                                         from './models/get.user.votes.request.model';
import {GetUserVotesResponseModel}                                                        from './models/get.user.votes.response.model';
import {VoteType}                                                                         from './models/vote-type';
import {VoteV1RequestModel}                                                               from './models/vote-v1-request.model';
import {VoteV1ResponseModel}                                                              from './models/vote-v1-response.model';
import {VoteDataService}                                                                  from './services/vote.data.service';
import {VoteRestService}                                                                  from './services/vote.rest.service';

@Component({
             selector:    'vote-button',
             templateUrl: './vote-button.component.html',
             styleUrls:   ['./vote-button.component.css']
           })
export class VoteButtonComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{

  @Input() postId: number;
  @Input() commentId: number;
  @Input() mode: number = 0; // 0 - post, 1 -comment
  faArrowUp = faArrowUp;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faArrowDown = faArrowDown;
  isLoggedIn: boolean;
  public upVoted: boolean = false;
  public downVoted: boolean = false;
  public countVoted: number = 0;

  constructor(private voteService: VoteRestService,
              private _dataService: VoteDataService,
              private _authService: AuthDataService,
              private _router: Router,
              private _localStorageService: LocalStorageService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
    this._authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  }

  public refresh()
  {
    this.__getVotes();
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'postId'), () => this.__getVotes());
  }

  public onUpVoteClick(): void
  {
    this.__vote(VoteType.UPVOTE);
  }

  public onDownVoteClick(): void
  {
    this.__vote(VoteType.DOWNVOTE);
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    // this.subscribe(this._dataService.onVoteEvent().subscribe((data: IVoteResult) =>
    //                                                          {
    //                                                            if (data.success)
    //                                                            {
    //                                                              this.countVoted = data.result.voteCount;
    //                                                              this.upVoted = data.result.upVoted;
    //                                                              this.downVoted = data.result.downVoted;
    //                                                              this.__getVotes();
    //                                                            }
    //                                                          }));
    // this.subscribe(this._dataService.onGetVoteEvent().subscribe((result: GetUserVotesResponseModel) =>
    //                                                             {
    //                                                               this.countVoted = result.countVotes;
    //                                                               this.upVoted = result.upVoted;
    //                                                               this.downVoted = result.downVoted;
    //                                                             }));
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
                         this.serviceBus.sendEvent(EActionType.ON_VOTE_ACTION, true);
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
    // this._dataService.getVote(new GetUserVotesRequestModel(!isNullOrUndefined(this.postId) ? toNumber(this.postId) : null,
    //                                                        !isNullOrUndefined(this.commentId) ? toNumber(this.commentId) : null));
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
