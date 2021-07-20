import React from 'react';
import {GET_PRODUCT} from '../GraphQL/productGraphQL.js';
import {useQuery} from '@apollo/client';
import PropTypes from 'prop-types';
// Import Category from './Category';
import gqlConfig from '../../../gql.config';
import {
    makeStyles,
    Card,
    CardMedia,
    CardContent,
    Typography, Grid, Button, Link
} from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import LocalOfferTwoToneIcon from '@material-ui/icons/LocalOfferTwoTone';

const Product = props => {
    const uuid = props.uuid;
    const url = props.url;
    const classes = useStyles();

    const variables = Object.assign(gqlConfig.gqlConfig, {uuid: uuid});
    const {loading, error, data} = useQuery(GET_PRODUCT, {
        variables: variables
    });

    const [product, setProduct] = React.useState([]);

    React.useEffect(() => {
        if (loading === false && data) {
            const productNode = data.response.product;
            let item = [];
            item = {
                uuid: productNode.uuid,
                title: productNode.productId,
                name: productNode.name && productNode.name.value,
                description: productNode.description && productNode.description.value,
                categories: productNode.categories && productNode.categories.nodes,
                image: productNode.descendants && productNode.descendants.nodes
            };
            setProduct(item);
        }
    }, [loading, data]);

    if (loading) {
        return <img src="https://via.placeholder.com/512x256/09f/fff?text=Loading" width="50px" alt="loading"/>;
    }

    if (error) {
        return <p>Error ${error}</p>;
    }

    return (
        <Grid item xs>
            <Link
                className={classes.link}
                to={url}
            >
                <Card className={classes.root}>
                    <CardActionArea>
                        {product.image && product.image.map(img => {
                            const uri = '/files/live' + (img.path);
                            return (
                                <CardMedia
                                    key={product.title}
                                    className={classes.media}
                                    image={uri}
                                    title={product.title}
                                />
                            );
                        })}

                        <CardContent>
                            {product.title && !url && (
                                <Typography className={classes.title}>
                                    {product.name}
                                </Typography>
                            )}
                            {product.title && url && (
                                <Typography className={classes.title}>
                                    <a dangerouslySetInnerHTML={{__html: product.name}}
                                       className="sui-result__title sui-result__title-link"
                                       href={url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                    />
                                </Typography>
                            )}

                            <Typography variant="body2" color="textSecondary" component="p">
                                <div
                                    dangerouslySetInnerHTML={{__html: product.description ? product.description.substring(0, 200) + ' ...' : ''}}/>
                            </Typography>

                        </CardContent>
                    </CardActionArea>
                    <CardActions>

                        <div className={classes.root}>
                            <Grid container spacing={6}>
                                <Grid item xs={9}>
                                    <Typography variant="body1" color="textSecondary" component="p">
                                        {product.categories && product.categories.map(cat => {
                                            return (
                                                <span key={cat.uuid}> <LocalOfferTwoToneIcon/> {cat.value}</span>
                                            );
                                        })}

                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>

                                    <Button id={product.title}
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                const productToAdd = {
                                                    uuid: product.uuid,
                                                    pimid: product.title,
                                                    qty: 1
                                                };
                                                window._jsc_.addToCart(productToAdd);
                                            }}
                                    >
                                        Add to Cart
                                    </Button>

                                </Grid>
                            </Grid>
                        </div>
                    </CardActions>
                </Card>
            </Link>
        </Grid>
    );
};

Product.propTypes = {
    uuid: PropTypes.string,
    url: PropTypes.string
};
const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 20,
        flexGrow: 1
    },
    media: {
        height: 150,
        backgroundSize: 'contain'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    },
    h6: {
        textTransform: 'capitalize'
    },
    title: {
        textTransform: 'capitalize'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    },
    titleItemRight: {
        top: '50%',
        height: 30,
        float: 'right',
        position: 'relative',
        transform: 'translateY(-50%)'
    }
}));
export default Product;
