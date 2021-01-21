import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: 'was9nyja',
    dataset: 'production',
    useCdn: true,
});

type Slug = string;

type Author = {
    name: string;
    slug: Slug;
}

type Post = {
    name: string;
    slug: Slug;
    author: Author;

}

export default client;