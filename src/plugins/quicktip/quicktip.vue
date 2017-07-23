<template>
    <div id="g-quickTip" class="hide">
        <p class="text"></p>
    </div>

</template>

<script>
export default {}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    #g-quickTip {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 10010;
        .text {
            padding: 0.5rem 1rem;
            color: #fff;
            border-radius: 0.3rem;
            display: inline-block;
            font-size: .8rem;
            background-color:rgba(0,0,0,.7);
        }
    }

</style>