import React from 'react';
import PropTypes from 'prop-types';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
import JahiaSearchAPIConnector, {Field, FieldType} from '@jahia/search-ui-jahia-connector';
import {SearchProvider, WithSearch} from '@elastic/react-search-ui';
import SearchView from './SearchView';

let fields = [
    new Field(FieldType.HIT, 'link'),
    new Field(FieldType.HIT, 'displayableName', 'title'),
    new Field(FieldType.HIT, 'excerpt', null, true),
    new Field(FieldType.HIT, 'score'),
    new Field(FieldType.HIT, 'lastModified'),
    new Field(FieldType.HIT, 'lastModifiedBy'),
    new Field(FieldType.HIT, 'createdBy'),
    new Field(FieldType.HIT, 'created'),
    new Field(FieldType.HIT, 'nodeType'),
    new Field(FieldType.NODE, 'poster_path'),
    new Field(FieldType.NODE, 'tagline'),
    new Field(FieldType.NODE, 'release_date'),
    new Field(FieldType.NODE, 'vote_average'),
    new Field(FieldType.NODE, 'vote_count'),
    new Field(FieldType.NODE, 'popularity'),
    new Field(FieldType.NODE, 'image'),
    new Field(FieldType.NODE, 'description'),
    new Field(FieldType.NODE, 'name'),
    new Field(FieldType.NODE, 'overview')
];

function configureConnector(dxContext) {
    let connector = new JahiaSearchAPIConnector({
        apiToken: 'none',
        baseURL: dxContext.baseURL + dxContext.ctx,
        siteKey: dxContext.siteKey,
        language: dxContext.language,
        workspace: dxContext.workspace === 'default' ? 'EDIT' : 'LIVE'
    });
    return {
        searchQuery: {
            // eslint-disable-next-line camelcase
            result_fields: fields,
            facets: {
                'jgql:categories_path': {
                    type: 'value',
                    disjunctive: true,
                    max: 50,
                    hierarchical: true,
                    rootPath: ''
                },
                // eslint-disable-next-line camelcase
                industryCat_path: {
                    type: 'value',
                    disjunctive: true,
                    max: 50,
                    hierarchical: true,
                    rootPath: '/companies'
                },
                'jcr:lastModifiedBy': {
                    type: 'value',
                    disjunctive: true
                }, // Term Facet
                'jcr:tags': {
                    type: 'value',
                    disjunctive: true
                },
                // Term Facet
                'jcr:keywords': {
                    type: 'value',
                    disjunctive: true
                },
                // Date Range Facet
                'jcr:lastModified': {
                    type: 'date_range',
                    disjunctive: false,
                    ranges: [
                        {
                            from: 'now-1w',
                            to: 'now',
                            name: 'Last Week'
                        },
                        {
                            from: 'now-1M',
                            to: 'now-1w',
                            name: 'Last month'
                        },
                        {
                            from: 'now-6M',
                            to: 'now-1M',
                            name: 'Last 6 months'
                        },
                        {
                            from: 'now-1y',
                            to: 'now-6M',
                            name: 'Last year'
                        },
                        {
                            from: 'now-5y',
                            to: 'now-1y',
                            name: 'Last 5 years'
                        }
                    ]
                }
            },
            conditionalFacets: {
                'jcr:lastModifiedBy': filters => filters.filters.some(filter => filter.field === 'jcr:lastModified')
            }
        },
        autocompleteQuery: {
            results: {
                resultsPerPage: 10,
                // eslint-disable-next-line camelcase
                result_fields: fields
            }
        },
        apiConnector: connector,
        hasA11yNotifications: true,
        alwaysSearchOnInitialLoad: true
    };
}

const App = ({dxContext}) => {
    return (
        <SearchProvider config={configureConnector(dxContext)}>
            <WithSearch mapContextToProps={({wasSearched, results, searchTerm}) => ({wasSearched, results, searchTerm})}>
                {SearchView}
            </WithSearch>
        </SearchProvider>
    );
};

App.propTypes = {
    dxContext: PropTypes.object
};

export default App;

