import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], selectedItems: any[]): any[] {
    return items.filter(item => selectedItems.includes(item));
  }

}
