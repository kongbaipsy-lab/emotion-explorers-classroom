'use strict';
// Two real local-model turns, then student evaluation. No preset AI replies.
const agentState={ready:false,checked:false,token:'',session:'',round:0,busy:false,reply:'',draft:'',stopped:false,serial:0};
let agentClearPending=Promise.resolve();
const escapeAgent=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function agentView(){return `${lessonHead('请AI帮忙，再由我们判断。','两轮交流 · 只演小宁的故事，不讲真实隐私。')}<div class="agent-grid"><section class="agent-story"><span class="agent-badge">虚构角色 · 小宁</span><h2>小组展示时，<br>同学打断了我的话。</h2><p>我有点生气，希望把话说完。<br>我可以怎样表达？</p><p class="agent-caution">一人扮演小宁，其他同学观察。可以旁观或随时停止。AI可能说错，老师会一起判断。</p></section><section class="agent-panel"><p id="agentStatus" class="agent-status"></p><div id="agentReply" class="agent-response" aria-live="polite"></div><label for="agentInput">替小宁说一句话</label><textarea id="agentInput" maxlength="180" rows="2" placeholder="刚才我被打断了，有点生气……">${escapeAgent(agentState.draft)}</textarea><div class="agent-actions"><button id="agentSend">请AI回应</button><button id="agentStop">停止并清空</button><button id="agentReset">重新开始</button></div></section></div><div class="agent-review"><span>① 回应感受了吗？</span><span>② 请求具体、安全吗？</span><span>③ 我想保留或改哪句？</span></div>`};
function agentPaint(){
 const status=document.getElementById('agentStatus');if(!status)return;
 status.textContent=agentState.ready?'本机离线AI · '+agentState.round+' / 2轮':agentState.checked?'离线AI需从授课电脑的“启动离线AI课堂”打开':'正在检查本机AI';
 document.getElementById('agentReply').textContent=agentState.reply||(agentState.ready?'先替小宁说一句，我会现场生成回应。':'普通网页可查看课程；实时AI需要事先准备本地模型。');
 document.getElementById('agentSend').disabled=!agentState.ready||agentState.busy||agentState.round>=2||agentState.stopped;
 document.getElementById('agentSend').textContent=agentState.busy?'正在本机思考…':agentState.round>=2?'两轮完成，轮到我们判断':'请AI回应';
 document.getElementById('agentInput').disabled=agentState.busy||agentState.round>=2||agentState.stopped;
 requestAnimationFrame(fitScreen);
}
async function agentCheck(){
 if(location.hostname!=='127.0.0.1'){agentState.checked=true;agentPaint();return}
 try{const r=await fetch('/api/health',{signal:AbortSignal.timeout(5000),cache:'no-store'});if(!r.ok)throw Error();const d=await r.json();agentState.ready=d.app==='emotion-explorers-local-ai'&&d.ready===true&&d.offline===true;agentState.token=d.token||'';}catch{agentState.ready=false}
 agentState.checked=true;agentPaint();
}
async function agentPost(path,data){const r=await fetch('/api/'+path,{method:'POST',headers:{'Content-Type':'application/json','X-Classroom-Token':agentState.token},body:JSON.stringify(data),signal:AbortSignal.timeout(45000)});const d=await r.json();if(!r.ok)throw Error(d.error||'暂时没有完成，请重试。');return d}
async function agentSend(){
 if(agentState.busy||!agentState.ready||agentState.round>=2||agentState.stopped)return;
 const input=document.getElementById('agentInput');const text=input.value.trim();if(!text)return;
 agentState.draft=text;agentState.busy=true;agentState.reply='正在本机生成…';const serial=agentState.serial;agentPaint();
 try{await agentClearPending;if(serial!==agentState.serial)return;if(!agentState.session){const s=await agentPost('start',{});if(serial!==agentState.serial)return;agentState.session=s.session}const d=await agentPost('agent',{session:agentState.session,text});if(serial!==agentState.serial)return;agentState.reply=d.text;agentState.round=d.round||agentState.round;agentState.stopped=!!d.safety;agentState.draft='';const field=document.getElementById('agentInput');if(field)field.value='';}
 catch(e){if(serial===agentState.serial)agentState.reply=e.name==='TimeoutError'?'生成超时。请重新开始，或由同桌继续练习。':e.message;}
 finally{if(serial===agentState.serial){agentState.busy=false;agentPaint()}}
}
function agentClear(stopped){agentState.serial++;agentState.session='';agentState.round=0;agentState.draft='';agentState.busy=false;agentState.stopped=stopped;agentState.reply=stopped?'已停止并清空。现在由老师和同学一起讨论。':'';const f=document.getElementById('agentInput');if(f)f.value='';if(agentState.ready)agentClearPending=agentPost('clear',{}).catch(()=>{});agentPaint();if(!stopped&&!agentState.ready)agentCheck()}

// Preserve the latest two-round peer practice. Reallocate three minutes within its 12 minutes.
workshopSlides[14].m=1;workshopSlides[14].notes='两人各30秒反馈，只说听懂的一处和还需说明的一处；不评分、不评价人格。';
workshopSlides[15].m=1;workshopSlides[15].notes='用40秒结合刚才的反馈讲清事情、感受与需要、具体请求；20秒各自确定想修改的一处。';
workshopSlides[17].m=1;workshopSlides[17].notes='自己对照20秒，同桌各20秒：保留哪句、修改哪处。也可以指出AI建议哪里不合适，不要求都有明显进步。';
const oldFeedbackView=workshopSlides[14].view;
workshopSlides[14].view=()=>oldFeedbackView().replace('甲反馈60秒，再交换。','甲反馈30秒，再交换。');
const oldCompareView=workshopSlides[17].view;
workshopSlides[17].view=()=>oldCompareView().replace('先自己对照30秒，同桌各说30秒，再邀请1位分享。','先自己对照20秒，同桌各说20秒。');
workshopSlides.splice(17,0,{g:4,m:3,name:'AI辅助表达',kind:'课堂试用 · 两轮交流',ai:true,view:agentView,notes:'30秒说明只扮演小宁，不讲真实隐私；60—90秒两轮输入和AI回应；30秒学生选择或修改一句；30秒全班判断是否回应感受、请求是否具体安全。老师陪同输入，其他同学一起观察。无人自愿时教师扮演小宁。AI可能理解错或生成失败，随时停止，改由同桌或老师回应，不用预设话术冒充AI。真实困扰课后单独支持，不继续公开追问。'});
const beforeAgentRender=render;
render=function(){beforeAgentRender();if(workshopSlides[workshopIndex].ai)agentPaint()};
const beforeAgentMove=workshopMove;
workshopMove=function(index){if(index<0||index>=workshopSlides.length)return;if(workshopSlides[workshopIndex].ai)agentClear(true);if(workshopSlides[index].ai)agentClear(false);beforeAgentMove(index)};
const beforeAgentTeacher=openTeacher;
openTeacher=function(){beforeAgentTeacher();const el=$('#teacherContent');el.innerHTML=el.innerHTML.replace('课堂不使用实时AI问答。','本地AI仅用于教师主持的虚构表达练习；未启动本地模型时改为同桌练习。')};
document.addEventListener('input',e=>{if(e.target.id==='agentInput')agentState.draft=e.target.value});
document.addEventListener('click',e=>{if(e.target.closest('#agentSend'))agentSend();if(e.target.closest('#agentStop'))agentClear(true);if(e.target.closest('#agentReset'))agentClear(false)});
render();agentCheck();
if(new URLSearchParams(location.search||'').get('demo')==='1')workshopMove(workshopSlides.findIndex(s=>s.ai));
