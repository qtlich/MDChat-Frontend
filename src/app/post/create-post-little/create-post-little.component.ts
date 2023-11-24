import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChannelResponseModel} from '../../channel/models/channel.response.model';
import {Router} from '@angular/router';
import {PostService} from 'src/app/shared/post.service';
import {ChannelService} from '../../channel/channel.service';
import {throwError} from 'rxjs';
import {CreatePostPayload} from './create-post.payload';

@Component({
  selector: 'create-post-little',
  templateUrl: './create-post-little.component.html',
  styleUrls: ['./create-post-little.component.css']
})
export class CreatePostLittleComponent implements OnInit {

  postForm: FormGroup;
  postPayload: CreatePostPayload;
  subreddits: Array<ChannelResponseModel>;

  constructor(private router: Router, private postService: PostService,
    private channelService: ChannelService) {
    this.postPayload = {
      postName: '',
      url: '',
      description: ''
    }
  }

  ngOnInit() {
    this.postForm = new FormGroup({
      postName: new FormControl('', Validators.required),
      subredditName: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    this.channelService.getAllChannels().subscribe((data) => {
      this.subreddits = data;
    }, error => {
      throwError(error);
    });
  }

  createPost() {
    this.postPayload.postName = this.postForm.get('postName').value;
    this.postPayload.url = this.postForm.get('url').value;
    this.postPayload.description = this.postForm.get('description').value;

    this.postService.createPost(this.postPayload).subscribe((data) => {
      this.router.navigateByUrl('/');
    }, error => {
      throwError(error);
    })
  }

  discardPost() {
    this.router.navigateByUrl('/');
  }

}
