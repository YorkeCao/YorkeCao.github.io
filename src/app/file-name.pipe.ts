import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(filename: string, args?: any): string {
    return filename.substring('00 '.length, filename.length - '.md'.length);
  }

}
