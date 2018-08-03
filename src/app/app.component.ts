import { Component, ViewChild, ViewChildren, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { ToolService } from '../service/tool.service';
import { trigger,  state, style, animate, transition } from '@angular/animations';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('saveStatus', [
      state('appear', style({
        opacity:'1'
      })),
      state('disappear',   style({
        opacity:'0'
      })),
      state('hide',   style({
        display:'none'
      })),
      transition('appear => disappear', animate('500ms ease-in')),
      transition('disappear => appear', animate('500ms ease-out'))
    ])
  ]
})
export class AppComponent {
  @ViewChild('textHolder') textHolder: ElementRef;
  @ViewChild('textContainer') textContainer: ElementRef;
  @ViewChild('hilightContainer') hilightContainer: ElementRef;
  @ViewChild('outlineMarkContainer') outlineMarkContainer: ElementRef;
  @ViewChild('save') save: ElementRef;

  title: string = 'app';
  selectionAppData:any = {};
  loading: boolean = true;
  saveStatus:string = 'hide';
  documentName: string = 'document-1';
  selectedDocumentName: string = this.documentName;
  tagSchemaName: string = 'schema-1';
  selectedTagSchemaName: string = this.tagSchemaName;
  totalLoadCount:number = 0;
  innerHTMLFromJSON: string = '';
  tagSchemaDataFromJSON: Array<object> = [];
  saveSelections: Array<object> = [];
  saveSelectionForOutline: Array<object> = [];
  saveSelectionForHilight: Array<object> = [];
  mouseDownCheck: boolean = false;
  captureStartSelectionPositionOnce: boolean = true;

  documentList: Array<string> = ['document-1', 'document-2', 'document-3', 'document-4', 'document-5', 'document-6', 'document-7', 'document-8', 'document-9', 'document-10'];
  tagSchemaList: Array<string> = ['vibgyor', 'schema-1', 'schema-2', 'schema-3', 'schema-4', 'schema-5'];

  innerHTML: string = '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n\
                      <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n\
                      <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>';

  tagSchemaDataDefault: any = [
    {
      "id": "1",
      "name": "AliceBlue",
      "colorName": "AliceBlue",
      "colorCode": "#F0F8FF"
    },
    {
      "id": "2",
      "name": "AntiqueWhite",
      "colorName": "AntiqueWhite",
      "colorCode": "#FAEBD7"
    },
    {
      "id": "3",
      "name": "Aqua",
      "colorName": "Aqua",
      "colorCode": "#00FFFF"
    },
    {
      "id": "4",
      "name": "Aquamarine",
      "colorName": "Aquamarine",
      "colorCode": "#7FFFD4"
    },
    {
      "id": "5",
      "name": "Azure",
      "colorName": "Azure",
      "colorCode": "#F0FFFF"
    },
    {
      "id": "6",
      "name": "Beige",
      "colorName": "Beige",
      "colorCode": "#F5F5DC"
    },
    {
      "id": "7",
      "name": "Bisque",
      "colorName": "Bisque",
      "colorCode": "#FFE4C4"
    },
    {
      "id": "8",
      "name": "BlanchedAlmond",
      "colorName": "BlanchedAlmond",
      "colorCode": "#FFEBCD"
    },
    {
      "id": "9",
      "name": "Blue",
      "colorName": "Blue",
      "colorCode": "#0000FF"
    },
    {
      "id": "10",
      "name": "BlueViolet",
      "colorName": "BlueViolet",
      "colorCode": "#8A2BE2"
    }
  ];

  /**
   * position adjust variables...
   */
  adjustCoordinatesForOutline: any = {
    x: 11,
    y: 19,
    width: 4,
    height: 4,
    multiline: 20
  };
  adjustCoordinatesForHilight: any = {
    //x:0.5, //if no border...
    x: 11, //if having border...
    y: 19,
    width: 4,
    height: 4,
    multiline: 20
  };

  constructor(private renderer: Renderer2, private toolService: ToolService) { };
  //ngOnChanges(){ console.log('ngOnChanges'); };
  ngOnInit() {
    //console.log('ngOnInit');
    /*this.renderer.listen(this.save.nativeElement,'click',(event:Event)=>{
      alert('HAI');
    });*/
    if(localStorage && localStorage.getItem('selection_app_data')){
      this.selectionAppData = JSON.parse(localStorage.getItem('selection_app_data'));
      this.selectedDocumentName = this.selectionAppData.selectedDocumentName;
      this.selectedTagSchemaName = this.selectionAppData.selectedTagSchemaName;
    }else{
      this.selectedDocumentName = this.selectionAppData.selectedDocumentName = 'document-1';
      this.selectedTagSchemaName = this.selectionAppData.selectedTagSchemaName = 'vibgyor';
      this.storeAppData(this.selectionAppData);
    }
    ////this.loading = false;
    this.loadDocumentData(this.selectedDocumentName);
    this.loadTagSchemaData(this.selectedTagSchemaName);
  };
  //ngDoCheck(){ console.log('ngDoCheck'); };
  //ngAfterContentInit(){ console.log('ngAfterContentInit'); };
  //ngAfterContentChecked(){ console.log('ngAfterContentChecked'); };
  //ngAfterViewInit() { console.log('ngAfterViewInit'); };
  //ngAfterViewIChecked() { console.log('ngAfterViewIChecked'); };

  loadDocumentData(documentName: string, callback?:Function) {
    this.documentName = documentName;
    var url: string = 'assets/data/' + documentName + '.json';
    this.loading = true;
    this.toolService.loadJSON(url, (data) => {
      //console.log(data);
      this.innerHTMLFromJSON = this.convertStringToHTML(data.text);
      this.totalLoadCount++;
      this.allInitialLoadingDone(this.totalLoadCount);
      (callback)?callback.call(this, data):'';
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }, (error) => {
      console.error(error, 'So default text loaded');
      this.documentName = null;
      this.innerHTMLFromJSON = this.innerHTML;
      this.totalLoadCount++;
      this.allInitialLoadingDone(this.totalLoadCount);
      (callback)?callback.call(this, error):'';
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
  }

  loadTagSchemaData(tagSchemaName: string, callback?: Function) {
    this.tagSchemaName = tagSchemaName;
    var url: string = 'assets/data/' + tagSchemaName + '.json';
    this.loading = true;
    this.toolService.loadJSON(url, (data) => {
      //console.log(data);
      this.tagSchemaDataFromJSON = JSON.parse(JSON.stringify(data.schema));
      this.totalLoadCount++;
      this.allInitialLoadingDone(this.totalLoadCount);
      (callback)?callback.call(this, data):'';
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }, (error) => {
      console.error(error, 'So default tag-schema loaded');
      this.tagSchemaName = null;
      this.tagSchemaDataFromJSON = JSON.parse(JSON.stringify(this.tagSchemaDataDefault));
      this.totalLoadCount++;
      this.allInitialLoadingDone(this.totalLoadCount);
      (callback)?callback.call(this, error):'';
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
  }

  allInitialLoadingDone(loadCount:number){
    (loadCount>=2)?this.retriveSelectionsFromDataPersistance(this.documentName, this.tagSchemaName):'waiting for another load';
  }

  retriveSelectionsFromDataPersistance(documentName:string, tagSchemaName:string){
    var uniqueIdToStore:string = String(documentName+'_'+tagSchemaName);
    //console.log(uniqueIdToStore);
    if (localStorage && localStorage.getItem && localStorage.getItem(uniqueIdToStore)) {
      var objectAsString: string = localStorage.getItem(uniqueIdToStore);
      this.saveSelectionForHilight = JSON.parse(objectAsString);
    }
  }

  storeSelectionsToDataPersistance(documentName:string, tagSchemaName:string, selectionData:any){
    var uniqueIdToStore:string = String(documentName+'_'+tagSchemaName);
    if (localStorage && localStorage.setItem) {
      var objectAsString: string = JSON.stringify(selectionData);
      localStorage.setItem(uniqueIdToStore, objectAsString);
    }
  }
  emptySelectionsFromDataPersistance(documentName:string, tagSchemaName:string, selectionData?:any){
    var uniqueIdToStore:string = String(documentName+'_'+tagSchemaName);
    if (localStorage && localStorage.setItem) {
      var objectAsString: string = JSON.stringify((selectionData)?selectionData:JSON.parse('[]'));
      localStorage.setItem(uniqueIdToStore, objectAsString);
    }
  }

  saveSelectionsInStorage(event: Event) {
    this.storeSelectionsToDataPersistance(this.documentName, this.tagSchemaName, this.saveSelectionForHilight);
    this.saveStatus = 'appear';
  }

  animationDone(event:Event){
    if(this.saveStatus==='appear'){
      this.saveStatus = 'disappear';
    }else{
      this.saveStatus = 'hide';
    }
  }

  convertStringToHTML(text: string) {
    var splitText: any = text.split('\n');
    var newTextWithParaTag: string = '';
    splitText.map((element, index) => {
      newTextWithParaTag = newTextWithParaTag + '<p>' + element + '</p>';
    });
    return newTextWithParaTag;
  }

  hilightSelectedText(event: Event, colorCode: string) {
    if (this.saveSelections instanceof Array && this.saveSelections.length > 0) {
      this.saveSelections = this.saveSelections.map((data:any, index:number) => {
        data['color'] = this.toolService.hexToRgbA(colorCode);
        return data;
      });
      this.saveSelectionForHilight = this.saveSelectionForHilight.concat(this.saveSelections.slice(0));
    } else {
      console.log('saveSelections array is empty');
    }
    this.saveSelections = this.saveSelectionForOutline = [];
  }

  manipulateStyleForSpan(outline: any, adjustCoordinates: any) {
    var coordinates: any = (outline && outline.coordinates) ? outline.coordinates : null;
    var style: any = (outline && outline.style) ? outline.style : null;
    if (coordinates && style) {
      return this.adjustStyleValues(coordinates, style, adjustCoordinates);
    } else {
      console.error('coordinates and style were not available in outline object');
      return {};
    }
  }

  adjustStyleValues(coordinates: any, style: any, adjustCoordinates: any) {
    var top = String(parseInt(style.top) - adjustCoordinates.y) + 'px';
    var left = String(parseInt(style.left) - adjustCoordinates.x) + 'px';
    var width = String(parseInt(style.width) + adjustCoordinates.width) + 'px';
    var height = String(parseInt(style.height) + adjustCoordinates.width) + 'px';
    var position = style.position;

    return {
      top: top,
      left: left,
      width: width,
      height: height,
      position: position
    };
  }

  removeSelection(selectionObject: any) {
    if (window.getSelection && window.getSelection()) {
      window.getSelection().removeAllRanges();
    } else {
      console.error('error in remove selection, please check');
    }
  }

  collectRequiredDataFromSelectionObject(selectionObject: any) {
    var selectionText: string = selectionObject.toString();
    var range: any = selectionObject.getRangeAt(0);
    var coordinates: any = range.getBoundingClientRect();

    console.log(coordinates.top,coordinates.left,coordinates.width,coordinates.height);

    var selectionPosX: number = coordinates.x;
    var selectionPosY: number = coordinates.y;
    var selectionWidth: number = coordinates.width;
    var selectionHeight: number = coordinates.height;
    var selectionTop: number = coordinates.top;
    var selectionRight: number = coordinates.right;
    var selectionBottom: number = coordinates.bottom;
    var selectionLeft: number = coordinates.left;

    var coordinates:any = JSON.parse(JSON.stringify({
      x:selectionPosX,
      y:selectionPosY,
      width:selectionWidth,
      height:selectionHeight,
      top:selectionTop,
      right:selectionRight,
      bottom:selectionBottom,
      left:selectionLeft
    }));

    var element:any = this.textHolder.nativeElement;

    var offset:any = this.toolService.offsetOfElement(element);
    var positionOfParentX: number = offset.left;
    var positionOfParentY: number = offset.top;

    //var offset:any = {left:this.toolService.getOffsetLeft(element), top:this.toolService.getOffsetTop(element)};
    //var positionOfParentX: number = offset.left;
    //var positionOfParentY: number = offset.top;

    var scrollPosition:any = this.toolService.scrollPositionOfElement(element);
    var scrollTopPositionOfParent: any = scrollPosition.scrollTop;
    var scrollLeftPositionOfParent: any = scrollPosition.scrollLeft;

    //console.log(selectionPosX, positionOfParentX, scrollLeftPositionOfParent);

    var top = String(((selectionPosY) - positionOfParentY + scrollTopPositionOfParent) + 'px');
    var left = String(((selectionPosX) - positionOfParentX + scrollLeftPositionOfParent) + 'px');
    var width = String((selectionWidth) + 'px');
    var height = String((selectionHeight) + 'px');
    var position = String('absolute');
    var multiline = null;
    var startPointCoordinates: any = { x: null, y: null };
    if (selectionHeight > 30) {
      multiline = true;
      startPointCoordinates = JSON.parse(JSON.stringify(this.findStartPointOfSelection()));
    } else {
      multiline = false;
      startPointCoordinates.x = startPointCoordinates.y = null;
    }
    var style: any = {
      top: top,
      left: left,
      width: width,
      height: height,
      position: position
    }
    return {
      selectionText: selectionText,
      coordinates: coordinates,
      style: style,
      multiline: multiline,
      startSelectionPosition: startPointCoordinates
    };
  }

  mouseDownOnTextHolder(event: Event) {
    this.mouseDownCheck = true;
  }

  mouseUpOnTextHolder(event: Event) {
    this.mouseDownCheck = false;
    this.captureStartSelectionPositionOnce = true;
    var selectionObject: any = getSelection();
    if (selectionObject && selectionObject.toString() !== '') {
      var requiredData: any = this.collectRequiredDataFromSelectionObject(selectionObject);
      //console.log('requiredData', JSON.stringify(requiredData));
      this.saveSelections.push(requiredData);
      this.saveSelectionForOutline = this.saveSelections.slice(0);
      this.removeSelection(selectionObject);
    } else {
      //console.log('selection is empty');
    }
  }

  mouseMoveOnTextHolder(event:Event) {
    if (this.mouseDownCheck) {
      var selectionObject: any = getSelection();
      if (selectionObject && selectionObject.toString() !== '' && this.captureStartSelectionPositionOnce) {
        this.captureStartSelectionPositionOnce = false;
      }
    }
  }

  findStartPointOfSelection() {
    var storeInnerHTML: string = this.innerHTML;
    var sel, range, text;
    var docObj: any = document;
    var getSelection: any = window.getSelection;
    if (getSelection && getSelection().toString() !== '') {
      sel = window.getSelection();
      text = sel.toString();

      var leftText: string = text.charAt(0);
      leftText = (leftText === '') ? '&nbsp;' : leftText;
      var rightText: string = text.substr(1, text.length);

      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        var element: any = document.createElement('span');
        element.innerHTML = leftText;//text;
        element.setAttribute('id', 'to-take-position');
        //range.insertNode(element);
        range.insertNode(document.createTextNode(rightText));
        range.insertNode(element);

        var element:any = document.getElementById('to-take-position');
        var offset:any = this.toolService.offsetOfElement(element);
        var selectionPosX: number = offset.left;
        var selectionPosY: number = offset.top;

        var element:any = this.textHolder.nativeElement;
        var offset:any = this.toolService.offsetOfElement(element);
        var positionOfParentX: number = offset.left;
        var positionOfParentY: number = offset.top;

        var scrollPosition:any = this.toolService.scrollPositionOfElement(element);
        var scrollTopPositionOfParent: any = scrollPosition.scrollTop;
        var scrollLeftPositionOfParent: any = scrollPosition.scrollLeft;

        var y = ((selectionPosY) - positionOfParentY + scrollTopPositionOfParent);
        var x = ((selectionPosX) - positionOfParentX + scrollLeftPositionOfParent);
        //console.log(x,y);

        range.deleteContents();
        range.insertNode(document.createTextNode(text));

        this.textContainer.nativeElement.innerHTML = this.innerHTMLFromJSON;

        return {
          x: x,
          y: y
        };
      }
    } else if (docObj.selection && docObj.selection.createRange) {
      console.error('please check for non support');
      range = docObj.selection.createRange();
      range.text = '';//replacementText
    } else {
      console.error('some thing went wrong');
    }
    return {
      x: null,
      y: null
    };
  }

  clearAllOutlines(event: Event) {
    this.saveSelectionForOutline = this.saveSelections = [];
  }

  testingClick(event: Event) {
    //console.log('testingClick',event);
  }

  deleteSelectionsInStorage(event: Event) {
    this.emptySelectionsFromDataPersistance(this.documentName, this.tagSchemaName);
    this.saveSelectionForHilight = this.saveSelectionForOutline = this.saveSelections = [];
  }

  resetForNewDocumentAndSchemaCombination(){
    this.saveSelections = this.saveSelectionForOutline = this.saveSelectionForHilight = [];
  }

  storeAppData(selectionAppData:any){
    if(localStorage && localStorage.setItem){
      var objectString:string = JSON.stringify(selectionAppData);
      localStorage.setItem('selection_app_data', objectString);
    }
  }

  setDocument(documentName: string) {
    //console.log(documentName);
    this.resetForNewDocumentAndSchemaCombination();
    this.loadDocumentData(documentName, ()=>{
      this.retriveSelectionsFromDataPersistance(this.documentName, this.tagSchemaName);
    });
    this.selectionAppData.selectedDocumentName = documentName;
    this.selectionAppData.selectedTagSchemaName = this.selectedTagSchemaName;
    this.storeAppData(this.selectionAppData);
  }

  setTagSchema(tagSchemaName: string) {
    //console.log(tagSchemaName);
    this.resetForNewDocumentAndSchemaCombination();
    this.loadTagSchemaData(tagSchemaName, ()=>{
      this.retriveSelectionsFromDataPersistance(this.documentName, this.tagSchemaName);
    });
    this.selectionAppData.selectedTagSchemaName = tagSchemaName;
    this.selectionAppData.selectedDocumentName = this.selectedDocumentName;
    this.storeAppData(this.selectionAppData);
  }
}
