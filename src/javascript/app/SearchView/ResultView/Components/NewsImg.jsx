import React from 'react';
import {GET_NEWSIMG} from '../GraphQL/NewsImgGraphQL.js';
import {useQuery} from '@apollo/client';
import PropTypes from 'prop-types';
import gqlConfig from '../../../gql.config';

const NewsImg = ({uuid}) => {
    const variables = Object.assign(gqlConfig.gqlConfig, {uuid: uuid});
    const {loading, error, data} = useQuery(GET_NEWSIMG, {
        variables: variables
    });
    const [img, setImg] = React.useState([]);

    React.useEffect(() => {
        if (loading === false && data) {
            const newsNode = data.response.news;
            let item = [];
            item = {
                image: newsNode.image.refNode.path
            };
            setImg(item);
        }
    }, [loading, data]);

    if (loading) {
        return <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" width="20px" alt="loading"/>;
    }

    if (error) {
        return <p>Error ${error}</p>;
    }

    const uri = '/files/live' + (img.image);

    return (
        <img src={uri} style={{maxHeight: '150px', maxWidth: '150px'}}/>
    );
};

NewsImg.propTypes = {
    uuid: PropTypes.string
};
export default NewsImg;
