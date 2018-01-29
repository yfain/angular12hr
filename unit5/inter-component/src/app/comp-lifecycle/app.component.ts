import {Component} from "@angular/core";
@Component({
  selector: 'app-root',
  styles: ['.parent {background: lightblue}'],
  template: `
    <div class="parent">
      <h2>Parent</h2>
      <div>Greeting: <input type="text" [(ngModel)]="myGreeting">
      </div>
      <div>User name: <input type="text" [(ngModel)]="myUser.name">
      </div>
      <child [greeting]="myGreeting" [user]="myUser"></child>
    </div>
  `
})
export class AppComponent {
  myGreeting = 'Hello';
  myUser: {name: string} = {name: 'John'};
}
