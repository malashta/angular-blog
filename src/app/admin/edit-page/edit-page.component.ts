import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostService} from '../../shared/post.service';
import {switchMap} from 'rxjs/operators';
import {Post} from '../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  editForm: FormGroup;
  pSub;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.initForm();
    this.pSub = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id']);
      }))
      .subscribe((post: Post) => {
        this.editForm.setValue({
          title: post.title,
          text: post.text
        });
      });
  }

  ngOnDestroy() {
    this.pSub.unsubscribe();
  }

  initForm() {
    this.editForm = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
    });
  }

}
