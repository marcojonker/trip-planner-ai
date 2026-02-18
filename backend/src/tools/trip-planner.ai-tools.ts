import { Agent } from '@openai/agents';
import { AiTools } from './ai-tools.interface';

export class TripPlannerAiTools extends AiTools {
  public static buildTools(): AiTools {
    return new TripPlannerAiTools().createTools();
  }

  protected createTools(): AiTools {
    this.addAiTool('start-address-resolver', new Agent({
      name: 'trip planner assistant',
      instructions: `You are a personal assistant that looks up the start tries to resolve the start location from a question. 
                     The address should be formatted like this: street, city, country.`,
    }).asTool({ toolName: 'start-address-resolver' }));

    this.addAiTool('task-extractor', new Agent({
      name: 'trip planner assistant',
      instructions: `You are a personal assistant that can generate a list of tasks that the questioner wants to do. 
                     A task must be related to location that the questioner wants to visit.`,
    }).asTool({ toolName: 'task-extractor' }));

    this.addAiTool('location-selector', new Agent({
      name: 'trip planner assistant',
      instructions: `You are a personal assistant that can lookup the nearest location to fullfill the task. Make sure that to 
                        select a location that is nearby the start location. And that the location really exists at the location.
                     Only return on location for one task.
                     You returns the name of the location, street, housenumber, and city and a 200 word reason for selecting 
                     the location and opening hours and one alternative. The alternative location must also contain a street
                     housenumber, city, name and a reason of max 200 words. The alternative cannot be a previous returned location`,
    }).asTool({ toolName: 'location-selector' }));
    return this;
  }
}
