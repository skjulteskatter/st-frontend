<template>
    <div id="header-image"></div>
    <div class="container">
        <card class="post">
            <h1>Blog post</h1>
            <i>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet molestias sequi nemo sint culpa, nostrum exercitationem dolorem non! Minus mollitia sit assumenda nostrum nam sed tenetur veniam culpa molestiae animi.</i>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quasi iusto nulla nam molestias pariatur reprehenderit delectus sit praesentium quia! Aliquam dolore fuga praesentium natus atque sapiente voluptatibus explicabo! Ipsam.
            Iusto eaque porro eligendi error! Sunt dignissimos officiis laboriosam doloremque neque explicabo vitae reprehenderit labore libero? Nostrum delectus, itaque aspernatur, impedit voluptatem adipisci iste quisquam ratione explicabo dolor in! Nostrum.
            Consequatur totam, ducimus debitis quo saepe atque, sequi quae amet, eius quos dolores ipsam libero perspiciatis commodi eveniet est. Recusandae atque dolores quas quidem, odit magnam a ipsum. Possimus, expedita?
            Dolorem, recusandae laudantium. Amet corrupti temporibus sapiente repellat! Quidem, cupiditate nam provident dolore aliquid veniam odit consectetur minus consequatur corporis numquam et ad dignissimos impedit similique incidunt ullam quibusdam fugiat!
            Ad soluta magnam earum quod veritatis? Id voluptatum, ut tempore a recusandae perspiciatis quaerat. Aspernatur ducimus totam, dicta dignissimos fugit ea accusantium numquam saepe, labore possimus delectus, sint nostrum nesciunt?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quasi iusto nulla nam molestias pariatur reprehenderit delectus sit praesentium quia! Aliquam dolore fuga praesentium natus atque sapiente voluptatibus explicabo! Ipsam.
            Iusto eaque porro eligendi error! Sunt dignissimos officiis laboriosam doloremque neque explicabo vitae reprehenderit labore libero? Nostrum delectus, itaque aspernatur, impedit voluptatem adipisci iste quisquam ratione explicabo dolor in! Nostrum.
            Consequatur totam, ducimus debitis quo saepe atque, sequi quae amet, eius quos dolores ipsam libero perspiciatis commodi eveniet est. Recusandae atque dolores quas quidem, odit magnam a ipsum. Possimus, expedita?
            Dolorem, recusandae laudantium. Amet corrupti temporibus sapiente repellat! Quidem, cupiditate nam provident dolore aliquid veniam odit consectetur minus consequatur corporis numquam et ad dignissimos impedit similique incidunt ullam quibusdam fugiat!
            Ad soluta magnam earum quod veritatis? Id voluptatum, ut tempore a recusandae perspiciatis quaerat. Aspernatur ducimus totam, dicta dignissimos fugit ea accusantium numquam saepe, labore possimus delectus, sint nostrum nesciunt?</p>
        </card>
    </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import Card from '@/components/Card.vue';

@Options({
    components: {
        Card,
    }
})
export default class BlogPost extends Vue {
    
}
</script>

<style lang="scss">
#header-image {
    width: 100vw;
    height: 30vh;

    background-image: url('https://source.unsplash.com/random');
    background-size: cover;
    background-position: center;

    z-index: 0;
}

.post {
    margin-top: -100px;
    height: 100vh;
    box-shadow: 0 10px 10px rgba(black, .1);
}
</style>