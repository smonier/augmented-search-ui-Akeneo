import {gql} from '@apollo/client';

export const GET_PRODUCT = gql`
    query getProduct($workspace: Workspace!, $uuid: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            product: nodeById(uuid: $uuid) {
                uuid
                productId: displayName(language: $language)
                name: property(language: $language, name: "name") {
                    value
                }
                description: property(language: $language, name: "description") {
                    value
                }
                categories: property(language: $language, name: "j:defaultCategory") {
                    nodes: refNodes {
                        uuid: uuid,
                        value: displayName
                    }
                }
                descendants(limit: 1, typesFilter: { types: ["jmix:image"] }) {
                    nodes {
                        path
                    }
                }
            }
        }
    }
`;
