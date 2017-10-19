import { Component, OnInit, Input } from '@angular/core';

import { Content } from '../content';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-yk-folder',
  templateUrl: './yk-folder.component.html',
  styleUrls: ['./yk-folder.component.scss']
})
export class YkFolderComponent implements OnInit {
  @Input() dir: string;
  @Input() url: string;
  files: Content[];
  isShow = true;

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.blogService.getFiles(this.url)
      .subscribe(files => this.files = files);
  }

  toggle(): void {
    this.isShow = !this.isShow;
  }

}
