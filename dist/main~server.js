exports.ids=[0],exports.modules=Array(23).concat([function(t,e,n){"use strict";n(92),n(2),n(1);var o=n(7),r=n(9),i=n(22),a=n(87),s=n(86),c=n(38),u=n(52),l=n(50),f=n(51),d=n(49),p=n(37),y=n(83),m=n(60),g=n(0),h=n(59),v=S(n(16)),w=S(n(15)),b=S(n(14));function S(t){return t&&t.__esModule?t:{default:t}}function O(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),o.forEach(function(e){x(t,e,n[e])})}return t}function x(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}const{OPENSHIFT_REDIS_HOST:E,OPENSHIFT_REDIS_PASSWORD:R,OPENSHIFT_REDIS_PORT:j}=process.env,M=n(13).Server(m.app),P=n(12)(M);if(P.engine.generateId=v.default,E){const t=n(11).createClient,e=n(10),o=t(j,E,{auth_pass:R}),r=t(j,E,{return_buffers:!0,auth_pass:R});P.adapter(e({pubClient:o,subClient:r}))}function _(t){return Object.entries(P.of("/").connected).filter(([e,n])=>e===t).map(([t,e])=>e)[0]||null}async function k(t,e){const n=_(e);return n?(await t.findByIds(f.RoomEntity,Object.keys(n.rooms))).map(t=>t.id):[]}async function C(t,e,n){const o=_(n);await new Promise((t,n)=>{o.join(e,e=>{e?n(e):t()})}),await N(t,n),await L(t,e,n);const{nick:r}=await t.findOne(d.SessionEntity,n,{select:["nick"]});await F(e,`${r} has joined the room.`)}async function N(t,e){const n=await k(t,e);P.to(e).emit("joinedRooms",n)}async function G(t,e){const n=(await t.find(f.RoomEntity)).map(f.RoomEntity.toRoom);(e?P.to(e):P).emit("rooms",n)}async function I(t,e,n){const o=_(e);await new Promise((t,e)=>{o.leave(n,n=>{n?e(n):t()})}),await N(t,e);const{nick:r}=await t.findOne(d.SessionEntity,e,{select:["nick"]});await F(n,`${r} has left the room.`)}function F(t,e,n){return P.to(n||e).emit("message",{roomId:e,message:t}),!0}async function L(t,e,n){await z(t,async t=>{const o=await t.findOne(f.RoomEntity,e);if(!o)return;const r=await t.findOne(c.GameEntity,o.gameId,{relations:["gameStates"]});r&&P.to(n||o.id).emit("update",c.GameEntity.toGame(r))})}async function T(t,e,n){F("New game",e);const o=y.ruleSetMap.get(n);return await z(t,async t=>{const n=o.newGame((0,v.default)()),r=await t.create(c.GameEntity,{id:n.gameId,colors:[...n.colors],mask:n.mask.map(t=>t?"1":"0").join(""),size:O({},n.size),ruleSet:n.ruleSet});return await t.save(r),await D(t,n),await t.update(f.RoomEntity,e,{gameId:r.id}),G(t),L(t,e),n})}async function D(t,e){return await z(t,async t=>{await Promise.all(e.gameStates.map(async(n,o)=>{let r=await t.findOne(u.GameStateEntity,{gameId:e.gameId,index:o});r||(r=await t.create(u.GameStateEntity,{gameId:e.gameId,index:o})),r.turn=n.turn,r.data=n.data.map(t=>null==t?"x":String(t)),r.lastMove=O({},n.lastMove),await t.save(r)}))})}const z=(()=>{let t=null;return(e,n)=>((0,b.default)(e),t?n(t):e.transaction(async e=>{t=e;try{return await n(t)}finally{t=null}}))})();(async()=>{try{const{manager:t}=await(0,o.createConnection)(O({},g.connectionOptions,{entities:[c.GameEntity,u.GameStateEntity,l.LoginEntity,f.RoomEntity,d.SessionEntity,p.UserEntity]}));(0,r.interval)(w.default.duration(g.cleanup.rooms.checkSeconds,"s").asMilliseconds()).subscribe(async()=>{!async function(t){await z(t,async t=>{let e=0;await Promise.all((await t.find(f.RoomEntity,{select:["id","expires"]})).map(async n=>{if(0===(await new Promise((t,e)=>{P.in(n.id).clients((n,o)=>{n?e(n):t(o)})})).length)if(n.expires)(0,w.default)(n.expires).isSameOrBefore()&&(console.log(`Deleting room ${n.id}...`),await t.remove(n),++e);else{const e=(0,w.default)().add(g.cleanup.rooms.expireSeconds,"s");console.log(`Queuing room ${n.id} for deletion ${e.fromNow()}...`),n.expires=e.toDate(),await t.save(n)}})),e&&await G(t)})}(t)});let e=0;(0,a.fromNodeEvent)(P,"connection").subscribe(async n=>{console.log(`User connected, ${++e} connected, ${n.id}`);const o=(0,a.fromNodeEvent)(n,"disconnecting").pipe((0,i.take)(1)),u=(0,a.fromNodeEvent)(n,"disconnect").pipe((0,i.take)(1));function l(e,o){const s=new r.Subject;return(0,a.fromNodeEvent)(n,e).pipe((0,i.takeUntil)(u),(0,i.mergeMap)(([e,n])=>(0,r.of)(e).pipe((0,i.mergeMap)(e=>z(t,async t=>o(O({manager:t},e)))),(0,i.tap)({next(t){n(null,null==t?{}:t)},error(t){console.error(t),n(null==t?{}:t.message,null)}}),(0,i.onErrorResumeNext)()))).subscribe(s),s}const m=n.id;await t.save(await t.create(d.SessionEntity,{id:m,nick:"Guest"})),o.subscribe(async()=>{await z(t,async t=>{try{const e=await k(t,m);if(e.length>0){const{nick:n}=await t.findOne(d.SessionEntity,m,{select:["nick"]});await Promise.all(e.map(t=>F(`${n} has disconnected.`,t)))}}finally{t.delete(d.SessionEntity,m)}})}),u.subscribe(async()=>{console.log(`User disconnected, ${--e} connected`)});const g={async help(t){await F("Available commands:\n/?\n/help\n/nick <name>\n/quit\n/who\n",t,m)},async"?"(t){await g.help(t)},async nick(e,n){if(!(0,s.isValidNick)(n))throw new Error("Invalid nick.");let o;await z(t,async t=>{const e=await t.findOne(d.SessionEntity,m),r=await t.count(d.SessionEntity,{nick:n})>0,i=await t.count(p.UserEntity,{nick:n})>0;if(r||i)throw new Error("Nick is already in use.");o=e.nick,e.nick=n,e.userId&&await t.update(p.UserEntity,e.userId,{nick:n}),await t.save(e)}),await F(`${o} is now known as ${n}.`,e)},async quit(e){await I(t,m,e)},async who(e){const n=await new Promise((t,n)=>{P.in(e).clients((e,o)=>{e?n(e):t(o)})}),o=(await t.findByIds(d.SessionEntity,n)).map(t=>t.nick).sort();await F(`Users in room:\n${o.join("\n")}`,e,m)}};l("makeMove",async({roomId:e,position:n})=>{if(!await async function(t,e,n){return await z(t,async t=>{const o=await t.findOne(f.RoomEntity,e),r=await t.findOne(c.GameEntity,o.gameId,{relations:["gameStates"]}),i=y.ruleSetMap.get(r.ruleSet);let a=c.GameEntity.toGame(r);const s=a.gameStates.slice(-1)[0],u=i.makeMove(a,s,n);if(!u)return!1;if(a=O({},a,{gameStates:[...a.gameStates,u]}),await D(t,a),i.isGameOver(a,u)){const t=Array.from({length:i.colors}).map((t,e)=>({color:h.colors[a.colors[e]].displayName,score:i.getScore(a,u,e)}));t.sort((t,e)=>{const n=i.compareScores(t.score,e.score);return 0===n?t.color.localeCompare(e.color):n});const n=t[0].score,o=t.filter(({score:t})=>i.compareScores(t,n));let r;r=1!==o.length?"Draw game.":`${o[0].color} wins.`,await F(`${r}:\n${t.map(({color:t,score:e})=>`${t}: ${e}`).join("\n")}`,e)}return await L(t,e),!0})}(t,e,n))throw new Error("Failed to make move.")}),l("newGame",async({roomId:e,ruleSet:n})=>{const o=await T(t,e,n);if(!o)throw new Error("Failed to create game.");return{game:o}}),l("sendMessage",async({roomId:e,message:n})=>{if(n.startsWith("/"))return void await async function(e,n){const[o,...r]=n.trim().split(/\s+/g);try{if(!g.hasOwnProperty(o))throw new Error("Unknown command.");if(!(await k(t,m)).includes(e))throw new Error("Not in room.");await g[o](e,...r)}catch(t){throw t&&t.message&&await F(t.message,e,m),t}}(e,n.slice(1));const{nick:o}=await t.findOne(d.SessionEntity,m,{select:["nick"]});if(!await function(t,e,n){return P.to(n).emit("message",{roomId:n,user:t,message:e}),!0}(o,n,e))throw new Error("Failed to send message.")}),l("createRoom",async({manager:t,name:e,password:n})=>{const o=await async function(t,e,n,o){if(!(0,s.isValidRoomName)(n))throw new Error("Invalid room name.");return await z(t,async t=>{const r=await t.create(f.RoomEntity,{name:n,password:o});return await t.save(r),await C(t,r.id,e),await T(t,r.id,"standard"),r})}(t,m,e,n);return f.RoomEntity.toRoom(o)}),l("joinRoom",async({manager:t,roomId:e,password:n})=>{const o=await t.findOne(f.RoomEntity,e);if(!o)throw new Error("Failed to join room.");if(o.password){if(!n)throw new Error("Room requires a password.");if(o.password!==n)throw new Error("Incorrect password.")}return t.update(f.RoomEntity,e,{expires:null}),await C(t,e,m),f.RoomEntity.toRoom(o)}),l("leaveRoom",async({manager:t,roomId:e})=>{await I(t,m,e)}),G(t,m)})}catch(t){console.error(t)}})(),M.listen(m.app.get("port"),m.app.get("host"),t=>{if(t)return void console.error(t);const{address:e,port:n}=M.address();console.log(`Process ${process.pid} listening at ${e}:${n}...`)})},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){var o=n(48)("wks"),r=n(39),i=n(24).Symbol,a="function"==typeof i;(t.exports=function(t){return o[t]||(o[t]=a&&i[t]||(a?i:r)("Symbol."+t))}).store=o},function(t,e,n){"use strict";e.__esModule=!0,e.MetadataField=void 0;var o=n(7),r=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},i=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};class a{}e.MetadataField=a,r([(0,o.CreateDateColumn)({select:!1}),i("design:type",Date)],a.prototype,"created",void 0),r([(0,o.UpdateDateColumn)({select:!1}),i("design:type",Date)],a.prototype,"updated",void 0)},function(t,e,n){var o=n(31),r=n(56);t.exports=n(30)?function(t,e,n){return o.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){t.exports=!n(29)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){var o=n(42),r=n(91),i=n(90),a=Object.defineProperty;e.f=n(30)?Object.defineProperty:function(t,e,n){if(o(t),e=i(e,!0),o(n),r)try{return a(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e){var n=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n)},function(t,e,n){var o=n(48)("keys"),r=n(39);t.exports=function(t){return o[t]||(o[t]=r(t))}},function(t,e,n){var o=n(77),r=n(53);t.exports=function(t){return o(r(t))}},function(t,e){t.exports={}},function(t,e){t.exports=!1},function(t,e,n){"use strict";e.__esModule=!0,e.UserEntity=void 0;var o=n(7),r=n(50),i=n(49),a=n(26),s=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},c=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let u=class{};e.UserEntity=u,s([(0,o.PrimaryGeneratedColumn)("uuid"),c("design:type",String)],u.prototype,"id",void 0),s([(0,o.Column)(()=>a.MetadataField),c("design:type",a.MetadataField)],u.prototype,"meta",void 0),s([(0,o.Column)({unique:!0}),c("design:type",String)],u.prototype,"nick",void 0),s([(0,o.OneToMany)(()=>i.SessionEntity,t=>t.user),c("design:type",Array)],u.prototype,"sessions",void 0),s([(0,o.OneToOne)(()=>r.LoginEntity,t=>t.user,{cascade:!0}),(0,o.JoinColumn)(),c("design:type",r.LoginEntity)],u.prototype,"login",void 0),e.UserEntity=u=s([(0,o.Entity)("User")],u)},function(t,e,n){"use strict";e.__esModule=!0,e.GameEntity=void 0;var o=n(7),r=n(52),i=n(51),a=n(26),s=n(8),c=n(84);function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),o.forEach(function(e){l(t,e,n[e])})}return t}function l(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var f=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},d=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let p=class{static toGame(t){const e=(0,s.sortBy)(t.gameStates,t=>t.index);return{gameId:t.id,size:u({},t.size),colors:[...t.colors],mask:t.mask.split("").map(t=>"1"===t),ruleSet:t.ruleSet,gameStates:e.map(t=>({index:t.index,turn:t.turn,data:t.data.map(t=>"x"===t?null:parseInt(t,10)),lastMove:null==t.lastMove.x||null==t.lastMove.y?null:u({},t.lastMove)}))}}};e.GameEntity=p,f([(0,o.PrimaryGeneratedColumn)("uuid"),d("design:type",String)],p.prototype,"id",void 0),f([(0,o.Column)(()=>a.MetadataField),d("design:type",a.MetadataField)],p.prototype,"meta",void 0),f([(0,o.Column)("simple-array"),d("design:type",Array)],p.prototype,"colors",void 0),f([(0,o.OneToMany)(()=>r.GameStateEntity,t=>t.game,{cascade:!0}),d("design:type",Array)],p.prototype,"gameStates",void 0),f([(0,o.Column)(()=>c.SizeField),d("design:type",c.SizeField)],p.prototype,"size",void 0),f([(0,o.Column)(),d("design:type",String)],p.prototype,"mask",void 0),f([(0,o.OneToOne)(()=>i.RoomEntity,{nullable:!0}),d("design:type",i.RoomEntity)],p.prototype,"room",void 0),f([(0,o.Column)(),d("design:type",String)],p.prototype,"ruleSet",void 0),e.GameEntity=p=f([(0,o.Entity)("Game")],p)},function(t,e){var n=0,o=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+o).toString(36))}},function(t,e,n){var o=n(24),r=n(27),i=n(28),a=n(39)("src"),s=Function.toString,c=(""+s).split("toString");n(32).inspectSource=function(t){return s.call(t)},(t.exports=function(t,e,n,s){var u="function"==typeof n;u&&(i(n,"name")||r(n,"name",e)),t[e]!==n&&(u&&(i(n,a)||r(n,a,t[e]?""+t[e]:c.join(String(e)))),t===o?t[e]=n:s?t[e]?t[e]=n:r(t,e,n):(delete t[e],r(t,e,n)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[a]||s.call(this)})},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var o=n(41);t.exports=function(t){if(!o(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){n(65)("asyncIterator")},function(t,e,n){var o=n(31).f,r=n(28),i=n(25)("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,i)&&o(t,i,{configurable:!0,value:e})}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e){var n=Math.ceil,o=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?o:n)(t)}},function(t,e,n){var o=n(71),r=n(45);t.exports=Object.keys||function(t){return o(t,r)}},function(t,e,n){var o=n(32),r=n(24),i=r["__core-js_shared__"]||(r["__core-js_shared__"]={});(t.exports=function(t,e){return i[t]||(i[t]=void 0!==e?e:{})})("versions",[]).push({version:o.version,mode:n(36)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})},function(t,e,n){"use strict";e.__esModule=!0,e.SessionEntity=void 0;var o=n(7),r=n(37),i=n(26),a=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},s=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let c=class{};e.SessionEntity=c,a([(0,o.PrimaryColumn)("uuid"),s("design:type",String)],c.prototype,"id",void 0),a([(0,o.Column)(()=>i.MetadataField),s("design:type",i.MetadataField)],c.prototype,"meta",void 0),a([(0,o.Column)(),s("design:type",String)],c.prototype,"nick",void 0),a([(0,o.ManyToOne)(()=>r.UserEntity,t=>t.sessions),s("design:type",r.UserEntity)],c.prototype,"user",void 0),a([(0,o.Column)("uuid",{nullable:!0}),s("design:type",String)],c.prototype,"userId",void 0),e.SessionEntity=c=a([(0,o.Entity)("Session")],c)},function(t,e,n){"use strict";e.__esModule=!0,e.LoginEntity=void 0;var o=n(7),r=n(37),i=n(26),a=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},s=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let c=class{};e.LoginEntity=c,a([(0,o.PrimaryGeneratedColumn)("uuid"),s("design:type",String)],c.prototype,"id",void 0),a([(0,o.Column)(()=>i.MetadataField),s("design:type",i.MetadataField)],c.prototype,"meta",void 0),a([(0,o.Column)(),(0,o.Index)({unique:!0}),s("design:type",String)],c.prototype,"username",void 0),a([(0,o.Column)(),s("design:type",String)],c.prototype,"passwordHash",void 0),a([(0,o.OneToOne)(()=>r.UserEntity,t=>t.login),s("design:type",r.UserEntity)],c.prototype,"user",void 0),a([(0,o.Column)("uuid",{nullable:!0}),s("design:type",String)],c.prototype,"userId",void 0),e.LoginEntity=c=a([(0,o.Entity)("Login")],c)},function(t,e,n){"use strict";e.__esModule=!0,e.RoomEntity=void 0;var o=n(7),r=n(38),i=n(26),a=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},s=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let c=class{static toRoom(t){return{roomId:t.id,gameId:t.gameId,name:t.name,hasPassword:!!t.password}}};e.RoomEntity=c,a([(0,o.PrimaryGeneratedColumn)("uuid"),s("design:type",String)],c.prototype,"id",void 0),a([(0,o.Column)(()=>i.MetadataField),s("design:type",i.MetadataField)],c.prototype,"meta",void 0),a([(0,o.Column)(),s("design:type",String)],c.prototype,"name",void 0),a([(0,o.Column)({nullable:!0}),s("design:type",Date)],c.prototype,"expires",void 0),a([(0,o.Column)(),s("design:type",String)],c.prototype,"password",void 0),a([(0,o.Column)("uuid",{nullable:!0}),s("design:type",String)],c.prototype,"gameId",void 0),a([(0,o.OneToOne)(()=>r.GameEntity,{nullable:!0}),(0,o.JoinColumn)(),s("design:type",r.GameEntity)],c.prototype,"game",void 0),e.RoomEntity=c=a([(0,o.Entity)("Room")],c)},function(t,e,n){"use strict";e.__esModule=!0,e.GameStateEntity=void 0;var o=n(7),r=n(38),i=n(85),a=n(26),s=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},c=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let u=class{};e.GameStateEntity=u,s([(0,o.PrimaryColumn)("uuid"),c("design:type",String)],u.prototype,"gameId",void 0),s([(0,o.PrimaryColumn)({type:"integer"}),c("design:type",Number)],u.prototype,"index",void 0),s([(0,o.Column)(()=>a.MetadataField),c("design:type",a.MetadataField)],u.prototype,"meta",void 0),s([(0,o.ManyToOne)(()=>r.GameEntity,t=>t.gameStates),c("design:type",r.GameEntity)],u.prototype,"game",void 0),s([(0,o.Column)({type:"integer",nullable:!0}),c("design:type",Number)],u.prototype,"turn",void 0),s([(0,o.Column)(()=>i.PointFieldNull),c("design:type",i.PointFieldNull)],u.prototype,"lastMove",void 0),s([(0,o.Column)({type:"simple-array"}),c("design:type",Array)],u.prototype,"data",void 0),e.GameStateEntity=u=s([(0,o.Entity)("GameState")],u)},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var o=n(53);t.exports=function(t){return Object(o(t))}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){var o=n(41),r=n(24).document,i=o(r)&&o(r.createElement);t.exports=function(t){return i?r.createElement(t):{}}},function(t,e,n){var o=n(24),r=n(32),i=n(27),a=n(40),s=n(89),c=function(t,e,n){var u,l,f,d,p=t&c.F,y=t&c.G,m=t&c.S,g=t&c.P,h=t&c.B,v=y?o:m?o[e]||(o[e]={}):(o[e]||{}).prototype,w=y?r:r[e]||(r[e]={}),b=w.prototype||(w.prototype={});for(u in y&&(n=e),n)f=((l=!p&&v&&void 0!==v[u])?v:n)[u],d=h&&l?s(f,o):g&&"function"==typeof f?s(Function.call,f):f,v&&a(v,u,f,t&c.U),w[u]!=f&&i(w,u,d),g&&b[u]!=f&&(b[u]=f)};o.core=r,c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t){t.exports={colors:{aqua:{displayName:"Aqua",color:[180,100,50]},black:{displayName:"Black",color:[0,0,0]},blue:{displayName:"Blue",color:[240,100,50]},fuschsia:{displayName:"Fuchsia",color:[300,100,50]},gray:{displayName:"Gray",color:[0,0,50]},green:{displayName:"Green",color:[120,100,50]},orange:{displayName:"Orange",color:[30,100,50]},pink:{displayName:"Pink",color:[330,100,50]},purple:{displayName:"Purple",color:[270,100,50]},red:{displayName:"Red",color:[0,100,50]},white:{displayName:"White",color:[0,0,100]},yellow:{displayName:"Yellow",color:[60,100,50]}}}},function(t,e,n){"use strict";e.__esModule=!0,e.app=void 0;var o=c(n(21)),r=c(n(20)),i=c(n(19)),a=c(n(18)),s=n(0);function c(t){return t&&t.__esModule?t:{default:t}}const u=(0,o.default)();e.app=u;for(const[t,e]of Object.entries(s.appSettings))u.set(t,e);u.use((0,a.default)(),o.default.static(i.default.join(__dirname,"www"))),r.default.extend(u,s.cspPolicy),u.use(n(17).json()),u.get("/health",(t,e)=>{e.writeHead(200),e.end()})},function(t,e,n){"use strict";e.__esModule=!0,e.Square=void 0;e.Square=class{constructor(t,e){this.position=t,this.bounds=e,this.enabled=!0,this.color=null}get empty(){return null===this.color}}},function(t,e,n){"use strict";e.__esModule=!0,e.Bounds=void 0;e.Bounds=class{constructor(t,e,n,o){this.left=t,this.top=e,this.width=n,this.height=o}get bottom(){const{top:t,height:e}=this;return t+e}get right(){const{left:t,width:e}=this;return t+e}get center(){const{left:t,top:e,width:n,height:o}=this;return{x:t+.5*n,y:e+.5*o}}get n(){const{left:t,top:e,width:n}=this;return{x:t+.5*n,y:e}}get ne(){const{left:t,top:e,width:n}=this;return{x:t+n,y:e}}get e(){const{left:t,top:e,width:n,height:o}=this;return{x:t+n,y:e+.5*o}}get se(){const{left:t,top:e,width:n,height:o}=this;return{x:t+n,y:e+o}}get s(){const{left:t,top:e,width:n,height:o}=this;return{x:t+.5*n,y:e+o}}get sw(){const{left:t,top:e,height:n}=this;return{x:t,y:e+n}}get w(){const{left:t,top:e,height:n}=this;return{x:t,y:e+.5*n}}get nw(){const{left:t,top:e}=this;return{x:t,y:e}}hitTest({x:t,y:e}){const{top:n,right:o,bottom:r,left:i}=this;return t>=i&&t<=o&&e>=n&&e<=r}}},function(t,e,n){"use strict";function o(t,{x:e,y:n}){if(!Number.isSafeInteger(e)||!Number.isSafeInteger(n))throw new Error(`(${e}, ${n}) is not valid`);if(!t.boundsCheck({x:e,y:n}))throw new Error(`(${e}, ${n}) is out of bounds`)}e.__esModule=!0,e.Grid=void 0,n(43);e.Grid=class{constructor(t,e){this.width=t,this.height=e,this.data=new Map}boundsCheck({x:t,y:e}){const{width:n,height:o}=this;return t>=0&&t<n&&e>=0&&e<o}get({x:t,y:e}){o(this,{x:t,y:e});const n=JSON.stringify({x:t,y:e});return this.data.get(n)}set({x:t,y:e},n){o(this,{x:t,y:e});const r=JSON.stringify({x:t,y:e});this.data.set(r,n)}[Symbol.iterator](){return function*(){const{width:t,height:e}=this;for(let n=0;n<t;++n)for(let t=0;t<e;++t)yield this.get({x:n,y:t})}.call(this)}}},function(t,e,n){e.f=n(25)},function(t,e,n){var o=n(24),r=n(32),i=n(36),a=n(64),s=n(31).f;t.exports=function(t){var e=r.Symbol||(r.Symbol=i?{}:o.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:a.f(t)})}},function(t,e,n){var o=n(28),r=n(54),i=n(33)("IE_PROTO"),a=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),o(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}},function(t,e,n){var o=n(24).document;t.exports=o&&o.documentElement},function(t,e,n){var o=n(46),r=Math.max,i=Math.min;t.exports=function(t,e){return(t=o(t))<0?r(t+e,0):i(t,e)}},function(t,e,n){var o=n(46),r=Math.min;t.exports=function(t){return t>0?r(o(t),9007199254740991):0}},function(t,e,n){var o=n(34),r=n(69),i=n(68);t.exports=function(t){return function(e,n,a){var s,c=o(e),u=r(c.length),l=i(a,u);if(t&&n!=n){for(;u>l;)if((s=c[l++])!=s)return!0}else for(;u>l;l++)if((t||l in c)&&c[l]===n)return t||l||0;return!t&&-1}}},function(t,e,n){var o=n(28),r=n(34),i=n(70)(!1),a=n(33)("IE_PROTO");t.exports=function(t,e){var n,s=r(t),c=0,u=[];for(n in s)n!=a&&o(s,n)&&u.push(n);for(;e.length>c;)o(s,n=e[c++])&&(~i(u,n)||u.push(n));return u}},function(t,e,n){var o=n(31),r=n(42),i=n(47);t.exports=n(30)?Object.defineProperties:function(t,e){r(t);for(var n,a=i(e),s=a.length,c=0;s>c;)o.f(t,n=a[c++],e[n]);return t}},function(t,e,n){var o=n(42),r=n(72),i=n(45),a=n(33)("IE_PROTO"),s=function(){},c=function(){var t,e=n(57)("iframe"),o=i.length;for(e.style.display="none",n(67).appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),c=t.F;o--;)delete c.prototype[i[o]];return c()};t.exports=Object.create||function(t,e){var n;return null!==t?(s.prototype=o(t),n=new s,s.prototype=null,n[a]=t):n=c(),void 0===e?n:r(n,e)}},function(t,e,n){"use strict";var o=n(73),r=n(56),i=n(44),a={};n(27)(a,n(25)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=o(a,{next:r(1,n)}),i(t,e+" Iterator")}},function(t,e,n){"use strict";var o=n(36),r=n(58),i=n(40),a=n(27),s=n(35),c=n(74),u=n(44),l=n(66),f=n(25)("iterator"),d=!([].keys&&"next"in[].keys()),p=function(){return this};t.exports=function(t,e,n,y,m,g,h){c(n,e,y);var v,w,b,S=function(t){if(!d&&t in R)return R[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},O=e+" Iterator",x="values"==m,E=!1,R=t.prototype,j=R[f]||R["@@iterator"]||m&&R[m],M=j||S(m),P=m?x?S("entries"):M:void 0,_="Array"==e&&R.entries||j;if(_&&(b=l(_.call(new t)))!==Object.prototype&&b.next&&(u(b,O,!0),o||"function"==typeof b[f]||a(b,f,p)),x&&j&&"values"!==j.name&&(E=!0,M=function(){return j.call(this)}),o&&!h||!d&&!E&&R[f]||a(R,f,M),s[e]=M,s[O]=p,m)if(v={values:x?M:S("values"),keys:g?M:S("keys"),entries:P},h)for(w in v)w in R||i(R,w,v[w]);else r(r.P+r.F*(d||E),e,v);return v}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var o=n(76);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==o(t)?t.split(""):Object(t)}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){var o=n(25)("unscopables"),r=Array.prototype;void 0==r[o]&&n(27)(r,o,{}),t.exports=function(t){r[o][t]=!0}},function(t,e,n){"use strict";var o=n(79),r=n(78),i=n(35),a=n(34);t.exports=n(75)(Array,"Array",function(t,e){this._t=a(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,r(1)):r(0,"keys"==e?n:"values"==e?t[n]:[n,t[n]])},"values"),i.Arguments=i.Array,o("keys"),o("values"),o("entries")},function(t,e,n){for(var o=n(80),r=n(47),i=n(40),a=n(24),s=n(27),c=n(35),u=n(25),l=u("iterator"),f=u("toStringTag"),d=c.Array,p={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},y=r(p),m=0;m<y.length;m++){var g,h=y[m],v=p[h],w=a[h],b=w&&w.prototype;if(b&&(b[l]||s(b,l,d),b[f]||s(b,f,h),c[h]=d,v))for(g in o)b[g]||i(b,g,o[g],!0)}},function(t,e,n){"use strict";e.__esModule=!0,e.Board=void 0,n(81),n(43);var o=n(63),r=n(62),i=n(61),a=n(8);class s{constructor(){this.bounds=new r.Bounds(0,0,0,0),this.grid=new o.Grid(0,0)}reset({width:t,height:e}){const n=new o.Grid(t,e),a=64,s=64,c=6,u=6,l=new r.Bounds(.5,.5,1+t*(a+c)+c,1+e*(s+u)+u);for(let o=0;o<t;++o)for(let t=0;t<e;++t){const e={x:o,y:t},l=new r.Bounds(.5+o*(a+c)+c,.5+t*(s+u)+u,.5+a,.5+s);n.set({x:o,y:t},new i.Square(e,l))}Object.assign(this,{grid:n,bounds:l})}get width(){const{grid:{width:t}}=this;return t}get height(){const{grid:{height:t}}=this;return t}get({x:t,y:e}){const{grid:n}=this;return n.get({x:t,y:e})}boundsCheck({x:t,y:e}){const{grid:n}=this;return n.boundsCheck({x:t,y:e})}getData(){return Object.freeze(Array.from(this.grid).map(t=>t.empty?null:t.color))}setData(t){for(const[e,n]of(0,a.zip)(t,Array.from(this.grid)))n.color=e}getGameState(t){return{index:t,data:this.getData()}}getMask(){return Object.freeze(Array.from(this.grid).map(t=>t.enabled))}setMask(t){for(const[e,n]of(0,a.zip)(t,Array.from(this.grid)))n.enabled=e}static fromGame(t,e){const n=new s;return n.reset(t.size),n.setData(e.data),n.setMask(t.mask),n}[Symbol.iterator](){const{grid:t}=this;return t[Symbol.iterator]()}hitTest(t){for(const e of this)if(e.bounds.hitTest(t))return e;return null}}e.Board=s},function(t,e,n){"use strict";e.__esModule=!0,e.ruleSetMap=e.ruleSets=e.rulesReversed=e.rulesStandard=void 0;var o=n(82);function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),o.forEach(function(e){i(t,e,n[e])})}return t}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}const a=[{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}];function s(t,e,n){if(!t.boundsCheck(e))return[];const o=t.get(e);if(!o||!o.empty||!o.enabled)return[];function r({x:e,y:o},r){const i=[];for(;;){if(e+=r.x,o+=r.y,!t.boundsCheck({x:e,y:o}))return[];const a=t.get({x:e,y:o});if(!a||a.empty||!a.enabled)return[];if(a.color===n)return i;i.push(a)}}let i=[o];for(const t of a)i=[...i,...r(e,t)];return i.length<=1?[]:i}class c{constructor(){this.name="Standard",this.ruleSet="standard",this.colors=2,this.boardSize=Object.freeze({width:8,height:8})}isValid(t,e,n,r){return s(o.Board.fromGame(t,e),n,r).length>0}compareScores(t,e){return t-e}getValidMoves(t,e,n){const o=[],{size:{width:r,height:i}}=t;for(let a=0;a<r;++a)for(let r=0;r<i;++r){const i={x:a,y:r};this.isValid(t,e,i,n)&&o.push(i)}return o}isGameOver(t,e){const{colors:n}=this;for(let o=0;o<n;++o)if(this.getValidMoves(t,e,o).length>0)return!1;return!0}makeMove(t,e,n){const{turn:i,index:a}=e,c=o.Board.fromGame(t,e),u=s(c,n,i);if(0===u.length)return null;for(const t of u)t.color=i;const l=a+1,f=Object.freeze(r({},n)),d=c.getData(),{colors:p}=this;let y=null;for(let e=0;e<p;++e){const n=(i+1+e)%p;if(this.getValidMoves(t,{turn:n,index:l,data:d,lastMove:f},n).length>0){y=n;break}}return{turn:y,index:l,data:d,lastMove:f}}getScore(t,e,n){const r=o.Board.fromGame(t,e);let i=0;for(const t of r)t&&t.enabled&&t.color===n&&++i;return i}newGame(t){const{boardSize:e}=this,n=new o.Board;n.reset(e),n.get({x:3,y:3}).color=0,n.get({x:4,y:3}).color=1,n.get({x:3,y:4}).color=1,n.get({x:4,y:4}).color=0;const i=[{turn:0,index:0,data:n.getData(),lastMove:null}];return{gameId:t,ruleSet:this.ruleSet,mask:n.getMask(),colors:Object.freeze(["black","white"]),size:Object.freeze(r({},e)),gameStates:Object.freeze(i)}}}const u=new c;e.rulesStandard=u;const l=new class extends c{constructor(){super(...arguments),this.name="Reversed",this.ruleSet="reversed"}compareScores(t,e){return e-t}};e.rulesReversed=l;const f=[u,l];e.ruleSets=f;const d=new Map;e.ruleSetMap=d;for(const t of f)d.set(t.ruleSet,t)},function(t,e,n){"use strict";e.__esModule=!0,e.SizeFieldNull=e.SizeField=void 0;var o=n(7),r=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},i=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};class a{}e.SizeField=a,r([(0,o.Column)({type:"integer"}),i("design:type",Number)],a.prototype,"width",void 0),r([(0,o.Column)({type:"integer"}),i("design:type",Number)],a.prototype,"height",void 0);class s{}e.SizeFieldNull=s,r([(0,o.Column)({type:"integer",nullable:!0}),i("design:type",Number)],s.prototype,"width",void 0),r([(0,o.Column)({type:"integer",nullable:!0}),i("design:type",Number)],s.prototype,"height",void 0)},function(t,e,n){"use strict";e.__esModule=!0,e.PointFieldNull=e.PointField=void 0;var o=n(7),r=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},i=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};class a{}e.PointField=a,r([(0,o.Column)({type:"integer"}),i("design:type",Number)],a.prototype,"x",void 0),r([(0,o.Column)({type:"integer"}),i("design:type",Number)],a.prototype,"y",void 0);class s{}e.PointFieldNull=s,r([(0,o.Column)({type:"integer",nullable:!0}),i("design:type",Number)],s.prototype,"x",void 0),r([(0,o.Column)({type:"integer",nullable:!0}),i("design:type",Number)],s.prototype,"y",void 0)},function(t,e,n){"use strict";e.__esModule=!0,e.isValidNick=function(t){return!!t&&!(t.length>o.validation.maxNickLength)&&/^[_a-z][-_a-z0-9]+[_a-z0-9]+/i.test(t)},e.isValidRoomName=function(t){return!(!t||t.length>o.validation.maxRoomNameLength)};var o=n(0)},function(t,e,n){"use strict";e.__esModule=!0,e.fromNodeEvent=void 0;var o=n(9);e.fromNodeEvent=((t,e)=>(0,o.fromEventPattern)(n=>{t.addListener(e,n)},n=>{t.removeListener(e,n)}))},function(t,e,n){"use strict";var o=n(29);t.exports=function(t,e){return!!t&&o(function(){e?t.call(null,function(){},1):t.call(null)})}},function(t,e,n){var o=n(55);t.exports=function(t,e,n){if(o(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,o){return t.call(e,n,o)};case 3:return function(n,o,r){return t.call(e,n,o,r)}}return function(){return t.apply(e,arguments)}}},function(t,e,n){var o=n(41);t.exports=function(t,e){if(!o(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!o(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!o(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!o(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){t.exports=!n(30)&&!n(29)(function(){return 7!=Object.defineProperty(n(57)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){"use strict";var o=n(58),r=n(55),i=n(54),a=n(29),s=[].sort,c=[1,2,3];o(o.P+o.F*(a(function(){c.sort(void 0)})||!a(function(){c.sort(null)})||!n(88)(s)),"Array",{sort:function(t){return void 0===t?s.call(i(this)):s.call(i(this),r(t))}})}]);
//# sourceMappingURL=main~server.js.map