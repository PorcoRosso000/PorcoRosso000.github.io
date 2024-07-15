document.addEventListener('DOMContentLoaded', function () {
  const searchClient = algoliasearch('8FGLQ0B7KR', '8d964420327e4e6c078d2902976294a8');

  const search = instantsearch({
    indexName: 'juzi_dhx',
    searchClient,
    searchFunction(helper) {
      if (helper.state.query === '') {
        document.querySelector('#search-results').innerHTML = '';
        return;
      }
      helper.search();
    },
  });

  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for articles...',
      showReset: false,
      showSubmit: false,
      showLoadingIndicator: false,
    }),
    instantsearch.widgets.hits({
      container: '#search-results',
      templates: {
        item: `
          <div>
            <a href="{{ permalink }}">{{{ _highlightResult.title.value }}}</a>
            <p>{{{ _highlightResult.content.value }}}</p>
          </div>
        `,
        empty: 'No results.',
      },
    })
  ]);

  search.start();
});
