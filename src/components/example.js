/* global instantsearch algoliasearch */

const search = instantsearch({
    indexName: 'products',
    searchClient: algoliasearch('LORMPDS7KF', 'e57d140e64ebbda1187d9c00dafb6fe9'),
    insights: true,
  });
  
  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#searchbox',
    }),
    instantsearch.widgets.clearRefinements({
      container: '#clear-refinements',
    }),
    instantsearch.widgets.refinementList({
      container: '#brand-list',
      attribute: 'brand',
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: (hit, { html, sendEvent }) => html`
          <div>
            <img src="${hit.image}" align="left" alt="${hit.name}" />
            <div class="hit-name">
              ${hit.name}
            </div>
            <div>
              <button
                onclick="${() => sendEvent('click', hit, 'my-click-event')}"
              >
                Click event
              </button>
              <button
                onclick="${() =>
                  sendEvent('conversion', hit, 'my-conversion-event')}"
              >
                Conversion event
              </button>
            </div>
          </div>
        `,
      },
    }),
    instantsearch.widgets.pagination({
      container: '#pagination',
    }),
  ]);
  
  search.start();
  