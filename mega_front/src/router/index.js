import {createRouter, createWebHistory} from 'vue-router';
import Index from "@/components/PagePrincipal/Index.vue";
import ProductDescription from "@/components/produtos/ProductDescription.vue";
import Recommendation from "@/components/produtos/Recommendation.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Index
    },
    {
        path : '/product/:medCode',
        name : 'Product',
        component: ProductDescription
    },
    {
        path : '/recommendation',
        name : 'Recommendation',
        component: Recommendation
    }
]

const router = createRouter({
    history : createWebHistory(),
    routes
})

export default router;