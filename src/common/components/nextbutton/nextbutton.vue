<template>
    <div class="next-button">
        {{next}}
    </div>

</template>

<script>
    export default {
        props: {
            next: {
                type: String,
                default: '下一步'
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .next-button {
        height: 2.2rem;
        line-height: 2.2rem;
        border-radius: 0.25rem;
        font-size: 0.9rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        background: #FF6600;
    }

</style>
