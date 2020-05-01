import { Directive, ElementRef, OnInit , Renderer2} from '@angular/core';

@Directive({
  selector: '[cftFundoAmarelo]'
})
export class FundoAmareloDirective implements OnInit{

  constructor(private _elementRef : ElementRef,
              private _renderer : Renderer2) { 
    console.log(_elementRef);
    // this._elementRef.nativeElement.style.backgroundColor = 'red';
    this._renderer.setStyle(this._elementRef.nativeElement,'background-color','yellow')
  }
  ngOnInit(): void {
    
  }

}
