import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { User } from '@app/_models';



@Component({ templateUrl: 'user-profile.component.html' })
export class UserProfileComponent implements OnInit {
    id: string;
    user: User;

    constructor(
        private route: ActivatedRoute,
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

            this.accountService.getById(this.id)
                
                .subscribe(res => {
                    this.user = res;
                });
            }
    
}