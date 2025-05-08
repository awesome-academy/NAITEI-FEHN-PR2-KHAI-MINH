<template>
    <div>
        <h1>User Layout</h1>

        <NuxtPage />
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
        <NuxtLink to="/products">Products</NuxtLink>
        <NuxtLink to="/products/1">Product 1</NuxtLink>
        <main class="container mx-auto px-4 py-8">
            <slot />
        </main>
    </div>
</template>