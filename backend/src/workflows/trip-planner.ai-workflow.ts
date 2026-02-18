import { Agent, run } from '@openai/agents';
import { taskFeatureCollectionSchema } from '../models/task-feature-collection.schema';
import { TaskFeatureCollection } from '../models/task-feature-collection.model';

import { GoogleAiTools } from '../tools/google.ai-tools';
import { TripPlannerAiTools } from '../tools/trip-planner.ai-tools';
import { TripPlannerAiGuardrails } from '../guardrails/trip-planner.ai-guardrails';

export class TripPlannerAiWorkflow {
  private planningManager: any;

  public static createAiWorkflow(): TripPlannerAiWorkflow {
    return new TripPlannerAiWorkflow().buildAiWorkflow();
  }

  private constructor() {
  }

  public buildAiWorkflow(): TripPlannerAiWorkflow {
    const googleAiTools = GoogleAiTools.buildTools(process.env.GOOGLE_MAPS_API_KEY || '');
    const tripPlannerAiTools = TripPlannerAiTools.buildTools();
    const tripPlannerAiGuardrails = TripPlannerAiGuardrails.buildGuardrails();

    this.planningManager = new Agent({
      name: 'Trip planner manager',
      instructions: `You are a trip planner manager your goal is to find out the most optimal route to let the questionair 
                     visit all the locations to fullfill al the tasks.
                    If there is no start coordinate then try to retrieve the start address with start-address-resolver tool 
                    and use the google-geocoder-tool to resolve the coordinate.
                    If there is a coordinate the use the google-reverse-geocode tool to retrieve the address of the start 
                    location.
                    Then create a list of things to do with the task-resolver tool.
                    For each of the task find a nearby location using the location-selector tool then validate if the location (not the alternative) exists using the google-validate-location tool.
                    If the location does not exist try again to find a new location with the location-selector tool up to 3 times.
                    For each found location and it's alternative try ones to get the coordinates using the google-geocoder tool. 
                    Use the get-distance tool to calculate the distance to each location and alternative location from the start locations keep the nearest location to full fill the task.
                    Finally provide a routeplan with the start location as first location and the locations to visit ordered by distance. 
                    No other information than the list of planned location should be returned`,
      tools: [...tripPlannerAiTools.getAiTools(), ...googleAiTools.getAiTools()],
      inputGuardrails: [...tripPlannerAiGuardrails.getAiGuardrails()],
      outputType: taskFeatureCollectionSchema
    });
    return this;
  }

  public async ask(question: string): Promise<TaskFeatureCollection | string> {
    const result = await run(
      this.planningManager,
      question,
    );

    return new Promise((resolve) => { 
      if (!result.finalOutput) {
        throw new Error('No final output from planning manager');
      } else {
        resolve(result.finalOutput as TaskFeatureCollection);
      }
    });
  }
}
