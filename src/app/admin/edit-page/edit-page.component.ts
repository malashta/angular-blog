import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostService} from '../../shared/post.service';
import {switchMap} from 'rxjs/operators';
import {Post} from '../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  editForm: FormGroup;
  post: Post;
  submited = false;
  pSub;
  uSub;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.initForm();
    this.pSub = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id']);
      }))
      .subscribe((post: Post) => {
        this.post = post;
        this.editForm.setValue({
          title: post.title,
          text: post.text
        });
      });
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

  initForm() {
    this.editForm = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
    });
  }

  submit() {
    if (this.editForm.invalid) {
      return;
    }

    this.submited = true;

    this.uSub = this.postService.update({
      ...this.post,
      text: this.editForm.value.text,
      title: this.editForm.value.title
    }).subscribe(() => {
      this.submited = false;
      this.alert.success('Пост был обновлен');
    });
  }

}
