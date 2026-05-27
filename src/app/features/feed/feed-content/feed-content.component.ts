import { PostsService } from './../../../core/services/posts.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { IFeed } from '../../../core/models/i-feed.interface';
import { initFlowbite } from 'flowbite';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { RouterLink } from "@angular/router";
import { PostCardComponent } from "../../../shared/post-card/post-card.component";


@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, PostCommentComponent, RouterLink, PostCardComponent],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  postData: IFeed[] = [];
  postId: string = "";
  saveFile!: File;
  imgUrl: string | ArrayBuffer | null | undefined ;
  content: FormControl = new FormControl("");


   
  ngOnInit() : void {
     this.getAllPostsData();
     this.postId = JSON.parse(localStorage.getItem("socialUser")! )?._id;
     
  }

  getAllPostsData() : void { 
    this.postsService.getPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.postData = res.data.posts.map((post: IFeed) => {

  return {

    ...post,

    isLiked: post.likes.includes(this.postId)

  };

      });
        setTimeout(() => {
        initFlowbite();
      });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

 changeImg(e: Event): void {
    const file = e.target as HTMLInputElement;
    if(file.files && file.files.length > 0) {
      console.log(file.files[0]);
      this.saveFile = file.files[0];
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.saveFile);
    fileReader.onload = (e:ProgressEvent<FileReader>) => {
    this.imgUrl = e.target?.result;
    }
 }

 submitForm(e:Event , form: HTMLFormElement) : void{
  e.preventDefault();
  console.log(this.content.value);
  console.log(this.saveFile);

  const formData = new FormData();

  if(this.content.value){
    formData.append('body' , this.content.value);
  }
  if(this.saveFile){
      formData.append('image' , this.saveFile);

  }  

  this.postsService.createPost(formData).subscribe({
    next :(res) => {
      console.log(res);
      if(res.success){
        form.reset();
        this.imgUrl = "";
        this.getAllPostsData();
      }
    },
    error: (err) => {
      console.log(err);
      
    }
  })

 }

onPostDeleted(postId: string): void {

  this.postData =
    this.postData.filter(post => post._id !== postId);

}

}
