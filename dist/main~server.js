exports.ids=[1],exports.modules=[,,,,,,,,,,,,,function(e,t,o){"use strict";o(14),o(2),o(3);var n=o(10),i=o(0),r=o(4),a=o(5),s=o(36),c=o(30),l=o(32),d=o(34),u=o(33),y=o(35),f=o(31),p=o(39),m=o(44),g=o(1),h=o(45),w=o(46),v=E(o(22)),b=E(o(23)),S=E(o(24));function E(e){return e&&e.__esModule?e:{default:e}}function O(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{},n=Object.keys(o);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(o).filter(function(e){return Object.getOwnPropertyDescriptor(o,e).enumerable}))),n.forEach(function(t){R(e,t,o[t])})}return e}function R(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}const{OPENSHIFT_REDIS_HOST:x,OPENSHIFT_REDIS_PASSWORD:j,OPENSHIFT_REDIS_PORT:M}=process.env,P=o(25).Server(m.app),k=o(26)(P);if(k.engine.generateId=v.default,x){const e=o(27).createClient,t=o(28),n=e(M,x,{auth_pass:j}),i=e(M,x,{return_buffers:!0,auth_pass:j});k.adapter(t({pubClient:n,subClient:i}))}function C(e){return Object.entries(k.of("/").connected).filter(([t,o])=>t===e).map(([e,t])=>t)[0]||null}async function _(e,t){const o=C(t);return o?(await e.findByIds(u.RoomEntity,Object.keys(o.rooms))).map(e=>e.id):[]}async function N(e,t,o){const n=C(o);await new Promise((e,o)=>{n.join(t,t=>{t?o(t):e()})}),await G(e,o),await z(e,t,o);const{nick:i}=await e.findOne(y.SessionEntity,o,{select:["nick"]});await D(t,`${i} has joined the room.`)}async function G(e,t){const o=await _(e,t);k.to(t).emit("joinedRooms",o)}async function I(e,t){const o=(await e.find(u.RoomEntity)).map(u.RoomEntity.toRoom);(t?k.to(t):k).emit("rooms",o)}async function F(e,t,o){const n=C(t);await new Promise((e,t)=>{n.leave(o,o=>{o?t(o):e()})}),await G(e,t);const{nick:i}=await e.findOne(y.SessionEntity,t,{select:["nick"]});await D(o,`${i} has left the room.`)}function D(e,t,o){return k.to(o||t).emit("message",{roomId:t,message:e}),!0}async function z(e,t,o){await U(e,async e=>{const n=await e.findOne(u.RoomEntity,t);if(!n)return;const i=await e.findOne(c.GameEntity,n.gameId,{relations:["gameStates"]});i&&k.to(o||n.id).emit("update",c.GameEntity.toGame(i))})}async function $(e,t,o){D("New game",t);const n=p.ruleSetMap.get(o);return await U(e,async e=>{const o=n.newGame((0,v.default)()),i=await e.create(c.GameEntity,{id:o.gameId,colors:[...o.colors],mask:o.mask.map(e=>e?"1":"0").join(""),size:O({},o.size),ruleSet:o.ruleSet});return await e.save(i),await B(e,o),await e.update(u.RoomEntity,t,{gameId:i.id}),I(e),z(e,t),o})}async function B(e,t){return await U(e,async e=>{await Promise.all(t.gameStates.map(async(o,n)=>{let i=await e.findOne(l.GameStateEntity,{gameId:t.gameId,index:n});i||(i=await e.create(l.GameStateEntity,{gameId:t.gameId,index:n})),i.turn=o.turn,i.data=o.data.map(e=>null==e?"x":String(e)),i.lastMove=O({},o.lastMove),await e.save(i)}))})}const U=(()=>{let e=null;return(t,o)=>((0,S.default)(t),e?o(e):t.transaction(async t=>{e=t;try{return await o(e)}finally{e=null}}))})();(async()=>{try{const{manager:e}=await(0,n.createConnection)(O({},g.connectionOptions,{entities:[c.GameEntity,l.GameStateEntity,d.LoginEntity,u.RoomEntity,y.SessionEntity,f.UserEntity]}));(0,i.interval)(b.default.duration(g.cleanup.rooms.checkSeconds,"s").asMilliseconds()).subscribe(async()=>{!async function(e){await U(e,async e=>{let t=0;await Promise.all((await e.find(u.RoomEntity,{select:["id","expires"]})).map(async o=>{if(0===(await new Promise((e,t)=>{k.in(o.id).clients((o,n)=>{o?t(o):e(n)})})).length)if(o.expires)(0,b.default)(o.expires).isSameOrBefore()&&(console.log(`Deleting room ${o.id}...`),await e.remove(o),++t);else{const t=(0,b.default)().add(g.cleanup.rooms.expireSeconds,"s");console.log(`Queuing room ${o.id} for deletion ${t.fromNow()}...`),o.expires=t.toDate(),await e.save(o)}})),t&&await I(e)})}(e)});let t=0;(0,a.fromNodeEvent)(k,"connection").subscribe(async o=>{console.log(`User connected, ${++t} connected, ${o.id}`);const n=(0,a.fromNodeEvent)(o,"disconnecting").pipe((0,r.take)(1)),l=(0,a.fromNodeEvent)(o,"disconnect").pipe((0,r.take)(1));function d(t,n){const s=new i.Subject;return(0,a.fromNodeEvent)(o,t).pipe((0,r.takeUntil)(l),(0,r.mergeMap)(([t,o])=>(0,i.of)(t).pipe((0,r.mergeMap)(t=>U(e,async e=>n(O({manager:e},t)))),(0,r.tap)({next(e){o(null,null==e?{}:e)},error(e){console.error(e),o(null==e?{}:e.message,null)}}),(0,r.onErrorResumeNext)()))).subscribe(s),s}const m=o.id;await e.save(await e.create(y.SessionEntity,{id:m,nick:"Guest"})),n.subscribe(async()=>{await U(e,async e=>{try{const t=await _(e,m);if(t.length>0){const{nick:o}=await e.findOne(y.SessionEntity,m,{select:["nick"]});await Promise.all(t.map(e=>D(`${o} has disconnected.`,e)))}}finally{e.delete(y.SessionEntity,m)}})}),l.subscribe(async()=>{console.log(`User disconnected, ${--t} connected`)});const g={async help(e){await D("Available commands:\n/?\n/help\n/nick <name>\n/quit\n/who\n",e,m)},async"?"(e){await g.help(e)},async nick(t,o){if(!(0,s.isValidNick)(o))throw new Error("Invalid nick.");let n;await U(e,async e=>{const t=await e.findOne(y.SessionEntity,m),i=await e.count(y.SessionEntity,{nick:o})>0,r=await e.count(f.UserEntity,{nick:o})>0;if(i||r)throw new Error("Nick is already in use.");n=t.nick,t.nick=o,t.userId&&await e.update(f.UserEntity,t.userId,{nick:o}),await e.save(t)}),await D(`${n} is now known as ${o}.`,t)},async quit(t){await F(e,m,t)},async who(t){const o=await new Promise((e,o)=>{k.in(t).clients((t,n)=>{t?o(t):e(n)})}),n=(await e.findByIds(y.SessionEntity,o)).map(e=>e.nick).sort();await D(`Users in room:\n${n.join("\n")}`,t,m)}};d("makeMove",async({roomId:t,position:o})=>{if(!await async function(e,t,o){return await U(e,async e=>{const n=await e.findOne(u.RoomEntity,t),i=await e.findOne(c.GameEntity,n.gameId,{relations:["gameStates"]}),r=p.ruleSetMap.get(i.ruleSet);let a=c.GameEntity.toGame(i);const s=a.gameStates.slice(-1)[0],l=r.makeMove(a,s,o);if(!l)return!1;if(a=O({},a,{gameStates:[...a.gameStates,l]}),await B(e,a),r.isGameOver(a,l)){const e=Array.from({length:r.colors}).map((e,t)=>({color:h.colors[a.colors[t]].displayName,score:r.getScore(a,l,t)}));e.sort((e,t)=>{const o=r.compareScores(e.score,t.score);return 0===o?e.color.localeCompare(t.color):o});const o=e[0].score,n=e.filter(({score:e})=>r.compareScores(e,o));let i;i=1!==n.length?"Draw game.":`${n[0].color} wins.`,await D(`${i}:\n${e.map(({color:e,score:t})=>`${e}: ${t}`).join("\n")}`,t)}return await z(e,t),!0})}(e,t,o))throw new Error("Failed to make move.")}),d("newGame",async({roomId:t,ruleSet:o})=>{const n=await $(e,t,o);if(!n)throw new Error("Failed to create game.");return{game:n}}),d("sendMessage",async({roomId:t,message:o})=>{if(o.startsWith("/"))return void await async function(t,o){const[n,...i]=o.trim().split(/\s+/g);try{if(!g.hasOwnProperty(n))throw new Error("Unknown command.");if(!(await _(e,m)).includes(t))throw new Error("Not in room.");await g[n](t,...i)}catch(e){throw e&&e.message&&await D(e.message,t,m),e}}(t,o.slice(1));const{nick:n}=await e.findOne(y.SessionEntity,m,{select:["nick"]});if(!await function(e,t,o){return k.to(o).emit("message",{roomId:o,user:e,message:t}),!0}(n,o,t))throw new Error("Failed to send message.")}),d("createRoom",async({manager:e,name:t,password:o})=>{const n=await async function(e,t,o,n){if(!(0,s.isValidRoomName)(o))throw new Error("Invalid room name.");return await U(e,async e=>{const i=await e.create(u.RoomEntity,{name:o,passwordHash:await(0,w.hashPassword)(n)});return await e.save(i),await N(e,i.id,t),await $(e,i.id,"standard"),i})}(e,m,t,o);return u.RoomEntity.toRoom(n)}),d("joinRoom",async({manager:e,roomId:t,password:o})=>{const n=await e.findOne(u.RoomEntity,t);if(!n)throw new Error("Failed to join room.");if(n.passwordHash){if(!o)throw new Error("Room requires a password.");if(!await(0,w.checkPassword)(o,n.passwordHash))throw new Error("Incorrect password.")}return e.update(u.RoomEntity,t,{expires:null}),await N(e,t,m),u.RoomEntity.toRoom(n)}),d("leaveRoom",async({manager:e,roomId:t})=>{await F(e,m,t)}),I(e,m)})}catch(e){console.error(e)}})(),P.listen(m.app.get("port"),m.app.get("host"),e=>{if(e)return void console.error(e);const{address:t,port:o}=P.address();console.log(`Process ${process.pid} listening at ${t}:${o}...`)})},,,,,,,,,,,,,,,,function(e,t,o){"use strict";t.__esModule=!0,t.MetadataField=void 0;var n=o(10),i=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},r=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};class a{}t.MetadataField=a,i([(0,n.CreateDateColumn)({select:!1}),r("design:type",Date)],a.prototype,"created",void 0),i([(0,n.UpdateDateColumn)({select:!1}),r("design:type",Date)],a.prototype,"updated",void 0)},function(e,t,o){"use strict";t.__esModule=!0,t.GameEntity=void 0;var n=o(10),i=o(32),r=o(33),a=o(29),s=o(11),c=o(38);function l(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{},n=Object.keys(o);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(o).filter(function(e){return Object.getOwnPropertyDescriptor(o,e).enumerable}))),n.forEach(function(t){d(e,t,o[t])})}return e}function d(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}var u=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},y=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};let f=class{static toGame(e){const t=(0,s.sortBy)(e.gameStates,e=>e.index);return{gameId:e.id,size:l({},e.size),colors:[...e.colors],mask:e.mask.split("").map(e=>"1"===e),ruleSet:e.ruleSet,gameStates:t.map(e=>({index:e.index,turn:e.turn,data:e.data.map(e=>"x"===e?null:parseInt(e,10)),lastMove:null==e.lastMove.x||null==e.lastMove.y?null:l({},e.lastMove)}))}}};t.GameEntity=f,u([(0,n.PrimaryGeneratedColumn)("uuid"),y("design:type",String)],f.prototype,"id",void 0),u([(0,n.Column)(()=>a.MetadataField),y("design:type",a.MetadataField)],f.prototype,"meta",void 0),u([(0,n.Column)("simple-array"),y("design:type",Array)],f.prototype,"colors",void 0),u([(0,n.OneToMany)(()=>i.GameStateEntity,e=>e.game,{cascade:!0}),y("design:type",Array)],f.prototype,"gameStates",void 0),u([(0,n.Column)(()=>c.SizeField),y("design:type",c.SizeField)],f.prototype,"size",void 0),u([(0,n.Column)(),y("design:type",String)],f.prototype,"mask",void 0),u([(0,n.OneToOne)(()=>r.RoomEntity,{nullable:!0}),y("design:type",r.RoomEntity)],f.prototype,"room",void 0),u([(0,n.Column)(),y("design:type",String)],f.prototype,"ruleSet",void 0),t.GameEntity=f=u([(0,n.Entity)("Game")],f)},function(e,t,o){"use strict";t.__esModule=!0,t.UserEntity=void 0;var n=o(10),i=o(34),r=o(35),a=o(29),s=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},c=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};let l=class{};t.UserEntity=l,s([(0,n.PrimaryGeneratedColumn)("uuid"),c("design:type",String)],l.prototype,"id",void 0),s([(0,n.Column)(()=>a.MetadataField),c("design:type",a.MetadataField)],l.prototype,"meta",void 0),s([(0,n.Column)({unique:!0}),c("design:type",String)],l.prototype,"nick",void 0),s([(0,n.OneToMany)(()=>r.SessionEntity,e=>e.user),c("design:type",Array)],l.prototype,"sessions",void 0),s([(0,n.OneToOne)(()=>i.LoginEntity,e=>e.user,{cascade:!0}),(0,n.JoinColumn)(),c("design:type",i.LoginEntity)],l.prototype,"login",void 0),t.UserEntity=l=s([(0,n.Entity)("User")],l)},function(e,t,o){"use strict";t.__esModule=!0,t.GameStateEntity=void 0;var n=o(10),i=o(30),r=o(37),a=o(29),s=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},c=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};let l=class{};t.GameStateEntity=l,s([(0,n.PrimaryColumn)("uuid"),c("design:type",String)],l.prototype,"gameId",void 0),s([(0,n.PrimaryColumn)({type:"integer"}),c("design:type",Number)],l.prototype,"index",void 0),s([(0,n.Column)(()=>a.MetadataField),c("design:type",a.MetadataField)],l.prototype,"meta",void 0),s([(0,n.ManyToOne)(()=>i.GameEntity,e=>e.gameStates),c("design:type",i.GameEntity)],l.prototype,"game",void 0),s([(0,n.Column)({type:"integer",nullable:!0}),c("design:type",Number)],l.prototype,"turn",void 0),s([(0,n.Column)(()=>r.PointFieldNull),c("design:type",r.PointFieldNull)],l.prototype,"lastMove",void 0),s([(0,n.Column)({type:"simple-array"}),c("design:type",Array)],l.prototype,"data",void 0),t.GameStateEntity=l=s([(0,n.Entity)("GameState")],l)},function(e,t,o){"use strict";t.__esModule=!0,t.RoomEntity=void 0;var n=o(10),i=o(30),r=o(29),a=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},s=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};let c=class{static toRoom(e){return{roomId:e.id,gameId:e.gameId,name:e.name,hasPassword:!!e.passwordHash}}};t.RoomEntity=c,a([(0,n.PrimaryGeneratedColumn)("uuid"),s("design:type",String)],c.prototype,"id",void 0),a([(0,n.Column)(()=>r.MetadataField),s("design:type",r.MetadataField)],c.prototype,"meta",void 0),a([(0,n.Column)(),s("design:type",String)],c.prototype,"name",void 0),a([(0,n.Column)({nullable:!0}),s("design:type",Date)],c.prototype,"expires",void 0),a([(0,n.Column)(),s("design:type",String)],c.prototype,"passwordHash",void 0),a([(0,n.Column)("uuid",{nullable:!0}),s("design:type",String)],c.prototype,"gameId",void 0),a([(0,n.OneToOne)(()=>i.GameEntity,{nullable:!0}),(0,n.JoinColumn)(),s("design:type",i.GameEntity)],c.prototype,"game",void 0),t.RoomEntity=c=a([(0,n.Entity)("Room")],c)},function(e,t,o){"use strict";t.__esModule=!0,t.LoginEntity=void 0;var n=o(10),i=o(31),r=o(29),a=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},s=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};let c=class{};t.LoginEntity=c,a([(0,n.PrimaryGeneratedColumn)("uuid"),s("design:type",String)],c.prototype,"id",void 0),a([(0,n.Column)(()=>r.MetadataField),s("design:type",r.MetadataField)],c.prototype,"meta",void 0),a([(0,n.Column)(),(0,n.Index)({unique:!0}),s("design:type",String)],c.prototype,"username",void 0),a([(0,n.Column)(),s("design:type",String)],c.prototype,"passwordHash",void 0),a([(0,n.OneToOne)(()=>i.UserEntity,e=>e.login),s("design:type",i.UserEntity)],c.prototype,"user",void 0),a([(0,n.Column)("uuid",{nullable:!0}),s("design:type",String)],c.prototype,"userId",void 0),t.LoginEntity=c=a([(0,n.Entity)("Login")],c)},function(e,t,o){"use strict";t.__esModule=!0,t.SessionEntity=void 0;var n=o(10),i=o(31),r=o(29),a=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},s=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};let c=class{};t.SessionEntity=c,a([(0,n.PrimaryColumn)("uuid"),s("design:type",String)],c.prototype,"id",void 0),a([(0,n.Column)(()=>r.MetadataField),s("design:type",r.MetadataField)],c.prototype,"meta",void 0),a([(0,n.Column)(),s("design:type",String)],c.prototype,"nick",void 0),a([(0,n.ManyToOne)(()=>i.UserEntity,e=>e.sessions),s("design:type",i.UserEntity)],c.prototype,"user",void 0),a([(0,n.Column)("uuid",{nullable:!0}),s("design:type",String)],c.prototype,"userId",void 0),t.SessionEntity=c=a([(0,n.Entity)("Session")],c)},function(e,t,o){"use strict";t.__esModule=!0,t.isValidNick=function(e){return!!e&&!(e.length>n.validation.maxNickLength)&&/^[_a-z][-_a-z0-9]+[_a-z0-9]+/i.test(e)},t.isValidRoomName=function(e){return!(!e||e.length>n.validation.maxRoomNameLength)};var n=o(1)},function(e,t,o){"use strict";t.__esModule=!0,t.PointFieldNull=t.PointField=void 0;var n=o(10),i=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},r=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};class a{}t.PointField=a,i([(0,n.Column)({type:"integer"}),r("design:type",Number)],a.prototype,"x",void 0),i([(0,n.Column)({type:"integer"}),r("design:type",Number)],a.prototype,"y",void 0);class s{}t.PointFieldNull=s,i([(0,n.Column)({type:"integer",nullable:!0}),r("design:type",Number)],s.prototype,"x",void 0),i([(0,n.Column)({type:"integer",nullable:!0}),r("design:type",Number)],s.prototype,"y",void 0)},function(e,t,o){"use strict";t.__esModule=!0,t.SizeFieldNull=t.SizeField=void 0;var n=o(10),i=function(e,t,o,n){var i,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(r<3?i(a):r>3?i(t,o,a):i(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a},r=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};class a{}t.SizeField=a,i([(0,n.Column)({type:"integer"}),r("design:type",Number)],a.prototype,"width",void 0),i([(0,n.Column)({type:"integer"}),r("design:type",Number)],a.prototype,"height",void 0);class s{}t.SizeFieldNull=s,i([(0,n.Column)({type:"integer",nullable:!0}),r("design:type",Number)],s.prototype,"width",void 0),i([(0,n.Column)({type:"integer",nullable:!0}),r("design:type",Number)],s.prototype,"height",void 0)},function(e,t,o){"use strict";t.__esModule=!0,t.ruleSetMap=t.ruleSets=t.rulesReversed=t.rulesStandard=void 0;var n=o(40);function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{},n=Object.keys(o);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(o).filter(function(e){return Object.getOwnPropertyDescriptor(o,e).enumerable}))),n.forEach(function(t){r(e,t,o[t])})}return e}function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}const a=[{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}];function s(e,t,o){if(!e.boundsCheck(t))return[];const n=e.get(t);if(!n||!n.empty||!n.enabled)return[];function i({x:t,y:n},i){const r=[];for(;;){if(t+=i.x,n+=i.y,!e.boundsCheck({x:t,y:n}))return[];const a=e.get({x:t,y:n});if(!a||a.empty||!a.enabled)return[];if(a.color===o)return r;r.push(a)}}let r=[n];for(const e of a)r=[...r,...i(t,e)];return r.length<=1?[]:r}class c{constructor(){this.name="Standard",this.ruleSet="standard",this.colors=2,this.boardSize=Object.freeze({width:8,height:8})}isValid(e,t,o,i){return s(n.Board.fromGame(e,t),o,i).length>0}compareScores(e,t){return e-t}getValidMoves(e,t,o){const n=[],{size:{width:i,height:r}}=e;for(let a=0;a<i;++a)for(let i=0;i<r;++i){const r={x:a,y:i};this.isValid(e,t,r,o)&&n.push(r)}return n}isGameOver(e,t){const{colors:o}=this;for(let n=0;n<o;++n)if(this.getValidMoves(e,t,n).length>0)return!1;return!0}makeMove(e,t,o){const{turn:r,index:a}=t,c=n.Board.fromGame(e,t),l=s(c,o,r);if(0===l.length)return null;for(const e of l)e.color=r;const d=a+1,u=Object.freeze(i({},o)),y=c.getData(),{colors:f}=this;let p=null;for(let t=0;t<f;++t){const o=(r+1+t)%f;if(this.getValidMoves(e,{turn:o,index:d,data:y,lastMove:u},o).length>0){p=o;break}}return{turn:p,index:d,data:y,lastMove:u}}getScore(e,t,o){const i=n.Board.fromGame(e,t);let r=0;for(const e of i)e&&e.enabled&&e.color===o&&++r;return r}newGame(e){const{boardSize:t}=this,o=new n.Board;o.reset(t),o.get({x:3,y:3}).color=0,o.get({x:4,y:3}).color=1,o.get({x:3,y:4}).color=1,o.get({x:4,y:4}).color=0;const r=[{turn:0,index:0,data:o.getData(),lastMove:null}];return{gameId:e,ruleSet:this.ruleSet,mask:o.getMask(),colors:Object.freeze(["black","white"]),size:Object.freeze(i({},t)),gameStates:Object.freeze(r)}}}const l=new c;t.rulesStandard=l;const d=new class extends c{constructor(){super(...arguments),this.name="Reversed",this.ruleSet="reversed"}compareScores(e,t){return t-e}};t.rulesReversed=d;const u=[l,d];t.ruleSets=u;const y=new Map;t.ruleSetMap=y;for(const e of u)y.set(e.ruleSet,e)},function(e,t,o){"use strict";t.__esModule=!0,t.Board=void 0,o(15),o(12);var n=o(41),i=o(42),r=o(43),a=o(11);class s{constructor(){this.bounds=new i.Bounds(0,0,0,0),this.grid=new n.Grid(0,0)}reset({width:e,height:t}){const o=new n.Grid(e,t),a=64,s=64,c=6,l=6,d=new i.Bounds(.5,.5,1+e*(a+c)+c,1+t*(s+l)+l);for(let n=0;n<e;++n)for(let e=0;e<t;++e){const t={x:n,y:e},d=new i.Bounds(.5+n*(a+c)+c,.5+e*(s+l)+l,.5+a,.5+s);o.set({x:n,y:e},new r.Square(t,d))}Object.assign(this,{grid:o,bounds:d})}get width(){const{grid:{width:e}}=this;return e}get height(){const{grid:{height:e}}=this;return e}get({x:e,y:t}){const{grid:o}=this;return o.get({x:e,y:t})}boundsCheck({x:e,y:t}){const{grid:o}=this;return o.boundsCheck({x:e,y:t})}getData(){return Object.freeze(Array.from(this.grid).map(e=>e.empty?null:e.color))}setData(e){for(const[t,o]of(0,a.zip)(e,Array.from(this.grid)))o.color=t}getGameState(e){return{index:e,data:this.getData()}}getMask(){return Object.freeze(Array.from(this.grid).map(e=>e.enabled))}setMask(e){for(const[t,o]of(0,a.zip)(e,Array.from(this.grid)))o.enabled=t}static fromGame(e,t){const o=new s;return o.reset(e.size),o.setData(t.data),o.setMask(e.mask),o}[Symbol.iterator](){const{grid:e}=this;return e[Symbol.iterator]()}hitTest(e){for(const t of this)if(t.bounds.hitTest(e))return t;return null}}t.Board=s},function(e,t,o){"use strict";function n(e,{x:t,y:o}){if(!Number.isSafeInteger(t)||!Number.isSafeInteger(o))throw new Error(`(${t}, ${o}) is not valid`);if(!e.boundsCheck({x:t,y:o}))throw new Error(`(${t}, ${o}) is out of bounds`)}t.__esModule=!0,t.Grid=void 0,o(12);t.Grid=class{constructor(e,t){this.width=e,this.height=t,this.data=new Map}boundsCheck({x:e,y:t}){const{width:o,height:n}=this;return e>=0&&e<o&&t>=0&&t<n}get({x:e,y:t}){n(this,{x:e,y:t});const o=JSON.stringify({x:e,y:t});return this.data.get(o)}set({x:e,y:t},o){n(this,{x:e,y:t});const i=JSON.stringify({x:e,y:t});this.data.set(i,o)}[Symbol.iterator](){return function*(){const{width:e,height:t}=this;for(let o=0;o<e;++o)for(let e=0;e<t;++e)yield this.get({x:o,y:e})}.call(this)}}},function(e,t,o){"use strict";t.__esModule=!0,t.Bounds=void 0;t.Bounds=class{constructor(e,t,o,n){this.left=e,this.top=t,this.width=o,this.height=n}get bottom(){const{top:e,height:t}=this;return e+t}get right(){const{left:e,width:t}=this;return e+t}get center(){const{left:e,top:t,width:o,height:n}=this;return{x:e+.5*o,y:t+.5*n}}get n(){const{left:e,top:t,width:o}=this;return{x:e+.5*o,y:t}}get ne(){const{left:e,top:t,width:o}=this;return{x:e+o,y:t}}get e(){const{left:e,top:t,width:o,height:n}=this;return{x:e+o,y:t+.5*n}}get se(){const{left:e,top:t,width:o,height:n}=this;return{x:e+o,y:t+n}}get s(){const{left:e,top:t,width:o,height:n}=this;return{x:e+.5*o,y:t+n}}get sw(){const{left:e,top:t,height:o}=this;return{x:e,y:t+o}}get w(){const{left:e,top:t,height:o}=this;return{x:e,y:t+.5*o}}get nw(){const{left:e,top:t}=this;return{x:e,y:t}}hitTest({x:e,y:t}){const{top:o,right:n,bottom:i,left:r}=this;return e>=r&&e<=n&&t>=o&&t<=i}}},function(e,t,o){"use strict";t.__esModule=!0,t.Square=void 0;t.Square=class{constructor(e,t){this.position=e,this.bounds=t,this.enabled=!0,this.color=null}get empty(){return null===this.color}}},function(e,t,o){"use strict";t.__esModule=!0,t.app=void 0;var n=c(o(16)),i=c(o(17)),r=c(o(18)),a=c(o(19)),s=o(1);function c(e){return e&&e.__esModule?e:{default:e}}const l=(0,n.default)();t.app=l;for(const[e,t]of Object.entries(s.appSettings))l.set(e,t);l.use((0,a.default)(),n.default.static(r.default.join(__dirname,"www"))),i.default.extend(l,s.cspPolicy),l.use(o(20).json()),l.get("/health",(e,t)=>{t.writeHead(200),t.end()})},function(e){e.exports={colors:{aqua:{displayName:"Aqua",color:[180,90,55]},black:{displayName:"Black",color:[0,0,0]},blue:{displayName:"Blue",color:[240,90,55]},fuschsia:{displayName:"Fuchsia",color:[300,90,55]},gray:{displayName:"Gray",color:[0,0,55]},green:{displayName:"Green",color:[120,90,55]},orange:{displayName:"Orange",color:[30,90,55]},pink:{displayName:"Pink",color:[330,90,55]},purple:{displayName:"Purple",color:[270,90,55]},red:{displayName:"Red",color:[0,90,55]},white:{displayName:"White",color:[0,0,100]},yellow:{displayName:"Yellow",color:[55,90,55]}}}},function(e,t,o){"use strict";t.__esModule=!0,t.hashPassword=async function(e){const t=await(0,n.genSalt)();return await(0,n.hash)(e,t)},t.checkPassword=async function(e,t){return await(0,n.compare)(e,t)};var n=o(21)}];
//# sourceMappingURL=main~server.js.map