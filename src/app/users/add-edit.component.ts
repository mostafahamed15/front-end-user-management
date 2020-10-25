import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    upload: boolean = true;
    file: any;
     /*########################## File Upload ########################*/
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = 'https://demos.creative-tim.com/argon-dashboard/assets/img/theme/team-1.jpg';
  editFile: boolean = true;
  removeUpload: boolean = false;
  imgSrc: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private cd: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            password: ['', passwordValidators],
            loginName: ['', Validators.required],
            displayName: ['', Validators.required],
            dateOfBirth: [''],
            country: [''],
            address: ['', Validators.required],
            isActive: [''],
            salary: ['', Validators.required],
            file: [null]
        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.loginName.setValue(x.loginName);
                    this.f.displayName.setValue(x.displayName);
                    this.f.salary.setValue(x.salary);
                    this.f.country.setValue(x.country);
                    this.f.address.setValue(x.address);
                    this.f.isActive.setValue(x.isActive);
                    this.f.dateOfBirth.setValue(x.dateOfBirth);
                    this.imgSrc = x.file;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateUser() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    uploadFile(event) {
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
          reader.readAsDataURL(file);

          // When file uploads set it to file formcontrol
          reader.onload = () => {
            this.imageUrl = reader.result;
            this.f.file.patchValue(reader.result);
            this.editFile = false;
            this.removeUpload = true;
          }
          // ChangeDetectorRef since file is loading outside the zone
          this.cd.markForCheck();       
        }
        this.upload = false;
        console.log(event.target.files[0])
      }
    
      // Function to remove uploaded file
      removeUploadedFile() {
        let newFileList = Array.from(this.el.nativeElement.files);
        this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
        this.editFile = true;
        this.removeUpload = false;
        this.f.file.patchValue([null]);
      }
}