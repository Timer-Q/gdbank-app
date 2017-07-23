<template>
    <div id="g-msgTip" class="hide">
        <div class="tip-wrapper">
            <p class="tip">温馨提示</p>
            <p class="text"></p>
            <p class="confirm">确定</p>
        </div>
    </div>

</template>

<script>
    export default {}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    #g-msgTip {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;

        .tip-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #FFFFFF;
            border-radius: 10px;
            width: 80%;
            font-size: 0.8rem;

            .tip {
                border-bottom: 1px solid #F0F0F0;
                height: 2.5rem;
                line-height: 2.5rem;
                text-align: center;
                color: #333333;
            }

            .text {
                padding: 0 0.5rem;
                border-bottom: 1px solid #F0F0F0;
                min-height: 2.5rem;
                line-height: 2.5rem;
                text-align: center;
                color: #999999;
                font-size: 0.7rem;
            }

            .confirm {
                height: 2.5rem;
                line-height: 2.5rem;
                text-align: center;
                color: #000000;
                font-weight: 600;

                &:active {
                    background-color: #f3e5f5;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                 }
            }
        }

    }


</style>