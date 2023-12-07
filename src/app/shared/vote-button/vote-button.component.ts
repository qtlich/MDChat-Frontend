import {Component, Input, OnInit} from '@angular/core';
import {PostModel}                from '../post-model';
import {faArrowDown, faArrowUp}   from '@fortawesome/free-solid-svg-icons';
import {VotePayload}              from './vote-payload';
import {VoteType}                 from './vote-type';
import {VoteService}              from '../vote.service';
import {AuthService}              from 'src/app/auth/shared/auth.service';
import {PostService}              from '../post.service';
import {throwError}               from 'rxjs';
import {MessageService}           from 'primeng/api';

@Component({
             selector:    'app-vote-button',
             templateUrl: './vote-button.component.html',
             styleUrls:   ['./vote-button.component.css']
           })
export class VoteButtonComponent implements OnInit
{

  @Input() post: PostModel;
  votePayload: VotePayload;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  upvoteColor: string;
  downvoteColor: string;
  isLoggedIn: boolean;

  constructor(private voteService: VoteService,
              private authService: AuthService,
              private postService: PostService,
              private _messageService: MessageService)
  {

    this.votePayload = {
      voteType: undefined,
      postId:   undefined
    }
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  }

  ngOnInit(): void
  {
    this.updateVoteDetails();
  }

  upvotePost()
  {
    this.votePayload.voteType = VoteType.UPVOTE;
    this.vote();
    this.downvoteColor = '';
  }

  downvotePost()
  {
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
    this.upvoteColor = '';
  }

  private vote()
  {
    this.votePayload.postId = this.post.id;
    this.voteService.vote(this.votePayload).subscribe(() =>
                                                      {
                                                        this.updateVoteDetails();
                                                      }, error =>
                                                      {
                                                        this._messageService.add({severity: 'error', detail: error.error.message});
                                                        throwError(error);
                                                      });
  }

  private updateVoteDetails()
  {
    this.postService.getPost(this.post.id).subscribe(post =>
                                                     {
                                                       this.post = post;
                                                     });
  }
}
