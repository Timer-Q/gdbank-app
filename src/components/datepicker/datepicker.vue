<template>
	<div class="mask" v-show="showDate" @touchend.self="cancel">
		<div class="center">
			<div class="header">{{currentValue}}</div>
			<div class="content" ref="lists">
				<div class="date-items">
					<div class="date-item">
						<div class="item" :class="{'active':year == currentYear}" v-for="year in yearRange" :key="year">{{year}}</div>
					</div>
				</div>
				<div class="date-items">
					<div class="date-item">
						<div class="item" :class="{'active':month == currentMonth}"  v-for="month in monthRange" :key="month">{{month}}</div>
					</div>
				</div>
				<div class="date-items">
					<div class="date-item">
						<div class="item" :class="{'active':day == currentDay}"  v-for="day in dayRange" :key="day">{{day}}</div>
					</div>
				</div>
				<div class="highlist">
					<div class="light"></div>
					<div class="light"></div>
					<div class="light"></div>
				</div>
			</div>
			<div class="bottom-btns">
				<div class="bottom-btns-item" @touchend="cancel">{{cancelText}}</div>
				<div class="bottom-btns-item" @touchend="confirm">{{confirmText}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		props: {
			showDate: Boolean,
			startDate: {
				type: Date,
				default() {
					return new Date(new Date().getFullYear() - 10, 0, 1);
				}
			},
			endDate: {
				type: Date,
				default() {
					return new Date(new Date().getFullYear() + 10, 11, 31);
				}
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			confirmText: {
				type: String,
				default: '确定'
			}
		},
		data() {
			return {
				startYear: null,
				endYear: null,
				startMonth: 1,
				endMonth: 12,
		        startDay: 1,
		        endDay: 31,
		        currentYear: null,
		        currentMonth: 1,
		        currentDay: 1,
		        currentValue: null,
		        yearRange: [],
		        monthRange: [],
		        dayRange: [],
		        currentValue: ''
			}
		},
		methods: {
			handleTouchstart(el){},
			handleTouchend(el) {},
			handleTouchmove(el){},
			confirm() {
				this.currentValue = this.getDateValue();
				this.$emit('confirm',this.currentValue);
			},
			getDateValue() {
				let results = this.$refs.lists.querySelectorAll('.active');
				return results[0].innerHTML+'年'+results[1].innerHTML+'月'+results[2].innerHTML+'日';
			},
			cancel() {
				this.$emit('cancel',this.currentValue);
			},
			init() {
				let lists = this.$refs.lists.querySelectorAll('.date-item');
				let vm =this;
				lists.forEach((n,i) => {
					if(i==2){
						let _year = (new Date()).getFullYear();
						let _month = (new Date()).getMonth();
						let num = (new Date(_year,_month+1,0)).getDate();
						vm.createdRange(n,i,vm,num);
					}else {
						vm.createdRange(n,i,vm);
					}
					vm.$nextTick(() => {
						vm.currentValue = vm.getDateValue();
						vm.createdTouchAction(n,i,vm);
					})
				});
			},
			createdRange(el,index,vm,num){
				if(index === 0){
					vm.yearRange = [];
					let sd = vm.startDate.getFullYear();
					let ed = vm.endDate.getFullYear();
					if(num){
						ed = ed < num ? ed : num;
					}
					while (sd <= ed) {
						vm.yearRange.push(sd);
						sd++
					}
				}
				if(index === 1){
					vm.monthRange = [];
					let sm = vm.startDate.getMonth() + 1;
					let em = vm.endDate.getMonth() + 1;
					if(num){
						em = em < num ? em : num;
					}
					while (sm<=em) {
						vm.monthRange.push(sm);
						sm++;
					}
				}
				if(index === 2){
					vm.dayRange = [];
					let sd = vm.startDate.getDate();
					let ed = vm.endDate.getDate();
					if(num){
						ed = ed < num ? ed : num;
					}
					while (sd <= ed) {
						vm.dayRange.push(sd);
						sd++
					}
				}
			},
			createdTouchAction(el,index,vm){
				let curIndex;
				let	itemHeight = this.$refs.lists.querySelector('.item').clientHeight;
				let len = el.querySelectorAll('.item').length;
				let height = el.clientHeight;
				if(el.querySelector('.active')){
					el.querySelectorAll('.item').forEach((n,i) => {
						if(el.querySelector('.active') === n) curIndex = i;
					});
					el.style.webkitTransform ='translate3d(0,'+(curIndex*(-itemHeight))+'px,0)'
				}else{
					el.querySelector('.item').classList.add('active');
				}
				let back = el.style.webkitTransform||0;
					back = parseInt(back === 0?0:el.style.webkitTransform.split(',')[1].slice(0,-2));
				if(back < (-height+itemHeight)){
					el.style.webkitTransform ='translate3d(0,'+(-height+itemHeight)+'px,0)';
					el.querySelector('.active').classList.remove('active');
					el.querySelectorAll('.item')[len-1].classList.add('active');
				}
				let startY,moveY,endY,hasmoveY;
				el.addEventListener('touchstart',function(e){
					let touch = e.targetTouches[0];
					startY = touch.pageY;
					hasmoveY = el.style.webkitTransform||0;
					hasmoveY = parseInt(hasmoveY === 0?0:el.style.webkitTransform.split(',')[1].slice(0,-2));
				},false);
				el.addEventListener('touchmove',function(e){
					let touch = e.targetTouches[0];
					moveY = touch.pageY;
					let distance = hasmoveY+moveY-startY;
					let num = Math.abs(Math.round(distance / itemHeight));
					if(distance<-height+itemHeight) num = len-1;
					if(distance>0) num = 0;
					this.querySelector('.active').classList.remove('active');
					this.querySelectorAll('.item')[num].classList.add('active');
					el.style.webkitTransform = 'translate3d(0,'+distance+'px,0)';
				},false);
				el.addEventListener('touchend',function(e){
					let touch = e.changedTouches[0];
					endY = touch.pageY;
					let distance = hasmoveY+endY - startY;
					let num = Math.abs(Math.round(distance / itemHeight));
					if(distance>0){
						el.style.webkitTransform = 'translate3d(0,0,0)';
					}else if(distance<(-height+itemHeight)){
						el.style.webkitTransform = 'translate3d(0,'+(-height+itemHeight)+'px,0)';
					}else if(Math.abs(distance)>itemHeight/3){
						let length = Math.round(distance / itemHeight) * itemHeight;
						el.style.webkitTransform = 'translate3d(0,'+length+'px,0)';
					}
					if(distance<-height+itemHeight) num = len-1;
					if(distance>0) num = 0;
					this.querySelector('.active').classList.remove('active');
					this.querySelectorAll('.item')[num].classList.add('active');
					if(index<2&&Math.abs(distance)>itemHeight/3){
						let results = vm.$refs.lists.querySelectorAll('.active');
						let _year = results[0].innerHTML;
						let _month =results[1].innerHTML;
						vm.createdRange(vm.$refs.lists.querySelectorAll('.date-item')[2],2,vm,(new Date(_year,_month,0)).getDate());
						vm.$nextTick(() => {
							vm.createdTouchAction(vm.$refs.lists.querySelectorAll('.date-item')[2],2,vm);
							vm.currentValue = vm.getDateValue();
						});
					}
					vm.currentValue = vm.getDateValue();
				},false);
			}
		},
		created() {
			alert(2)
			this.hasCreate = true;
		},
		watch: {
			showDate() {
				if(this.hasCreate){
					let date = new Date();
					this.currentYear = date.getFullYear();
					this.currentMonth = date.getMonth() + 1;
					this.currentDay = date.getDate();
					this.init();
					this.hasCreate = false;
				}
			}
		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.mask{
		position:absolute;
		top:0;
		left:0;
		width:100vw;
		height:100vh;
		z-index:30000;
		overflow:hidden;
		font-size: 0.9rem;
		background-color:rgba(0,0,0,0.5);
		.center{
			position:absolute;
			top:50%;
			left:50%;
			width:92vw;
			height:12rem;
			overflow:hidden;
			transform:translate3d(-50%,-50%,0);
			background-color:#fff;
			text-align:center;
			.header{
				height:2rem;
				line-height:2rem;
				border-bottom:1px solid #ccc;
			}
			.content{
				display:flex;
				position:relative;
				flex:1;
				height:8rem;
				width:100%;
				padding:1rem 10vw;
				color:#ccc;
				.date-items{
					flex:1;
					overflow:hidden;
					.date-item{
						margin-top: 2rem;
						transition: all .2s;
						.item{
							height:2rem;
							line-height:2rem;
							transition:all .2s;
							&.active{
								color:#943EBD;
								font-size: 1rem;
							}
						}
					}
				}
				.highlist{
					position:absolute;
					top:3rem;
					left:10vw;
					display:flex;
					width:72vw;
					height:2rem;
					z-index:-1;
					.light{
						flex:1;
						margin:0 2vw;
						border-top:1px solid #943EBD;
						border-bottom:1px solid #943EBD;
					}
				}
			}
			.bottom-btns{
				display:flex;
				height:2.0rem;
				line-height: 2rem;
				width:100%;
				color:#666;
				border-top:1px solid #ccc;
				&-item{
					flex:1;
					&:first-child{
						border-right:1px solid #ccc;
					}
				}
			}
		}
	}
</style>