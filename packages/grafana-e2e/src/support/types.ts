import { Selector } from './selector';
import { Url } from './url';
import { e2e } from '../index';
import { SelectorFunction, SelectorObject } from '../noTypeCheck';

export type Selectors = Record<string, string | Function>;
export type PageObjects<S> = { [P in keyof S]: SelectorFunction };
export type PageFactory<S> = PageObjects<S> & SelectorObject<S>;
export interface PageFactoryArgs<S extends Selectors> {
  url?: string;
  selectors: S;
}

export const pageFactory = <S extends Selectors>({ url, selectors }: PageFactoryArgs<S>): PageFactory<S> => {
  const visit = () => e2e().visit(Url.fromBaseUrl(url));
  const pageObjects: PageObjects<S> = {} as PageObjects<S>;
  const keys = Object.keys(selectors);

  keys.forEach(key => {
    const value = selectors[key];
    if (typeof value === 'string') {
      // @ts-ignore
      pageObjects[key] = () => e2e().get(Selector.fromAriaLabel(value));
    }
    if (typeof value === 'function') {
      // @ts-ignore
      pageObjects[key] = (text?: string) => {
        if (!text) {
          return e2e().get(value());
        }
        return e2e().get(Selector.fromAriaLabel(value(text)));
      };
    }
  });

  return {
    visit,
    ...pageObjects,
    selectors,
  };
};
