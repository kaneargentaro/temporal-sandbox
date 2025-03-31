import { proxyActivities, log, sleep } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { TranslationWorkflowInput, TranslationWorkflowOutput } from './shared';

const { translateTerm } = proxyActivities<typeof activities>({
  startToCloseTimeout: '45 seconds',
});

export async function sayHelloGoodbyeWorkflow(input: TranslationWorkflowInput): Promise<TranslationWorkflowOutput> {
  log.info(`The workflow function has been evoked`, { "name": input.name })

  const helloInput = {
    term: 'Hello',
    languageCode: input.languageCode,
  };

  log.debug(`Executing translateTerm for hello`, {"languageCode": input.languageCode})
  const helloResult = await translateTerm(helloInput);
  const helloMessage = `${helloResult.translation}, ${input.name}`;

  log.debug(`Sleeping between translation calls`)
  await sleep("10 seconds");

  const goodbyeInput = {
    term: 'Goodbye',
    languageCode: input.languageCode,
  };

  log.debug(`Executing translateTerm for goodbye`, {"languageCode": input.languageCode})
  const goodbyeResult = await translateTerm(goodbyeInput);
  const goodbyeMessage = `${goodbyeResult.translation}, ${input.name}`;

  return { helloMessage, goodbyeMessage };
}
