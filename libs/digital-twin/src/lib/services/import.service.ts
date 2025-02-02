import { Injectable } from '@angular/core';
import { Interface, TwinGraph } from '@tributech/self-description';
import { ModelService } from './store/model.service';
import { RelationshipService } from './store/relationship.service';
import { TwinService } from './store/twin.service';

@Injectable({ providedIn: 'root' })
export class ImportService {
  constructor(
    private modelService: ModelService,
    private twinService: TwinService,
    private relationshipService: RelationshipService
  ) {}

  importModels(models: Interface[]) {
    if (!models || models?.length === 0) {
      return;
    }
    this.modelService.addModels(models);
  }

  importInstances(twin: TwinGraph) {
    if (!twin?.digitalTwins || twin?.digitalTwins.length === 0) {
      return;
    }
    if (!twin?.relationships && twin?.relationships?.length === 0) {
      return;
    }

    this.twinService.addTwins(twin?.digitalTwins);
    this.relationshipService.addRelationships(twin?.relationships);
  }
}
