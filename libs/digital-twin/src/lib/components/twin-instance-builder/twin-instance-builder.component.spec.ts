import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ManageModelsService } from '@tributech/catalog-api';
import { DialogService, TrackByPropertyModule } from '@tributech/core';
import { TwinsService } from '@tributech/twin-api';
import { AngularSplitModule } from 'angular-split';
import { MockModule } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { LoadService } from '../../services/load.service';
import { TwinQuery } from '../../services/store/twin.query';
import { TwinService } from '../../services/store/twin.service';
import { RelationshipFormModule } from '../relationship-data-form/relationship-data-form.module';
import { TwinFormModule } from '../twin-data-form/twin-data-form.module';
import { TwinGraphModule } from '../twin-graph/twin-graph.module';
import { TwinTreeModule } from '../twin-tree/twin-tree.module';
import { OFFLINE_MODE } from './twin-builder.settings';
import { TwinInstanceBuilderComponent } from './twin-instance-builder.component';

describe('TwinInstanceBuilderComponent', () => {
  let spectator: Spectator<TwinInstanceBuilderComponent>;
  const createComponent = createComponentFactory({
    component: TwinInstanceBuilderComponent,
    imports: [
      RouterTestingModule,
      HttpClientModule,
      MockModule(TwinFormModule),
      MockModule(RelationshipFormModule),
      MockModule(MatButtonModule),
      MockModule(TwinTreeModule),
      MockModule(TwinGraphModule),
      MockModule(AngularSplitModule),
      MockModule(MatIconModule),
      MockModule(TrackByPropertyModule),
    ],
    providers: [
      mockProvider(ManageModelsService, {
        getAllEntities: () => EMPTY,
      }),
      mockProvider(LoadService, {
        loadRemoteBaseModels: () => Promise.resolve(),
      }),
      {
        provide: OFFLINE_MODE,
        useValue: true,
      },
    ],
    mocks: [TwinService, TwinsService, TwinQuery, DialogService],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
