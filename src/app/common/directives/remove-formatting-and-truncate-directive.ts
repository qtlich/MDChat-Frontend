import {Directive, Input, ElementRef, Renderer2, NgModule} from '@angular/core';
import {TruncateAndSafeHtmlDirective}                      from './truncate-and-safe-html-directive';

@Directive({
             selector: '[appRemoveFormattingAndTruncate]'
           })
export class RemoveFormattingAndTruncateDirective {
  @Input('appRemoveFormattingAndTruncate') set formattedText(value: string) {
    if (value) {
      const maxLength = 100; // Замените на вашу максимальную длину
      const plainText = this.removeFormatting(value).substring(0, maxLength);
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', plainText);
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private removeFormatting(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
}

@NgModule({
            declarations: [RemoveFormattingAndTruncateDirective],
            exports: [RemoveFormattingAndTruncateDirective]
          })
export class RemoveFormattingAndTruncateDirectiveModule
{}
