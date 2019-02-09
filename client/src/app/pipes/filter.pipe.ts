import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], inputString: string): any[] {
    if (inputString === '') {
      return items;
    }
    return items.filter(item => item.name.search(new RegExp(inputString, 'i')) !== -1);
   }
}
