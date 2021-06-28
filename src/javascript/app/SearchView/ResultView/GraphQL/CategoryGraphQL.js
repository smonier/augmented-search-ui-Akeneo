import {gql} from '@apollo/client';

export const GET_CATEGORY = gql`

query getCategory($workspace: Workspace!, $uuid: String!, $language: String!) {
    response: jcr(workspace: $workspace) {
        category: nodeById(uuid: $uuid) {
            title: displayName(language: $language)

        }
    }
}`;
