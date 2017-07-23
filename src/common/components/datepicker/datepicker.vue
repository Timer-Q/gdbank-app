<template>
	<div class="mask" v-show="showDate">
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
						<div class="item" :class="{'active':month == currentMonth}"  v-for="month in monthRange" :key="month">{{month | formatDate}}</div>
					</div>
				</div>
				<div class="date-items">
					<div class="date-item">
						<div class="item" :class="{'active':day == currentDay}"  v-for="day in dayRange" :key="day">{{day | formatDate}}</div>
					</div>
				</div>
				<div class="highlist">
					<div class="light"></div>
					<div class="light"></div>
					<div class="light"></div>
				</div>
			</div>
			<div class="bottom-btns">
				<div class="bottom-btns-item" @touchend.self.stop.prevent="cancel">{{cancelText}}</div>
				<div class="bottom-btns-item" @touchend.self.stop.prevent="confirm">{{confirmText}}</div>
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
			},
			defaultDate: {
				type: Date,
				default() {
					return new Date();
				}
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
		        currentValue: '',
		        cancelValue: '',
		        itemHeight: ''
			}
		},
		methods: {
			confirm() {
        let nowdate = (new Date()).getTime();
        let cDate = (new Date(this.currentValue.split('-')[0],this.currentValue.split('-')[1]-1,this.currentValue.split('-')[2])).getTime();
        console.log(nowdate,cDate)
        if(cDate>nowdate) {
          console.log(11)
          this.currentValue = this.cancelValue;
          let cancelValue = this.cancelValue.split('-')
          let vm = this;
          this.$refs.lists.querySelectorAll('.active').forEach((n,i)=>{
            n.classList.remove('active');
          })
          vm.$nextTick(() => {
            let satrtindex=1,endindex=(new Date(cancelValue[0],cancelValue[1],0)).getDate();
            vm.dayRange = vm.createdRange(satrtindex,endindex)
            vm.$nextTick(() => {

              this.$refs.lists.querySelectorAll('.date-item').forEach((n,i) => {
                let val = cancelValue[i];
                n.querySelectorAll('.item').forEach((j,k)=>{
                  if(j.innerHTML==val){
                    j.classList.add('active');
                  }
                })
                vm.moveToActive(n,cancelValue[i],vm);
                if(i===2){
                  vm.createdTouchAction(n,i,vm)
                }
              })

              this.$emit('confirm',[this.currentValue,1]);
            });
          });
        } else{
          console.log(22)
          this.currentValue = this.getDateValue();
          this.cancelValue = this.currentValue;
          this.$emit('confirm',[this.currentValue,0]);
        }
			},
			getDateValue() {
				let results = this.$refs.lists.querySelectorAll('.active');
				if(results[0]&&results[1]&&results[2]){
					let resMonth = results[1].innerHTML;
					let resDay = results[2].innerHTML;
					return results[0].innerHTML+'-'+resMonth+'-'+resDay;
				}
				return '';
			},
			cancel() {
				this.currentValue = this.cancelValue;
				let cancelValue = this.cancelValue.split('-');
				let vm = this;
				this.$refs.lists.querySelectorAll('.active').forEach((n,i)=>{
					n.classList.remove('active');
				})
				vm.$nextTick(() => {
					let satrtindex=1,endindex=(new Date(cancelValue[0],cancelValue[1],0)).getDate();
					vm.dayRange = vm.createdRange(satrtindex,endindex);
					vm.$nextTick(() => {

						this.$refs.lists.querySelectorAll('.date-item').forEach((n,i) => {
							let val = cancelValue[i];
							n.querySelectorAll('.item').forEach((j,k)=>{
								if(j.innerHTML==val){
									j.classList.add('active');
								}
							})
							vm.moveToActive(n,cancelValue[i],vm);
							if(i===2){
								vm.createdTouchAction(n,i,vm)
						this.$emit('cancel');
							}
						})

					});
				});
			},
			init() {
 				if(this.defaultDate){
 					this.currentYear = this.defaultDate.getFullYear();
					this.currentMonth = this.defaultDate.getMonth()+1;
					this.currentDay = this.defaultDate.getDate();
 				}
				if(this.startDate){
					this.startYear = this.startDate.getFullYear();
					this.startMonth = this.startDate.getMonth()+1;
					this.startDay = this.startDate.getDate();
 				}
				if(this.endDate){
					this.endYear = this.endDate.getFullYear();
					this.endMonth = this.endDate.getMonth()+1;
					this.endDay = this.endDate.getDate();
 				}
			},
			createdRange(satrtindex,endindex){

				let range = [];
				for(let i = satrtindex; i<=endindex;i++){
					range.push(i);
				}
				return range;
			},
			createdTouchAction(el,index,vm){
				let curIndex;
				let	itemHeight = vm.itemHeight;
				let len = el.querySelectorAll('.item').length;
				let height = el.clientHeight;//len*vm.itemHeight;
				if(el.querySelector('.active')){
					el.querySelectorAll('.item').forEach((n,i) => {
						if(el.querySelector('.active') === n) curIndex = i;
					});
					el.style.webkitTransform ='translate3d(0,'+(curIndex*(-itemHeight))+'px,0)'
				}else{
					el.querySelector('.item').classList.add('active');
				}
				/////
				let back = el.style.webkitTransform||0;
					back = parseInt(back === 0?0:el.style.webkitTransform.split(',')[1].slice(0,-2));
				if(back < (-height+itemHeight)){
					el.style.webkitTransform ='translate3d(0,'+(-height+itemHeight)+'px,0)';
					el.querySelector('.active').classList.remove('active');
					el.querySelectorAll('.item')[len-1].classList.add('active');
				}
				////
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
					let num = Math.abs(Math.ceil(distance / itemHeight));
					if(distance<-height+itemHeight) num = len-1;
					if(distance>0) num = 0;
					if(this.querySelector('.active')){
						this.querySelector('.active').classList.remove('active');
					}
					if(this.querySelectorAll('.item')[num]){
						this.querySelectorAll('.item')[num].classList.add('active');
					}
					el.style.webkitTransform = 'translate3d(0,'+distance+'px,0)';
				},false);
				el.addEventListener('touchend',handleEnd,false);
				function handleEnd(e){

					let touch = e.changedTouches[0];
					endY = touch.pageY;
					let distance = hasmoveY+endY - startY;
					let num = Math.abs(Math.ceil(distance / itemHeight));
					if(distance>0){
						el.style.webkitTransform = 'translate3d(0,0,0)';
					}else if(distance<(-height+itemHeight)){
						el.style.webkitTransform = 'translate3d(0,'+(-height+itemHeight)+'px,0)';
					}else if(Math.abs(distance)>itemHeight/3){
						let length = Math.ceil(distance / itemHeight) * itemHeight;
						el.style.webkitTransform = 'translate3d(0,'+length+'px,0)';
					}
					if(distance<-height+itemHeight)num = len-1;
					if(distance>0) num = 0;
					if(this.querySelector('.active')){
						this.querySelector('.active').classList.remove('active');
					}
					if(this.querySelectorAll('.item')[num]){
						this.querySelectorAll('.item')[num].classList.add('active');
					}
					if(index<2&&Math.abs(distance)>itemHeight/3){
						let results = vm.$refs.lists.querySelectorAll('.active');
						let _year = results[0].innerHTML;
						let _month =results[1].innerHTML;
						let satrtindex=1,endindex=(new Date(_year,_month,0)).getDate();
						if(_year==vm.currentYear&&_month==vm.currentMonth){
							satrtindex=vm.startDay;
						}
						vm.currentYear = _year;
						vm.currentMonth =_month;
						vm.currentDay = results[2].innerHTML;
						vm.dayRange = vm.createdRange(satrtindex,endindex);
						vm.$nextTick(() => {

							vm.$refs.lists.querySelectorAll('.date-item')[2].removeEventListener('touchend',handleEnd,false);
							vm.createdTouchAction(vm.$refs.lists.querySelectorAll('.date-item')[2],2,vm);
						});
					}
					vm.currentValue = vm.getDateValue();
				}

			},
			//获取yy，dd的值
			getFormatValue(val){
				return parseInt(val) < 10 ? '0'+val : val;
			},
			//华东到指定值
			moveToActive(el,val,vm){
				let num = 0;
				el.querySelectorAll('.item').forEach((n, i) => {
					if(n.innerHTML==val) {
						num = i;
					}
				})
				el.style.webkitTransform = 'translate3d(0,'+(-num*vm.itemHeight)+'px,0)';
			}
		},
		created() {
			this.$nextTick(() => {
				this.init();
			})
			this.hasCreate=false;
		},
		watch: {
			showDate() {
				if(!this.hasCreate){
					this.$nextTick(() => {
						let lists = this.$refs.lists.querySelectorAll('.date-item');
						let vm =this;
						lists.forEach((n,i) => {
							let value;
							if(i==0){
								vm.yearRange=vm.createdRange(vm.startYear,vm.endYear);
								value = vm.currentYear;
							}else if(i==1){
								vm.monthRange=vm.createdRange(vm.startMonth,vm.endMonth);
								value = vm.currentMonth;
							}else if(i==2){
								let dayNum = (new Date(vm.currentYear,vm.currentMonth,0)).getDate();
								vm.dayRange=vm.createdRange(vm.startDay,dayNum);
								value = vm.currentDay;
							}
							vm.$nextTick(() => {
								vm.itemHeight = vm.$refs.lists.querySelector('.item').clientHeight;
								vm.moveToActive(n,value,vm);
								vm.createdTouchAction(n,i,vm)
							})
						});
						this.$nextTick(() => {
							this.cancelValue = this.getDateValue();
							this.currentValue = this.getDateValue();
						})
					})
					this.hasCreate = true;
				}
			}
		},
		filters:{
			formatDate(val){
				return parseInt(val) < 10 ? '0'+val : val;
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
