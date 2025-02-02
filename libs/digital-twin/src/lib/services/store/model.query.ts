import { Injectable } from '@angular/core';
import { EntityActions, QueryEntity } from '@datorama/akita';
import {
  context,
  ExpandedInterface,
  expandInterface,
  getChildrenVertices,
  hasNoIncomingRelationships,
  Interface,
  REL_TARGET_ANY,
} from '@tributech/self-description';
import { JsonldGraph } from 'jsonld-graph';
import { ModelState, ModelStore } from './model.store';

@Injectable({ providedIn: 'root' })
export class ModelQuery extends QueryEntity<ModelState> {
  private modelGraph: JsonldGraph;

  constructor(protected store: ModelStore) {
    super(store);
    this.initialize();
  }

  getTwinDefinition(id: string) {
    return this.getEntity(id);
  }

  getTwinDefinitions() {
    return this.getAll();
  }

  getTwinGraphModelWithParents(modelId: string): ExpandedInterface[] {
    const vertices: ExpandedInterface[] = [];
    const vertex = this.modelGraph.getVertex(modelId);

    if (!vertex) return [];

    vertices.push(expandInterface(vertex));

    if (!vertex?.hasIncoming('dtmi:dtdl:property:extends;2')) {
      return vertices;
    }

    vertices.push(
      ...getChildrenVertices(vertex).map((v) => expandInterface(v))
    );

    return vertices;
  }

  getTwinGraphModel(modelId: string): ExpandedInterface {
    const model = this.modelGraph.getVertex(modelId);
    return expandInterface(model);
  }

  getTwinGraphModels(): ExpandedInterface[] {
    const models = this.modelGraph
      .getVertices()
      .filter((x) => x.isType('dtmi:dtdl:class:Interface;2'))
      .items();

    return models.map((model) => expandInterface(model));
  }

  getRootModels(): ExpandedInterface[] {
    const models = this.modelGraph
      .getVertices()
      .filter((x) => x.isType('dtmi:dtdl:class:Interface;2'))
      .items();

    const roots = models.filter((x) => hasNoIncomingRelationships(x));

    return roots.map((m) => expandInterface(m));
  }

  getTwinGraphModelsForIds(modelIds: string[]): ExpandedInterface[] {
    if (!modelIds) return [];
    return modelIds.map((id) => this.getTwinGraphModel(id));
  }

  getInvolvedRelationships(sourceModelId: string, targetModelId?: string) {
    const sourceModel = this.getTwinGraphModel(sourceModelId);
    if (targetModelId) {
      const targetModel = this.getTwinGraphModel(targetModelId);
      return sourceModel.relationships.filter(
        (x) =>
          x.target === REL_TARGET_ANY ||
          x.target === targetModelId ||
          targetModel.bases.some((y) => y === x.target)
      );
    }
    return sourceModel?.relationships || [];
  }

  private initialize() {
    if (!this.modelGraph) {
      const models = this.getAll();
      // Load contexts/vocabulary
      this.modelGraph = new JsonldGraph();
      this.modelGraph.addContext('dtmi:dtdl:context;2', context);

      this.selectEntityAction(EntityActions.Add).subscribe(
        (modelIds: string[]) => {
          const models = modelIds.map((modelId: string) =>
            this.getEntity(modelId)
          );
          this.loadModelsIntoGraph(models);
        }
      );

      this.selectEntityAction(EntityActions.Update).subscribe(
        (modelIds: string[]) => {
          const models = modelIds.map((modelId: string) =>
            this.getEntity(modelId)
          );
          this.loadModelsIntoGraph(models);
        }
      );

      this.selectEntityAction(EntityActions.Remove).subscribe(
        (modelIds: string[]) => {
          modelIds.map((modelId: string) => this.removeTwinGraphModel(modelId));
        }
      );

      if (models.length > 0) {
        this.loadModelsIntoGraph(models);
      }
    }
  }

  private loadModelsIntoGraph(models: Interface[]) {
    return this.modelGraph.parse(models, { contexts: context['@context'] });
  }

  private removeTwinGraphModel(modelId: string) {
    const model = this.modelGraph.getVertex(modelId);
    if (model) {
      this.modelGraph.removeVertex(model);
    }
  }
}
