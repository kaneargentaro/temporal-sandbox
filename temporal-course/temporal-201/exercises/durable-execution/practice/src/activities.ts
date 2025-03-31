import axios from 'axios';
import * as activity from '@temporalio/activity'

import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  const context = activity.Context.current();

  context.log.info(`Running translate term`, {
    term: input.term,
    langaugeCode: input.languageCode
  });
  const lang = encodeURIComponent(input.languageCode);
  const term = encodeURIComponent(input.term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;

  try {
    const response = await axios.get(url);
    const content = response.data;
    context.log.debug(`Successfully translated`, {
      content: content
    });
    return { translation: content };
  } catch (error: any) {
    if (error.response) {
      context.log.error(`HTTP Error`, {
        status: error.response.status,
        data: error.response.data
      });
      throw new Error(`HTTP Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      context.log.error(`Request Error`, {
        request: error.request
      });
      throw new Error(`Request error:  ${error.request}`);
    }
    context.log.error(`Something else failed during translation.`, error);
    throw new Error('Something else failed during translation.');
  }
}
