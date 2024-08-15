import {createRouter, createWebHistory} from 'vue-router';
import Index from "@/components/PagePrincipal/Index.vue";
import ProductDescription from "@/components/produtos/ProductDescription.vue";
import Recommendation from "@/components/produtos/Recommendation.vue";
import CarrinhoProduct from "@/components/produtos/CarrinhoProduct.vue";
import AddProduct from "@/components/admin/AddProduct.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Index
    },
    {
        path: '/search',
        name: 'Search',
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
    },
    {
        path : '/shopping',
        name : 'Shopping',
        component: CarrinhoProduct
    },
    {
        path : '/addProduct',
        name : 'Add Product',
        component: AddProduct
    }
]

const router = createRouter({
    history : createWebHistory(),
    routes
})

export default router;