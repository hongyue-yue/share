# js 自我实现原生方法

1. 自己实现一个 promise

   简单

   ```
    class Mypromise{
      constructor(cb){
        this.done=null
        this.fail=null
        cb(this.resolve,this.reject)
      }
      then(done,fail){
       this.done=done
       if(fail){
        this.fail=fail
       }
      }
      resolve(value){
         setTimeout(()=>{
           this.done(value)
         })
      }
      reject(value){
        if (!this.fail) return
        setTimeout(() => {
          this.fail(value)
        })
      }
    }
   ```

   复杂

   ```
     function Promise(fn){
        var state = 'pending';
        var doneList = [];
        var failList= [];
       this.then = function(done ,fail){
         switch(state){
           case "pending":
           doneList.push(done);
           //每次如果没有推入fail方法，我也会推入一个null来占位
           failList.push(fail || null);
           return this;
           break;
          case 'fulfilled':
            done();
            return this;
            break;
          case 'rejected':
            fail();
            return this;
            break;
        }
       }
       function resolve(newValue){
          state = "fulfilled";
          setTimeout(function(){
            var value = newValue;
            for (var i = 0;i<doneList.length;i++){
              var temp = doneList[i](value);
              if(temp instanceof Promise){
                  var newP =  temp;
                  for(i++;i<doneList.length;i++){
                     newP.then(doneList[i],failList[i]);
                 }
              }else{
                 value = temp;
              }
           }
         },0);
       }
       function reject(newValue){
         state = "rejected";
         setTimeout(function(){
           var value = newValue;
           var tempRe = failList[0](value);
           //如果reject里面传入了一个promise，那么执行完此次的fail之后将剩余的done和fail传入新的promise中
            if(tempRe instanceof Promise){
              var newP = tempRe;
              for(i=1;i<doneList.length;i++){
                  newP.then(doneList[i],failList[i]);
              }
            }else{
              //如果不是promise，执行完当前的fail之后，继续执行doneList
              value =  tempRe;
              doneList.shift();
              failList.shift();
              resolve(value);
            }
          },0);
        }
       fn(resolve,reject);
    }
   ```

2. 订阅发布模式

   ```
     class Event{
        constructor() {
          this.handler={}
        }
        addEventListener(type,fun){
          if(handler[type]){
            this.handler[type].push(fun)
          }else{
            this.handler[type]=[fun]
          }
        }
        dispatchEvent(type,params){
           if(!handler[type].length==0){
             return new Error("")
           }else{
             this.handler[type].forEach(item=>{
               item(params)
             })
           }
        }
        removeEventListener(type,fun){
           if(!fun){
             delete this.handler[type]
           }else{
             let index=this.handler[type].findIndex(item=>item===fun)
             this.handler[type].splice(index,1)
           }
        }
      }
   ```

3. 自我实现一个 call 函数

   ```
     Function.prototype.myCall=function(context,...arg){
         context=context||window;
         context.fn=this
         let result=context.fn(...arg)
         delete context.fn
         return result
     }
   ```

4. 自我实现一个 bind 函数
   ```
    Function.prototype.myBind=function(context,...arg){
        let fun=this;
        return function F(...params){
            if(fun instanceof F){
                return new func(...arg,...params)
            }
            return fun.apply(context,[...arg,...params])
        }
    }
   ```
5. 自我实现 reduce
   ```
     Array.prototype.myReduce=function(cb,pre){
      for(let i=0;i<this.length;i++){
         if(typeof pre==='undefined'){
             pre=cb(this[i],this[i+1],i+1,this)
         }else{
             pre=cb(pre,this[i+1,i,this])
         }
      }
      return pre
   }
   ```
6. 自定义 new 操作符
   ```
     function new(Con,...arg){
       let obj={}
       Object.setPrototypeOf(obj,Con.prototype)
       let result=Con.apply(obj,arg)
       return result instanceof Object?result:obj
     }
   ```
7. 自定义一个链表类
   ```
     class ListNode{
        constructor(){
            this.head=null
            this.length=0
        }
        createNode(element){
            return {
                element:element,
                next:null
            }
        }
        append(ele){
            let newNode=this.createNode(ele)
            if(this.head==null){
                this.head=newNode
            }else{
                let current=this.head
                while(current.next){
                    current=current.next
                }
                current.next=newNode
            }
            this.length++
        }
        insert(position,ele){
            if(position<0||position>this.length) return false
            let newNode=this.createNode(ele)
            let current=this.head
            let pre=null
            let index=0
            if(position==0){
                this.head=newNode
                newNode.next=current
            }else{
                while(index<position){
                    pre=current
                    current=current.next
                    index++
                }
                pre.next=newNode
                newNode.next=current
            }

        }
        removeAt(position){
            if(position<0||position>this.length) return false
            let current=this.head
            let pre=null
            let index=0
            if(position==0){
                this.head=current.next
            }else{
                while(index<position){
                    pre=current
                    current=current.next
                    index++
                }
                pre.next=current.next
            }
        }
        indexOf(ele){
            let index=0
            let current=this.head
            while(current){
                if(current.element==element){
                    return index
                }
                current=current.next
                index++
            }
            return -1
        }
    }
   ```
