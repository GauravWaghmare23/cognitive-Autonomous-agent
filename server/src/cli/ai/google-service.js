import { google } from "@ai-sdk/google";
import { streamText, stepCountIs, generateObject } from "ai";

import { config } from "../../config/google.config.js";
import chalk from "chalk";

import { explorerConfig } from "../../config/explorer.config.js";

export class AIService {
  constructor() {
    if (!config.googleApiKey) {
      throw new Error(chalk.red("Google API key is not defined"));
    }

    this.model = google(config.model, {
      apiKey: config.googleApiKey,
    });
  }

  async sendMessage(messages, chunks, tools = undefined, onToolCall = null) {
    try {
      const streamConfig = {
        model: this.model,
        messages: messages,
        maxOutputTokens: config.maxOutputTokens,
      };

      if (tools && Object.keys(tools).length > 0) {
        streamConfig.tools = tools;

        streamConfig.stopWhen = stepCountIs(1);

        console.log(
          chalk.dim(`  using tools: ${Object.keys(tools).join(", ")}`),
        );
      }

      const result = streamText(streamConfig);

      let fullResponse = "";

      for await (const chunk of result.textStream) {
        fullResponse += chunk;

        if (chunks) {
          chunks(chunk);
        }
      }

      const toolCalls = [];
      const toolResults = [];

      if (result.steps && Array.isArray(result.steps)) {
        for (const step of result.steps) {
          if (step.toolCalls && step.toolCalls.length > 0) {
            for (const toolCall of step.toolCalls) {
              toolCalls.push(toolCall);

              if (onToolCall) {
                onToolCall(toolCall);
              }
            }
          }

          if (step.toolResults && step.toolResults.length > 0) {
            toolResults.push(...step.toolResults);
          }
        }
      }

      const usage = await result.usage;

      console.log(chalk.yellowBright(`\n    Usage: ${JSON.stringify(usage)}`));

      return {
        content: fullResponse,
        finishResponse: await result.finishReason,
        usage,
        toolCalls,
        toolResults,
        steps: result.steps,
      };
    } catch (error) {
      console.log();

      console.log(
        chalk.red("  ✕ AI service error"),
        chalk.dim(error?.message || error),
      );

      throw error;
    }
  }

  async getMessage(messages, tools = undefined) {
    const result = await this.sendMessage(messages, null, tools);

    return result.content;
  }

  /**
   * Generate structured AI output.
   *
   * @param {Object} schema
   * @param {string} prompt
   * @returns {Promise<Object>}
   */
  async generateStructured(schema, prompt) {
    try {
      const result = await generateObject({
        model: this.model,
        schema,
        prompt,
      });

      return result.object;
    } catch (error) {
      console.log(
        chalk.red("  ✕ Error generating structured output"),
        chalk.dim(error?.message || error),
      );

      throw error;
    }
  }

  /**
   * Generate the next Explorer Agent action.
   */
  async generateExplorerAction(messages) {
    try {
      const result = await generateObject({
        model: this.model,
        schema: explorerConfig.agent.actionSchema,
        system: explorerConfig.agent.systemPrompt,
        messages,
      });

      return {
        action: result.object,
        usage: result.usage,
        finishReason: result.finishReason,
      };
    } catch (error) {
      console.log(
        chalk.red("  ✕ Error generating explorer action"),
        chalk.dim(error?.message || error),
      );

      throw error;
    }
  }
}
