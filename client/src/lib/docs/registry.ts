import { DocPage } from "./types";
import { introductionPages } from "./content/introduction";
import { gettingStartedPages } from "./content/getting-started";
import { agentsChatPage } from "./content/agents-chat";
import { agentsToolCallingPage } from "./content/agents-tool-calling";
import { agentsApplicationPage } from "./content/agents-application";
import { agentsExplorerPage } from "./content/agents-explorer";
import { toolsListDirectoryPage } from "./content/tools-list-directory";
import { toolsSearchFilesPage } from "./content/tools-search-files";
import { toolsReadFilePage } from "./content/tools-read-file";
import { toolsGoogleSearchPage } from "./content/tools-google-search";
import { toolsCodeExecutionPage } from "./content/tools-code-execution";
import { toolsUrlContextPage } from "./content/tools-url-context";
import { architecturePages } from "./content/architecture";
import { cliPages } from "./content/cli";
import { securityPage } from "./content/security";

export const allDocPages: DocPage[] = [
  ...introductionPages,
  ...gettingStartedPages,
  agentsChatPage,
  agentsToolCallingPage,
  agentsApplicationPage,
  agentsExplorerPage,
  toolsListDirectoryPage,
  toolsSearchFilesPage,
  toolsReadFilePage,
  toolsGoogleSearchPage,
  toolsCodeExecutionPage,
  toolsUrlContextPage,
  ...architecturePages,
  ...cliPages,
  securityPage,
];

const docMap = new Map<string, DocPage>();
for (const page of allDocPages) {
  docMap.set(page.slug, page);
}

export function getDocBySlug(slug: string | string[]): DocPage | undefined {
  const normalizedSlug = Array.isArray(slug) ? slug.join("/") : slug;
  return docMap.get(normalizedSlug);
}

export function getAllSlugs(): string[] {
  return allDocPages.map((page) => page.slug);
}
