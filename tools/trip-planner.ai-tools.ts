import { Agent } from '@openai/agents';
import { AiTools } from './ai-tools.interface';

export class TripPlannerAiTools extends AiTools {
  public static buildTools(): AiTools {
    return new TripPlannerAiTools().createTools();
  }

  protected createTools(): AiTools {
    this.addAiTool('start-address-resolver', new Agent({
      name: 'Creative trip planner assistant',
      instructions: 'You are a personal assistant that looks up the start tries to resolve the start location from a question. The address should be formatted like this: street, city, country.',
    }).asTool({ toolName: 'start-address-resolver' }));

    this.addAiTool('task-extractor', new Agent({
      name: 'Creative trip planner assistant',
      instructions: 'You are a personal assistant that can generate a list of tasks that the questioner want to do. Task must be related to location that need to be visited.',
    }).asTool({ toolName: 'task-extractor' }));

    this.addAiTool('location-selector', new Agent({
      name: 'Creative trip planner assistant',
      instructions: 'You are a personal assistant that can lookup the nearest location for a specific todo. Returns the name of the location, street, housenumber, and city and a 200 word reason for selecting the location and opening hours and one alternative. The alternative cannot be a previous selected location',
    }).asTool({ toolName: 'location-selector' }));
    return this;
  }
}