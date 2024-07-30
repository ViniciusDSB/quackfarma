import {createRouter, createWebHistory} from 'vue-router';
import Index from "@/components/PagePrincipal/Index.vue";
import ProductDescription from "@/components/produtos/ProductDescription.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Index
    },
    {
        path : '/product/:id',
        name : 'Product',
        component: ProductDescription
    }
]

const router = createRouter({
    history : createWebHistory(),
    routes
})

export default router;