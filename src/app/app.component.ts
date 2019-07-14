import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<app-markdown [text]=md></app-markdown>'
})
export class AppComponent {
  md = '# Hello Markdown\n```csharp\npublic class Foo {}\n```';
}
