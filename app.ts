import dotenv from "dotenv";

import { TripPlannerAiWorkflow } from './workflows/trip-planner.ai-workflow';

dotenv.config();

const workflow = TripPlannerAiWorkflow.createAiWorkflow();

workflow.ask('I want to buy shoes specially designed for hallux valgus for fashionable people and I need to buy a bread nearby 51.6010502,5.6087735 ?').then((result) => {
  console.log(JSON.stringify(result, null, 2));
}).catch((error: Error) => {
  console.error('Error during workflow execution:', error);
});

