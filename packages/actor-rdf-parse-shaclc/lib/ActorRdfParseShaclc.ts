import type {
  IActionRdfParse,
  IActorRdfParseFixedMediaTypesArgs,
  IActorRdfParseOutput,
} from '@comunica/bus-rdf-parse';
import {
  ActorRdfParseFixedMediaTypes,
} from '@comunica/bus-rdf-parse';
import type { IActionContext } from '@comunica/types';
import { wrap } from 'asynciterator';
import { parse } from 'shaclc-parse';

/**
 * A comunica SHACL Compact Syntax RDF Parse Actor.
 */
export class ActorRdfParseShaclc extends ActorRdfParseFixedMediaTypes {
  /**
   * @param args -
   *   \ @defaultNested {{
   *       "text/shaclc": 1.0
   *     }} mediaTypePriorities
   *   \ @defaultNested {{
   *       "text/shaclc": "http://www.w3.org/ns/formats/Shaclc"
   *     }} mediaTypeFormats
   *   \ @defaultNested {false} isW3CRecommended
   */
  public constructor(args: IActorRdfParseFixedMediaTypesArgs) {
    super(args);
  }

  public async runHandle(action: IActionRdfParse, mediaType: string, context: IActionContext):
  Promise<IActorRdfParseOutput> {
    return { data: <any> wrap(toString(action.data).then(str => parse(str))), metadata: { triples: true }};
  }
}

function toString(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((res, rej) => {
    let str = '';
    stream.on('data', chunk => {
      str += chunk;
    });
    stream.on('end', () => res(str));
    stream.on('error', rej);
  });
}