import {AfterViewInit, Directive, ElementRef, Input, NgModule, Renderer2} from '@angular/core';
import {DomSanitizer}                                                     from '@angular/platform-browser';

@Directive({
             selector: '[CleanHtmlAndTruncate]'
           })
export class CleanHtmlAndTruncateDirective implements AfterViewInit
{
  @Input() text: string = '';
  @Input() maxLength: number = 1000;
  @Input() addDots: boolean = true;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private sanitizer: DomSanitizer)
  {
  }

  ngAfterViewInit()
  {
    const cleanText = this.stripHtmlTags(this.text);
    let truncatedText: string;
    if(cleanText.length > this.maxLength)
    {
      if(this.addDots)
      {
        truncatedText = cleanText.substring(0, this.maxLength) + '...';
      }
      else
      {
        truncatedText = cleanText.substring(0, this.maxLength);
      }
    }
    else
    {
      truncatedText = cleanText;
    }
    // Очищаем содержимое элемента
    this.renderer.setProperty(this.el.nativeElement, 'textContent', truncatedText);
  }

  private stripHtmlTags(text: string): string
  {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.body.textContent || '';
  }
}

@NgModule({
            declarations: [CleanHtmlAndTruncateDirective],
            exports:      [CleanHtmlAndTruncateDirective]
          })
export class CleanHtmlAndTruncateModule {}
