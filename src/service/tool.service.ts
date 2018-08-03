import { Injectable }from '@angular/core';
import { Http }from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()

export class ToolService{
    constructor(private http:Http){

    }
    loadJSON(url:string, success:Function, fail?:Function){
        this.getJSON(url).subscribe(data => {
            success.call(this, data);
        }, error => {
            (fail)?fail.call(this, error):console.log(error);
        });
    }
    private getJSON(url:string):Observable <any>{
        return this.http.get(url).map((res:any) => res.json());
    }
    hexToRgbA(hex:string){
        var c:any;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.5)';
        }
        throw new Error('Bad Hex');
    }
    offsetOfElement(element:any) {
        var rect:any = element.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }
    scrollPositionOfElement(element:any){
        var scrollTop:number = element.scrollTop;
        var scrollLeft:number = element.scrollLeft;
        return { scrollTop: scrollTop, scrollLeft: scrollLeft };
    }
    getOffsetLeft( elem:any ){
        var offsetLeft = 0;
        do {
            if ( !isNaN( elem.offsetLeft ) ){
                offsetLeft += elem.offsetLeft;
            }
        } while( elem = elem.offsetParent );
        return offsetLeft;
    }
    getOffsetTop( elem:any ){
        var offsetTop = 0;
        do {
            if ( !isNaN( elem.offsetTop ) ){
                offsetTop += elem.offsetTop;
            }
        } while( elem = elem.offsetParent );
        return offsetTop;
    }
    

    isIEBrowser(ver?:boolean){
        // Get IE or Edge browser version
        var version:any = this.detectIE();
        if (version === false) {
            //console.log('Non IE');
            return false;
        } else if (version >= 12) {
            //console.log('Edge ' + version);
            if(ver){
                return version;
            }else{
                return true;
            }
        } else {
            //console.log('IE ' + version);
            if(ver){
                return version;
            }else{
                return true;
            }
        }
    }
    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */
    private detectIE() {
        var ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …

        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        
        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        
        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }
}