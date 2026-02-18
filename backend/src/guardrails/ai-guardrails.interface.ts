export abstract class AiGuardrails {
    protected aiGuardrails = new Map<string, any>();

    protected abstract createGuardrails(): AiGuardrails;

    protected addAiGuardrails(name: string, guardrail: any) {
        this.aiGuardrails.set(name, guardrail);
    }

    public getAiGuardrails() {
        return this.aiGuardrails.values()
    }

    public getAiGuardrailNames() {
        return Array.from(this.aiGuardrails.keys());
    }

    public getAiGuardrail(name: string) {
        return this.aiGuardrails.get(name);
    }
}
