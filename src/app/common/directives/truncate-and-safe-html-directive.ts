import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Directive, ElementRef, Input, NgModule, OnChanges, Renderer2, SecurityContext, SimpleChanges} from "@angular/core";

@Directive({
             selector: '[appTruncateAndSafeHtml]'
           })
export class TruncateAndSafeHtmlDirective implements OnChanges
{
  @Input() appMaxCharacters: number = 100;

  constructor(private sanitizer: DomSanitizer,
              private el: ElementRef,
              private renderer: Renderer2)
  {
  }

  private _appTruncateAndSafeHtml: string = '';

  get appTruncateAndSafeHtml(): string
  {
    return this._appTruncateAndSafeHtml;
  }

  @Input() set appTruncateAndSafeHtml(value: string)
  {
    this._appTruncateAndSafeHtml = value;
    this.updateHtml();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.appTruncateAndSafeHtml)
    {
      this.updateHtml();
    }
  }

  private updateHtml()
  {
    const truncatedText =this.appMaxCharacters>0?this.appTruncateAndSafeHtml && this.appTruncateAndSafeHtml.slice(0, this.appMaxCharacters).concat('...'):this.appTruncateAndSafeHtml;
    const sanitizedHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(truncatedText);
    const sanitizedValue = this.sanitizer.sanitize(SecurityContext.HTML, sanitizedHtml);
    this.el.nativeElement.innerHTML = sanitizedValue || '';
  }
}

@NgModule({
            declarations: [TruncateAndSafeHtmlDirective],
            exports: [TruncateAndSafeHtmlDirective]
          })
export class TruncateAndSafeHtmlDirectiveModule
{}
