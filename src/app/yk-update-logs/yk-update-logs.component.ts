import { Component, OnInit } from '@angular/core';

import { CommitObject } from '../commit-object';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-yk-update-logs',
  templateUrl: './yk-update-logs.component.html',
  styleUrls: ['./yk-update-logs.component.scss']
})
export class YkUpdateLogsComponent implements OnInit {
  commits: CommitObject[];

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.blogService.getCommits()
      .subscribe(commits => this.commits = commits);
  }

}
