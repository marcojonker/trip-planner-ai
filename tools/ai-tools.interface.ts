export abstract class AiTools {
    protected aiTools = new Map<string, any>();

    protected abstract createTools(): AiTools;

    protected addAiTool(name: string, tool: any) {
        this.aiTools.set(name, tool);
    }

    public getAiTools() {
        return this.aiTools.values()
    }

    public getAiToolNames() {
        return Array.from(this.aiTools.keys());
    }

    public getAiTool(name: string) {
        return this.aiTools.get(name);
    }
}