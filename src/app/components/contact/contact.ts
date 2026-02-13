import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact.html',
    styleUrls: ['./contact.scss']
})
export class ContactComponent implements OnInit {
    private route = inject(ActivatedRoute);

    formData = {
        name: '',
        email: '',
        subject: 'Informations',
        message: ''
    };

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['subject']) {
                this.formData.subject = params['subject'];
            }
            if (params['message']) {
                this.formData.message = params['message'];
            }
        });
    }
}
