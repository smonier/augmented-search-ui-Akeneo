import React from 'react';
import {GET_CATEGORY} from '../GraphQL/CategoryGraphQL.js';
import {useQuery} from '@apollo/client';
import PropTypes from 'prop-types';
import gqlConfig from '../../../gql.config';

const Category = ({uuid}) => {
    const variables = Object.assign(gqlConfig.gqlConfig, {uuid: uuid});
    const {loading, error, data} = useQuery(GET_CATEGORY, {
        variables: variables
    });
    const [cat, setCat] = React.useState([]);

    React.useEffect(() => {
        if (loading === false && data) {
            const catNode = data.response.category;
            let item = [];
            item = {
                title: catNode.title
            };
            setCat(item);
        }
    }, [loading, data]);

    if (loading) {
        return <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="20px" alt="loading"/>;
    }

    if (error) {
        return <p>Error ${error}</p>;
    }

    return (
        <span> {cat.title} </span>
    );
};

Category.propTypes = {
    uuid: PropTypes.string
};
export default Category;
