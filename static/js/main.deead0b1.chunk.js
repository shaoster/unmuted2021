(this.webpackJsonpapex2021=this.webpackJsonpapex2021||[]).push([[0],{117:function(e,t){},121:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),s=r(18),c=r.n(s),i=(r(85),r(86),r(79)),o=r(22),d=r(132),u=r(133),l=r(134),j=a.a.createContext({}),h=r(128),f=r(129),b=r(130),y=r(2),p={0:"danger",1:"danger",2:"danger",3:"warning",4:"success",5:"info"};var m=function(){var e=Object(n.useContext)(j),t=e.G,r=e.ctx,a=(e.moves,t.growthMindsetPoints),s=t.money,c=t.attention,i=t.energy;return Object(y.jsxs)(h.a,{responsive:!0,bordered:!0,id:"player-info",children:[Object(y.jsx)("thead",{children:Object(y.jsxs)("tr",{className:"info-label-row",children:[Object(y.jsx)("th",{children:"Day #"}),Object(y.jsx)("th",{children:"Growth Mindset"}),Object(y.jsx)("th",{children:"Money"}),Object(y.jsx)("th",{children:"Attention"}),Object(y.jsx)("th",{children:"Energy"})]})}),Object(y.jsx)("tbody",{children:Object(y.jsxs)("tr",{className:"info-data-row",children:[Object(y.jsx)("td",{children:Object(y.jsx)(f.a,{variant:"dark",children:r.turn})}),Object(y.jsx)("td",{children:Object(y.jsx)(b.a,{now:(100*a/o.c).toPrecision(3),label:a,variant:p[a],animated:a===o.c})}),Object(y.jsx)("td",{children:Object(y.jsx)(f.a,{variant:"warning",children:s})}),Object(y.jsx)("td",{children:Object(y.jsx)(f.a,{variant:"primary",children:c})}),Object(y.jsx)("td",{children:Object(y.jsx)(f.a,{variant:"success",children:i})})]})})]})},O=r(8),g=r(15),x=r(140),C=r(141),v=r(135),w=r(136),N=r(139),k=r(137),M=r(60),P=r(19),E=r(1),T=r(131),A=r(138);function I(e){return e+" "+(e>1?"cards":"card")}var S=function(e){var t=e.description,r=e.runEffect,a=e.className,s=e.passthrough;return Object(n.useEffect)((function(){r&&r()})),Object(y.jsx)(T.a,Object(E.a)(Object(E.a)({id:"keyword-description",className:a},s),{},{children:t}))},D=function(e){var t=e.value,r=e.description,n=e.tooltipClassName,a=e.runEffect;return Object(y.jsx)(A.a,{placement:"right",overlay:function(e){return Object(y.jsx)(S,{description:r,className:n,runEffect:a,passthrough:e})},children:Object(y.jsx)("span",{className:"card-keyword",children:t})})},L=function(e){var t=e.number;return Object(y.jsx)(D,{value:"Discard "+t,description:"Place cards from your hand into your discard pile until you have placed "+I(t)+" or your hand is empty."})},F=function(e){var t=e.number;return Object(y.jsx)(D,{value:"Draw "+t,description:"Place "+I(t)+" from your deck into your hand. If your deck is empty, your discard pile will automatically be shuffled into your deck."})},G=function(e){var t=e.number;return Object(y.jsx)(D,{value:"Forget "+t,description:"Permanently remove cards from your hand until you have removed "+I(t)+" or your hand is empty."})},B=function(){return Object(y.jsx)(D,{value:"Forget Self",description:"Permanently remove this card from your hand upon being played."})},K=function(e){var t=e.cardId,r=e.renderCard,n=e.tooltipClassName,a=e.runEffect,s=r({cardId:t,onClick:function(e){}});return Object(y.jsx)(D,{value:P.a[t].displayName,description:s,tooltipClassName:n,runEffect:a})},H=function(e){var t=e.number;return Object(y.jsx)(D,{value:"+"+t+" Growth Mindset",description:"Growth Mindset represents the number of cards you can draw at the beginning of the next turn. You lose one point per turn, and Growth Mindset is capped at 5."})};function J(e){var t=Object(n.useState)(!1),r=Object(g.a)(t,2),a=r[0],s=r[1],c=e.cardId,i=e.slotId,o=e.onClick,h=e.ref,b=Object(n.useContext)(j).ctx,p=P.a[c],m=p.displayName,O=p.image,v=p.description,w=p.moneyCost,N=p.energyCost,k=p.producesGrowthMindset,E=p.producesMoney,T=p.producesAttention,A=p.producesEnergy,I=p.drawsCards,S=p.discardsCards,D=p.gainsCards,U=p.forgetsSelf,_=p.forgetsCards,R=b.activePlayers&&"discard"===b.activePlayers[b.playOrderPos],V=b.activePlayers&&"forget"===b.activePlayers[b.playOrderPos];return Object(n.useEffect)((function(){Object(M.run)("card-image")})),Object(y.jsxs)(x.a,{ref:h,onClick:function(){return o(i)},onMouseEnter:function(){return s(!0)},onMouseLeave:function(){return s(!1)},bg:R||V?"danger":null,border:a?"warning":"secondary",children:[Object(y.jsx)(x.a.Header,{children:Object(y.jsx)(d.a,{fluid:!0,children:Object(y.jsxs)(u.a,{children:[Object(y.jsx)(l.a,{xs:4,className:"cost-label",children:"Makes:"}),Object(y.jsx)(l.a,{xs:4}),Object(y.jsx)(l.a,{xs:1,children:Object(y.jsx)(f.a,{variant:"warning",children:E})}),Object(y.jsx)(l.a,{xs:1,children:Object(y.jsx)(f.a,{variant:"primary",children:T})}),Object(y.jsx)(l.a,{xs:1,children:Object(y.jsx)(f.a,{variant:"success",children:A})})]})})}),Object(y.jsxs)(x.a.Body,{children:[Object(y.jsx)(x.a.Title,{children:m}),Object(y.jsx)(x.a.Img,{src:null!=O?O:"holder.js/256x128",className:"card-image"}),Object(y.jsxs)(C.a,{className:"extra-rules",children:[k>0&&Object(y.jsx)(C.a.Item,{children:Object(y.jsx)(H,{number:k})},"growth-mindset"),I>0&&Object(y.jsx)(C.a.Item,{children:Object(y.jsx)(F,{number:I})},"draws-cards"),S>0&&Object(y.jsx)(C.a.Item,{children:Object(y.jsx)(L,{number:S})},"discards-cards"),U&&Object(y.jsx)(C.a.Item,{children:Object(y.jsx)(B,{})},"forgets-self"),_>0&&Object(y.jsx)(C.a.Item,{children:Object(y.jsx)(G,{number:_})},"forgets-cards"),D.map((function(e){return Object(y.jsx)(C.a.Item,{children:Object(y.jsx)(K,{cardId:e,renderCard:J,tooltipClassName:"card-preview",runEffect:function(){return Object(M.run)("card-image")}})},"gains-"+e)}))]}),Object(y.jsx)(x.a.Text,{className:"flavor",children:v})]}),Object(y.jsx)(x.a.Footer,{children:Object(y.jsx)(d.a,{fluid:!0,children:Object(y.jsxs)(u.a,{children:[Object(y.jsx)(l.a,{xs:4,className:"cost-label",children:"Costs:"}),Object(y.jsx)(l.a,{xs:4}),Object(y.jsx)(l.a,{xs:1,children:Object(y.jsx)(f.a,{variant:"warning",children:w})}),Object(y.jsx)(l.a,{xs:1}),Object(y.jsx)(l.a,{xs:1,children:Object(y.jsx)(f.a,{variant:"success",children:N})})]})})})]})}function U(e){var t=e.actions,r=e.className,n=e.onClick,a=t.map((function(e,t){return Object(y.jsx)(J,{cardId:e,slotId:t,onClick:n},t)}));return Object(y.jsx)(v.a,{className:"action-list-"+r,children:a.length>0?a:Object(y.jsx)(f.a,{children:Object(y.jsx)("h1",{children:"No Actions Available"})})})}var _=function(){var e=Object(n.useContext)(j),t=e.G,r=e.ctx,a=e.moves,s=t.hand,c=t.actionShop,i=t.deck,o=t.discard,d=function(e){},u=r.activePlayers&&"discard"===r.activePlayers[r.playOrderPos],l=r.activePlayers&&"forget"===r.activePlayers[r.playOrderPos],h={Hand:{actions:s,onClick:u?a.discardAction:l?a.forgetAction:a.performAction},Shop:{actions:c,onClick:u?d:a.buyAction},Deck:{actions:Object(O.a)(i).sort(),onClick:d},"Discard Pile":{actions:o,onClick:d}},f=Object(n.useState)("Hand"),b=Object(g.a)(f,2),p=b[0],m=b[1],x=Object.keys(h).map((function(e){return Object(y.jsx)(w.a,{eventKey:e,title:e,children:Object(y.jsx)(U,{actions:h[e].actions,onClick:h[e].onClick,className:e})},e)}));return Object(y.jsxs)(N.a,{id:"actions",activeKey:p,onSelect:function(e){return m(e)},children:[x,Object(y.jsx)(w.a,{eventKey:"next-turn",title:"Next Turn",children:Object(y.jsx)(k.a,{onClick:function(){a.endTurn(),m("Hand")},className:"confirm-next-turn",children:"Confirm End Turn"})},"next-turn")]})};var R=function(e){var t=e.G,r=e.ctx,n=e.moves;return Object(y.jsx)(j.Provider,{value:{G:t,ctx:r,moves:n},children:Object(y.jsxs)(d.a,{fluid:!0,children:[Object(y.jsx)(u.a,{children:Object(y.jsx)(l.a,{children:Object(y.jsx)(m,{})})}),Object(y.jsx)(u.a,{children:Object(y.jsx)(l.a,{children:Object(y.jsx)(_,{})})})]})})},V=Object(i.a)({game:o.a,board:R,numPlayers:1}),Y=function(e){e&&e instanceof Function&&r.e(3).then(r.bind(null,142)).then((function(t){var r=t.getCLS,n=t.getFID,a=t.getFCP,s=t.getLCP,c=t.getTTFB;r(e),n(e),a(e),s(e),c(e)}))};c.a.render(Object(y.jsx)(V,{}),document.getElementById("root")),Y()},122:function(e,t,r){"use strict";r.r(t);var n=r(1),a=r(22),s={displayName:null,image:null,description:"<FLAVOR>",moneyCost:0,energyCost:0,producesGrowthMindset:0,producesMoney:0,producesAttention:0,producesEnergy:0,drawsCards:0,discardsCards:0,gainsCards:[],forgetsSelf:!1,forgetsCards:0,isBuyable:!0,perform:function(e,t){if(e.energy<=0)return!1;e.energy--,e.growthMindsetPoints=Math.min(a.c,e.growthMindsetPoints+this.producesGrowthMindset),e.money+=this.producesMoney,e.attention+=this.producesAttention,e.energy+=this.producesEnergy;for(var r=0;r<this.drawsCards;r++)Object(a.b)(e,t);return this.discardsCards>0&&e.hand.length>0&&(e.cardsLeftToDiscard=this.discardsCards,t.events.setStage("discard")),this.forgetsCards>0&&e.hand.length>0&&(e.cardsLeftToForget=this.forgetsCards,t.events.setStage("forget")),this.gainsCards.forEach((function(t){return e.discard.push(t)})),!0},buy:function(e,t){return!(e.attention<=0||e.money<this.moneyCost||e.energy<this.energyCost)&&(e.attention--,e.money-=this.moneyCost,e.energy-=this.energyCost,e.discard.push(this.id),!0)}};t.default=[{id:"Card01",displayName:"Card1",description:"Make sure to play this every turn!",producesGrowthMindset:1,isBuyable:!1},{id:"Card02",displayName:"Card2",description:"Getting money lets you buy stuff.",producesMoney:1,producesEnergy:1},{id:"Card03",displayName:"Card3",description:"Sometimes you just want to forget everything.",moneyCost:2,forgetsSelf:!0,forgetsCards:99},{id:"Card04",displayName:"Card4",description:"If you play this, you'll have to pick another card in your hand to discard.",moneyCost:2,drawsCards:3,discardsCards:1},{id:"Card05",displayName:"Card5",description:"Doing too much can make you tired.",moneyCost:2,producesGrowthMindset:1,producesMoney:1,producesEnergy:1,drawsCards:1,gainsCards:["fatigue"]},{id:"Card06",displayName:"Card6",description:"More energy means you can play more actions!",moneyCost:3,producesEnergy:2,drawsCards:1},{id:"Card07",displayName:"Card7",description:"IDK",moneyCost:3},{id:"Card08",displayName:"Card8",description:"IDK",moneyCost:4},{id:"Card09",displayName:"Card9",description:"More money",moneyCost:4,producesMoney:2,producesEnergy:1},{id:"Card10",displayName:"Card10",description:"That's a lot of energy.",moneyCost:4,producesAttention:1,producesEnergy:4},{id:"Card11",displayName:"Card11",description:"Maybe there are better options.",moneyCost:5,producesEnergy:1,drawsCards:2},{id:"Card12",displayName:"Card12",description:"More more money",moneyCost:6,producesMoney:3,producesEnergy:1},{id:"fatigue",displayName:"Fatigue",description:"Better rest up or I'll just get even more tired later.",isBuyable:!1,forgetsSelf:!0}].map((function(e){return Object(n.a)(Object(n.a)({},s),e)}))},19:function(e,t,r){"use strict";t.a=function(e){var t=e.keys().flatMap((function(t){return e(t).default})),r={};return t.forEach((function(e){r[e.id]=e})),r}(r(87))},22:function(e,t,r){"use strict";r.d(t,"c",(function(){return i})),r.d(t,"b",(function(){return u})),r.d(t,"a",(function(){return l}));var n=r(1),a=r(8),s=r(4),c=r(19),i=5,o={actionShop:[].concat(Object(a.a)(Array(2).fill("Card02")),Object(a.a)(Array(1).fill("Card06")),Object(a.a)(Array(2).fill("Card09")),Object(a.a)(Array(1).fill("Card10")),Object(a.a)(Array(1).fill("Card12")),Object(a.a)(Object.keys(c.a).filter((function(e){return c.a[e].isBuyable})))).sort(),deck:["Card02","Card01","Card02","Card02","Card01"],hand:[],discard:[],growthMindsetPoints:3,cardsLeftToDiscard:0,cardsLeftToForget:0},d={money:0,attention:1,energy:1};function u(e,t){if(e.hand.length>=8)return!1;if(e.deck.length<=0)for(;e.discard.length>0;)e.deck.push(e.discard.pop());return!(e.deck.length<=0)&&(e.hand.push(e.deck.pop()),!0)}var l={setup:function(e,t){return Object(n.a)(Object(n.a)({},o),d)},moves:{performAction:function(e,t,r){var n=e.hand[r],a=c.a[n];if(!a.perform(e,t))return s.t;e.hand.splice(r,1),a.forgetsSelf||e.discard.push(n)},buyAction:function(e,t,r){console.log(e.actionShop);var n=e.actionShop[r];if(!c.a[n].buy(e,t))return s.t;e.actionShop.splice(r,1)},endTurn:function(e,t){t.events.endTurn()}},turn:{onBegin:function(e,t){return function(e,t){for(console.log(Object(a.a)(e.discard));e.hand.length>0;)e.discard.push(e.hand.pop());console.log(Object(a.a)(e.discard));for(var r=Math.min(5,e.growthMindsetPoints),n=0;n<r;n++)u(e);Object.assign(e,d),e.growthMindsetPoints--}(e)},onEnd:function(e,t){e.growthMindsetPoints<=0&&t.events.endGame("fixed-mindset")},stages:{discard:{moves:{discardAction:function(e,t,r){console.log(e.cardsLeftToDiscard);var n=e.hand[r];e.hand.splice(r,1),e.discard.push(n),0===e.hand.length?e.cardsLeftToDiscard=0:e.cardsLeftToDiscard--,e.cardsLeftToDiscard<=0&&t.events.endStage()}}},forget:{moves:{forgetAction:function(e,t,r){console.log(e.cardsLeftToForget);e.hand[r];e.hand.splice(r,1),0===e.hand.length?e.cardsLeftToForget=0:e.cardsLeftToForget--,e.cardsLeftToForget<=0&&t.events.endStage()}}}}}}},86:function(e,t,r){},87:function(e,t,r){var n={"./Phase1Action.js":122};function a(e){var t=s(e);return r(t)}function s(e){if(!r.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}a.keys=function(){return Object.keys(n)},a.resolve=s,e.exports=a,a.id=87}},[[121,1,2]]]);
//# sourceMappingURL=main.deead0b1.chunk.js.map