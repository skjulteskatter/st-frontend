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

export interface Post {
    _id: string;
    name: string;
    slug: string;
    author: Author;
}

class Sanity {
    async getPost(slug: string) {
        return await client.fetch(`*[_type == 'post' && (slug == '${slug}' || _id == '${slug}')][0]{title, slug}`) as Post;
    }
}

const sanity = new Sanity();

export default sanity;