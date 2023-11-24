import {Directive, ElementRef, Input, NgModule, OnChanges, Renderer2} from "@angular/core";

@Directive({
             selector: '[truncateText]'
           })
export class TruncateTextDirective implements OnChanges
{
  @Input() maxLength: number = 100;

  constructor(private el: ElementRef, private renderer: Renderer2)
  {
  }

  ngOnChanges()
  {
    this.truncate();
  }

  private truncate()
  {
    const fullText = this.el.nativeElement.innerText;

    if (fullText.length > this.maxLength)
    {
      const truncatedText = fullText.substring(0, this.maxLength) + '...';
      this.renderer.setProperty(this.el.nativeElement, 'innerText', truncatedText);
    }
  }
}

@NgModule({
            declarations: [TruncateTextDirective],
            exports: [TruncateTextDirective]
          })
export class TruncateTextDirectiveModule
{
}
