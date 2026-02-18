import { InputGuardrail } from '@openai/agents';
import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { AiGuardrails } from './ai-guardrails.interface';

export class TripPlannerAiGuardrails extends AiGuardrails {
  public static buildGuardrails(): AiGuardrails {
    return new TripPlannerAiGuardrails().createGuardrails();
  }

  private constructor() {
    super();
  }

  protected createGuardrails(): AiGuardrails {
    const hasStartLocationAgent = new Agent({
      name: 'Trip planner assistent',
      instructions: `Check if the question contains a start location either as address or as coordinate.
                If there is a start location return true else false.`,
      outputType: z.object({
        hasStartLocation: z.boolean(),
      })
    });

    const hasStartLocationGuardrail: InputGuardrail = {
      name: 'has-start-location',
      runInParallel: false,
      execute: async ({ input, context }) => {
        const result = await run(hasStartLocationAgent, input, { context });
        return {
          outputInfo: result.finalOutput,
          tripwireTriggered: result.finalOutput?.hasStartLocation === false,
        };
      },
    };

    this.addAiGuardrails('has-start-location', hasStartLocationGuardrail);

    return this;
  }
}
