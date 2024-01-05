import {Directive, ElementRef, Input, NgModule} from '@angular/core';

@Directive({
             selector: '[appInnerHTML]'
           })
export class InnerHTMLDirective {
  constructor(private el: ElementRef) {
  }

  @Input('appInnerHTML') set innerHTML(htmlContent: string) {
    this.el.nativeElement.innerHTML = htmlContent;
  }
}

@NgModule({
            declarations: [InnerHTMLDirective],
            exports     : [InnerHTMLDirective]
          })
export class InnerHtmlDirectivesModule {
}
