import { Component, OnInit } from '@angular/core';
import { RightSideComponent } from './right-side/right-side.component';
import { FeedContentComponent } from './feed-content/feed-content.component';
import { LeftSideComponent } from './left-side/left-side.component';


@Component({
  selector: 'app-feed',
  imports: [FeedContentComponent , LeftSideComponent , RightSideComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent  {
leftOpen = false;
rightOpen = false;

toggleLeft() {
  this.leftOpen = !this.leftOpen;
}

toggleRight() {
  this.rightOpen = !this.rightOpen;
}
  

}
