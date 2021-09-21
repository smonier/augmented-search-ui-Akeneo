import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment';
import ProductDetail from './Components/ProductDetail';
import NewsImg from './Components/NewsImg';

import {Grid} from '@material-ui/core';

function getFieldType(result, field, type) {
    if (result[field]) {
        return result[field][type];
    }
}

function getRaw(result, field) {
    return getFieldType(result, field, 'raw');
}

function getSnippet(result, field) {
    return getFieldType(result, field, 'snippet');
}

function htmlEscape(str) {
    if (!_.isEmpty(str)) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    return '';
}

function getEscapedField(result, field) {
    // Fallback to raw values here, because non-string fields
    // will not have a snippet fallback. Raw values MUST be html escaped.
    const safeField =
        getSnippet(result, field) || htmlEscape(getRaw(result, field));
    return Array.isArray(safeField) ? safeField.join(', ') : safeField;
}

function getEscapedFields(result) {
    return Object.keys(result).reduce((acc, field) => {
        return {...acc, [field]: getEscapedField(result, field)};
    }, {});
}

// Inner date component
const DateComponent = ({result}) => {
    const lastModifiedBy = getEscapedField(result, 'lastModifiedBy');
    const lastModifiedDate = getEscapedField(result, 'lastModified');
    const createdBy = getEscapedField(result, 'createdBy');
    const createdDate = getEscapedField(result, 'created');

    if (lastModifiedBy && lastModifiedDate) {
        return (
            <li>
                <h6 style={{color: '#8b9bad'}}>Modified
                    by <i>{lastModifiedBy}</i> on <i>{moment(lastModifiedDate).format('LLL')}</i>
                </h6>
            </li>
        );
    }

    if (createdBy && createdDate) {
        return (
            <li>
                <h6 style={{color: '#8b9bad'}}>Modified
                    by <i>{createdBy}</i> on <i>{moment(createdDate).format('LLL')}</i>
                </h6>
            </li>
        );
    }

    return null;
};

DateComponent.propTypes = {
    result: PropTypes.object
};

const Movie = ({movie}) => {
    return (
        <div style={{
            minHeight: '300px',
            maxHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly'
        }}
        >
            <img src={getRaw(movie, 'poster_path')} style={{maxHeight: '150px'}}/>
            <div style={{maxWidth: '500px', minWidth: '500px'}}>
                <a href={getRaw(movie, 'link').replace('localhost', 'localhost:8080')}><h2
                    dangerouslySetInnerHTML={{__html: getEscapedField(movie, 'title') + '<span style="font-size: medium; margin-left: 5px">(<i>' + getEscapedField(movie, 'popularity') + '</i>)</span>'}}/>
                </a>
                <h4 dangerouslySetInnerHTML={{__html: getEscapedField(movie, 'tagline')}}/>
                <p
                    dangerouslySetInnerHTML={{__html: getEscapedField(movie, 'overview')}}
                    style={{fontSize: 'smaller', maxHeight: '200px'}}/>
                <span><em>Released:</em>&nbsp;
                    <i>{moment(getEscapedField(movie, 'release_date')).format('LL')}</i>
                </span>
                <span style={{marginLeft: '10px'}}>
                    <em>Rating</em>&nbsp;
                    <i>{getEscapedField(movie, 'vote_average')}/10 ({getEscapedField(movie, 'vote_count')}&nbsp; votes!!)</i>
                </span>
            </div>
        </div>
    );
};

Movie.propTypes = {
    movie: PropTypes.object.isRequired
};

const Product = ({product}) => {
    const uuid = getRaw(product, 'id');
    const url = getRaw(product, 'link').replace('localhost', 'localhost:8080');

    return (
        <Grid container spacing={3}>
            <ProductDetail uuid={uuid} url={url}/>
        </Grid>
    );
};

Product.propTypes = {
    product: PropTypes.object.isRequired
};
const News = ({news, key}) => {
    const uuid = getRaw(news, 'id');

    return (
        <div key={key}
             className="sui-result px-5"
        >
            <div style={{
                minHeight: '300px',
                maxHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly'
            }}
            >
                <NewsImg uuid={uuid}/>
                <div style={{maxWidth: '500px', minWidth: '500px'}}>
                    <a href={getRaw(news, 'link').replace('localhost', 'localhost:8080')}><h2
                        dangerouslySetInnerHTML={{__html: getEscapedField(news, 'title')}}/>
                    </a>
                    <p
                        dangerouslySetInnerHTML={{__html: getEscapedField(news, 'excerpt')}}
                        style={{fontSize: 'smaller', maxHeight: '200px'}}/>
                </div>
            </div>
            <div><DateComponent result={news}/></div>
        </div>
    );
};

News.propTypes = {
    news: PropTypes.object.isRequired,
    key: PropTypes.string
};
const ResultView = ({key, titleField, urlField, result}) => {
    const fields = getEscapedFields(result);
    const title = getEscapedField(result, titleField);
    const url = getRaw(result, urlField);
    const type = getRaw(result, 'nodeType');

    if (type === 'jnt:movie') {
        console.log(result);
        return (<Movie movie={result}/>);
    }

    if (type === 'pimnt:product') {
        console.log(result);
        return (<Product product={result}/>);
    }

    if (type === 'jnt:news') {
        console.log(result);
        console.log(getRaw(result, 'lastModifiedBy'));
        return (<News news={result}/>);
    }

    return (
        <div key={key}
             className="sui-result"
        >
            <ul className="sui-result__details">
                <li>
                    <div className="sui-result__header">
                        {title && !url && (
                            <span
                                dangerouslySetInnerHTML={{__html: title}}
                                className="sui-result__title"
                            />
                        )}
                        {title && url && (
                            <a dangerouslySetInnerHTML={{__html: title}}
                               className="sui-result__title sui-result__title-link"
                               href={url}
                               target="_blank"
                               rel="noopener noreferrer"
                            />
                        )}
                    </div>
                </li>
                <li>
                    <div className="sui-result__body">
                        <ul className="sui-result__details">
                            <li>
                                <span
                                    dangerouslySetInnerHTML={{__html: fields.excerpt}}
                                    className="sui-result__value"/>
                            </li>
                            <DateComponent result={result}/>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    );
};

ResultView.propTypes = {
    key: PropTypes.string,
    titleField: PropTypes.string,
    urlField: PropTypes.string,
    result: PropTypes.object
};

export default ResultView;
