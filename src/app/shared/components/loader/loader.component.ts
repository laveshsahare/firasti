import { Component } from '@angular/core';
import { map } from 'rxjs';

import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  standalone: false
})
export class LoaderComponent {
  visible$;

  constructor(private readonly loadingService: LoadingService) {
    this.visible$ = this.loadingService.loading$.pipe(map((count) => count > 0));
  }
}
