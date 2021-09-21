import {gql} from '@apollo/client';

export const GET_NEWSIMG = gql`

    query getNewsImg($workspace: Workspace!, $uuid: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            news: nodeById(uuid: $uuid) {
                uuid
                titre: displayName(language: $language)
                image: property(name: "image") {
                    refNode {
                        path
                    }
                }
            }
        }
    }`;
