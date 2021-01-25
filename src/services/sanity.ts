import sanityClient from '@sanity/client';
import blocksToHtml from '@sanity/block-content-to-html';

const client = sanityClient({
    projectId: 'was9nyja',
    dataset: 'production',
    useCdn: true,
});

const h = blocksToHtml.h;

const serializers = {
    types: {
        code: (props: any) => (
            h('pre', { className: props.node.language },
                h('code', props.node.code)
            )
        )
    }
}

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

export interface PostPreview {
    _id: string;
    title: string;
    slug: string;
    author: string;
    image: string;
}

class Sanity {
    async getPost(slug: string, languageKey: string) {
        const post = await client.fetch(`*[_type == 'post' && (slug.current == '${slug}' || _id == '${slug}')][0]{'title': title.${languageKey}, slug, 'image': mainImage.asset->url, 'body': body.no}`);

        const el = blocksToHtml({
            blocks: post.body,
            serializers: serializers,
            imageOptions: { width: 500, height: 500, fit: 'max' },
            projectId: 'was9nyja',
            dataset: 'production',
        })

        return { post, body: el }
    }
    async getAllPosts(languageKey: string) {
        return await client.fetch(`*[_type == 'post']{'title': title.${languageKey}, slug, 'image': mainImage.asset->url + '?w=400', 'excerpt': excerpt.${languageKey}}`) as PostPreview[];
    }
}

const sanity = new Sanity();

export default sanity;