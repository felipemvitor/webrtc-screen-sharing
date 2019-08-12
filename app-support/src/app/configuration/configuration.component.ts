import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

    isRegistering = false

    constructor() { }

    ngOnInit() {
    }

    register() {
        this.isRegistering = !this.isRegistering
    }
}
