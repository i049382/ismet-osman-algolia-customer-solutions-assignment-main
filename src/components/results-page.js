import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { searchBox, hits, pagination, refinementList } from 'instantsearch.js/es/widgets';

import resultHit from '../templates/result-hit';

/**
 * @class ResultsPage
 * @description Instant Search class to display content on main page
 */
class ResultPage {
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @return {void}
   */
  _registerClient() {
    this._searchClient = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY
    );

    this._searchInstance = instantsearch({
      indexName: process.env.ALGOLIA_INDEX,
      searchClient: this._searchClient,
      insights: true,
    });
  }

  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @return {void}
   */
  _registerWidgets() {
    this._searchInstance.addWidgets([
      searchBox({
        container: '#searchbox',
      }),
      hits({
        container: '#hits',
        templates: {
          item: (hit, { html, sendEvent }) => {
            return resultHit(hit, { html, sendEvent });
          }
        },
      }),
      pagination({
        container: '#pagination',
      }),
      refinementList({
        container: '#brand-facet',
        attribute: 'brand',
        templates: {
          item: (item, { html, sendEvent }) => html`
            <label>
              <input 
                type="checkbox" 
                value="${item.value}" 
                ${item.isRefined ? 'checked' : ''}
                onclick="${() => {
                  sendEvent('click', null, 'Filter_Brand_Selected', {
                    filters: [`brand:${item.value}`],
                    filterType: 'brand'
                  });
                }}"
              >
              ${item.label} (${item.count})
            </label>
          `,
        },
      }),
      refinementList({
        container: '#categories-facet',
        attribute: 'categories',
        templates: {
          item: (item, { html, sendEvent }) => html`
            <label>
              <input 
                type="checkbox" 
                value="${item.value}" 
                ${item.isRefined ? 'checked' : ''}
                onclick="${() => {
                  sendEvent('click', null, 'Filter_Category_Selected', {
                    filters: [`categories:${item.value}`],
                    filterType: 'category'
                  });
                }}"
              >
              ${item.label} (${item.count})
            </label>
          `,
        },
      }),
    ]);
  }

  /**
   * @private
   * Starts instant search after widgets are registered
   * @return {void}
   */
  _startSearch() {
    this._searchInstance.start();
  }
}

export default ResultPage;
