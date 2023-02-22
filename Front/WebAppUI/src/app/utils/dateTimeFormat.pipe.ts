import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateFormatPipe',
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

    static readonly DATE_FMT = 'dd/MM/yyyy';
    static readonly DATE_TIME_FMT = `${DateTimeFormatPipe.DATE_FMT} hh:mm a`;

  override transform(value: any, _args?: any): any {
    return super.transform(value, DateTimeFormatPipe.DATE_FMT);
  }
}