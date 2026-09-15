'use strict';
// Original classroom adaptations. No third-party artwork or media is copied.
const teachingRefs = [
 ['初一学生情绪管理系列课程的设计与实践｜李杰，2022','https://www.xljkzz.com/kechengsikao/30022.html'],
 ['初高中情绪接纳课的设计与实践｜林秀苗，2018','https://www.xljkzz.com/kechengsikao/15566.html'],
 ['社会情感学习教学资源｜教育部—联合国儿童基金会合作项目','https://www.unicef.cn/documents/sel-resources'],
 ['精神健康素养资源套（初中版）｜香港教育局','https://mentalhealth.edb.gov.hk/sc/promotion-at-the-universal-level/promotional-resources-for-schools/141.html'],
 ['儿童青少年心理健康与康复指南｜上海市精神卫生中心','https://www.smhc.org.cn/info/2711/18711.htm'],
 ['心理健康科普问答｜国家卫生健康委，2025-02-13','https://www.nhc.gov.cn/xcs/c100122/202502/b7b7f78f8b8b437abcb6dfca58e9f7c5.shtml']
];
function referenceList(){return `<ul>${teachingRefs.map(([title,url])=>`<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></li>`).join('')}</ul><p>参考教学结构与知识点，情境、文字和图示为本课重新编写。没有转载上述课件、图片或视频。参考资料需要联网阅读，课堂素材已随网页保存。</p>`}
function lessonHead(title,sub){return `<header class="teaching-heading"><h1>${title}</h1><p>${sub}</p></header>`}
function takeaway(text){return `<p class="teaching-takeaway">${text}</p>`}
function wordPalette(){return `${lessonHead('把“我不舒服”，说得更清楚。','先找一个接近的词，再说说它有多强。')}<div class="emotion-palette">${[['◡','期待','想试一试'],['≈','紧张','有些担心'],['⌁','委屈','感觉没被理解'],['!','生气','有些不满'],['☂','难过','失落、想哭'],['…','说不清','几种感觉混在一起']].map(([icon,word,desc],i)=>`<article class="emotion-word tone-${i}"><span aria-hidden="true">${icon}</span><div><h2>${word}</h2><p>${desc}</p></div></article>`).join('')}</div><section class="intensity-scale" aria-label="感受强度示意，不是心理测评"><h2>名称和强度，分开说</h2><div class="intensity-stops"><span><b>有一点</b>我有一点紧张</span><span><b>比较强</b>我比较紧张</span><span><b>很强烈</b>我很紧张</span></div></section>${takeaway('可以有多种感受，也可以暂时说不清。强度没有优劣。')}`}
function emotionJobs(){return `${lessonHead('情绪像提示灯：值得看看，不必照做。','先结合情境理解它，再选择行动。')}<div class="emotion-jobs"><div class="jobs-head"><span>感受</span><span>可能在提示什么</span><span>可以选择的一步</span></div>${[['≈','担心','我在意结果，或察觉到风险','做些准备，或找人一起判断'],['!','生气','我觉得受挫、不公平或不被尊重','说清需要，必要时离开冲突'],['☂','难过','我经历了失去、失望或分离','允许难过，找人陪一会儿'],['◡','开心','这件事让我感到满足或连接','享受这一刻，也可以分享']].map(([icon,feeling,meaning,action])=>`<article><h2><span aria-hidden="true">${icon}</span>${feeling}</h2><p>${meaning}</p><p>${action}</p></article>`).join('')}</div>${takeaway('这些是可能性，不是一一对应。情绪是线索，不是事实判决或行动命令。')}`}
function bodySignals(){return `${lessonHead('身体会留下线索，原因要一起看。','小宁明天要展示。下面这些反应，只是可能出现的例子。')}<div class="body-board"><div class="body-diagram"><svg viewBox="0 0 330 340" role="img" aria-label="身体信号示意：肩膀紧、心跳快、手心出汗、胃部不适"><circle cx="165" cy="54" r="31" fill="#e9b995"/><path d="M130 93Q165 77 200 93L218 201L195 218L195 318H166L155 239L148 318H119V211L107 198Z" fill="#245164"/><path d="M131 99L99 160L89 224M198 99L230 160L242 224" fill="none" stroke="#e9b995" stroke-width="21" stroke-linecap="round"/><circle cx="139" cy="100" r="9" fill="#e4ef80"/><circle cx="177" cy="134" r="9" fill="#e4ef80"/><circle cx="166" cy="185" r="9" fill="#e4ef80"/><circle cx="88" cy="224" r="9" fill="#e4ef80"/><g fill="none" stroke="#527988" stroke-width="2"><path d="M139 100H62V70H16M177 134H253V104H312M166 185H260V197H312M88 224H30V265H15"/></g></svg><span class="body-label shoulder">肩膀绷紧</span><span class="body-label heart">心跳变快</span><span class="body-label stomach">胃里不舒服</span><span class="body-label palm">手心出汗</span></div><section class="signal-questions"><article><span>先描述</span><h2>“我注意到，肩膀有点紧。”</h2></article><article><span>再了解</span><h2>“刚发生了什么？我有没有累？”</h2></article><article><span>需要时找帮助</span><h2>“身体不舒服，可以告诉老师或校医。”</h2></article></section></div>${takeaway('心跳快也可能是刚活动过。不能只凭一个身体信号判断情绪。')}`}
function storyComic(){return `${lessonHead('同一件事，脑中可能出现不同版本。','观察、解释和行动，分开来看。')}<div class="teaching-comic"><article class="comic-panel fact-panel"><span class="panel-number">01 · 发生的事</span><img src="${asset('assets/greeting.webp')}" alt="校园走廊中，一名学生打招呼，另一名暂未回应"><h2>我打招呼，他没回应。</h2><p>这是我看到、听到的。</p></article><article class="comic-panel thought-panel"><span class="panel-number">02 · 脑中的解释</span><div class="thought-cloud"><b>“他不想理我？”</b><span>可能委屈，想躲开</span></div><div class="thought-cloud alternative"><b>“原因还不清楚。”</b><span>仍可能担心，也能再了解</span></div></article><article class="comic-panel action-panel"><span class="panel-number">03 · 可以怎么做</span><div class="comic-dialogue"><span>“刚才你是不是没听见？”</span><span>需要时，请老师帮忙。</span></div><h2>选一个安全的核实方式。</h2><p>不需要强迫自己乐观。</p></article></div>${takeaway('解释会影响感受，真实处境也很重要。受到伤害时，可以直接求助。')}`}
function expressionLesson(){return `${lessonHead('把感受说出来，也把请求说具体。','用“借走笔记没有先问”的虚构故事，练三句话。')}<div class="expression-steps"><article class="fact-panel"><span>01 · 说事实</span><h2>“你拿走笔记前，<br>没有问我。”</h2><p>描述一件事，少用“你总是”。</p></article><article class="thought-panel"><span>02 · 说感受与需要</span><h2>“我有点生气，<br>我希望先被问一下。”</h2><p>说自己的感受，不替别人下结论。</p></article><article class="action-panel"><span>03 · 提具体请求</span><h2>“下次借之前，<br>可以先问我吗？”</h2><p>请求越具体，越容易讨论。</p></article></div>${takeaway('这样说能帮助表达，但不保证对方配合。被威胁或羞辱时，先保护自己、找大人。')}`}
function supportMap(){return `${lessonHead('求助，可以从一句话开始。','不必等到特别严重，才值得被帮助。')}<div class="support-map"><article><span class="map-symbol" aria-hidden="true">◎</span><h2>可以找谁</h2><p>可信任的家人<br>班主任或心理老师<br>校医或专业人员</p></article><article><span class="map-symbol" aria-hidden="true">“</span><h2>第一句怎么说</h2><p class="help-quote">“最近这件事让我很难受，<br>也影响了上课。<br>可以找个时间帮我吗？”</p></article><article><span class="map-symbol" aria-hidden="true">↗</span><h2>没帮上忙怎么办</h2><p>再找另一位可信任的大人。<br>可以请朋友陪同，<br>不用独自承担。</p></article></div><p class="support-urgent"><strong>涉及伤害或眼前危险：</strong>先到安全处，立即找能提供帮助的大人；不要独自等待消息。</p>`}
function practiceBridge(){return `${lessonHead('练习之后，把方法带回生活。','不评谁更放松。我们关心：发现了什么，下一步怎么做？')}<div class="bridge-steps"><article><span>① 刚才</span><h2>我的注意在哪里？</h2><p>颜色、边缘、身体支撑，或者又想到了别的事。</p></article><article><span>② 发现</span><h2>走神之后，发生了什么？</h2><p>可以再回来；不舒服时，也可以停下来。</p></article><article><span>③ 下一步</span><h2>现在愿意先做什么？</h2><p>“我先圈出一个问题，下课请老师帮我。”</p></article></div>${takeaway('观察是短暂的缓冲。练完以后，困难仍可以继续处理，也可以求助。')}`}
const baseDetailedTheory=detailedTheory, baseReviewView=reviewView, baseOpenTeacher=openTeacher;
theoryDetails[5].push({title:'表达感受：事实、需要、具体请求。',concept:'把观察到的事、自己的感受与需要、具体请求分别说清楚。',key:'分别说清楚',compare:'表达不是指责，也不保证对方配合。',example:'借笔记前没问我，我有点生气；下次请先问我。',apply:'只练虚构的借笔记情境。',image:'friends.webp',source:'李杰（2022）；社会情感学习教学资源',notes:'用教学示例练表达，不要求学生讲出本人冲突经历。事实描述与意图推断分开；请求应具体、可讨论。说明发生欺凌或威胁时，不要求受伤害者先完成沟通练习才能求助。'});
theoryDetails[7].push({title:'支持网络：找谁、怎样说、继续找。',concept:'支持可以来自不同的人。求助不是一次机会用完就结束。',key:'不同的人',compare:'同伴能陪伴，但不能独自承担危机处理。',example:'先向可信任的大人说明困扰；未得到帮助时，再找另一位。',apply:'默想一位可以联系的人，不必向全班说出姓名。',image:'teacher.webp',source:'上海市精神卫生中心；香港教育局初中资源套',notes:'不设必须持续若干天才能求助的门槛。困扰影响生活时及时寻求支持，眼前风险立即寻求成人或应急帮助。若家庭成员本身造成威胁，可选择学校等家庭外的可信任成人。'});
detailedTheory=function(){
 if(step===0&&theoryPage===1)return wordPalette();
 if(step===1&&theoryPage===1)return emotionJobs();
 if(step===1&&theoryPage===2)return bodySignals();
 if(step===2&&theoryPage===1)return storyComic();
 if(step===5&&theoryPage===2)return expressionLesson();
 if(step===7&&theoryPage===2)return supportMap();
 return baseDetailedTheory();
};
reviewView=function(){if(step===4)return practiceBridge();if(step===7)return supportMap();return baseReviewView()};
renderers[6]=function(){return `${lessonHead('替故事里的人，练一次表达。','同桌轮流说，也可以自己默想。无需讲私人经历。')}<div class="expression-practice"><section><div class="practice-story"><span>虚构情境</span><h2>朋友借走了你的笔记，<br>没有先问你。</h2></div><div class="speaking-frame"><p><b>事实</b>“刚才……”</p><p><b>感受与需要</b>“我有点……，我希望……”</p><p><b>请求</b>“下次可以……吗？”</p></div><p class="listener-task">听的人复述：“我听到，你希望……”</p></section>${timerPanel('pair')}</div>`};
// Keep all media controls. Add purpose before the practice, reflection after it.
const baseGrounding=renderers[4];
renderers[4]=function(){return baseGrounding().replace('选择一种练习即可。','把注意带回眼前，给下一步留一点空间。选择一种练习即可。')};
const teachingNotes={
 0:['词汇与强度','请大家替明天要展示的小宁找一个接近的情绪词，再用“有点、比较、很”描述强度。说不清、几种都有，也可以。不是给心理健康打分。'],
 1:['功能与身体线索','“担心可能提醒准备，生气可能与受挫有关，但这都不是唯一解释。”身体图是示例，不是诊断图。练一句：我注意到……，还需要了解……。'],
 2:['三格漫画','逐格区分事件、解释、可选行动。请学生说出另一种可能，不要求猜中真相。结束时强调：真实伤害需要处理，不能用换想法替代帮助。'],
 4:['观察练习闭环','30秒说明用途，60秒任选一个练习，90秒自愿分享与迁移。回顾时不问“谁放松了”，问注意在哪里、如何回来、下一步做什么。没人分享时示范：我注意到笔帽上的一条线，等会儿先圈出不会的题。'],
 5:['表达理论','原问题解决内容保留。三分钟理论中，用约一分钟讲事实、感受与需要、具体请求；把新例子用于下一站演练，不另加课时。'],
 6:['三分钟同桌演练','30秒读虚构故事；60秒甲说、乙复述；60秒交换；30秒各自检查：说清了一件事吗？请求具体吗？不愿发言者可默想或看示例。不评价真实同学或公开冲突。示例：你借笔记前没问我，我有点生气，希望先被问一下，下次可以先问吗？'],
 7:['对话示范与支持地图','四分钟活动：说明30秒，原有字幕动画或45秒有声短片二选一，辨认回应方式约75秒，同桌练一句约90秒。两分钟回顾：看支持地图，默想可联系的人；不要求报姓名。示范“最近很难受，想找个时间请您帮忙”。第一位没回应可继续找，眼前危险不独自等消息。']
};
openTeacher=function(){baseOpenTeacher();const n=teachingNotes[step];if(n){const block=document.createElement('section');block.className='note-block teaching-note';const h=document.createElement('h3');h.textContent='本次教学优化 · '+n[0];const p=document.createElement('p');p.textContent=n[1];block.append(h,p);$('#teacherContent').prepend(block)}const refs=document.createElement('details');refs.innerHTML='<summary>国内教学参考与改编说明</summary>'+referenceList();$('#teacherContent').append(refs)};
const oldPromptNow=promptNow;
promptNow=function(kind){if(kind!=='pair')return oldPromptNow(kind);const elapsed=total-remaining;if(elapsed<30)return '读一读故事，先想一句话。';if(elapsed<90)return '一人表达，另一人认真复述。';if(elapsed<150)return '交换角色，再练一次。';return '请求具体吗？表达安全吗？'};
titles[6]='把感受说清楚';
visualLessons[6]=['把感受，说清楚。','friends.webp','用虚构故事练习',['说事实','说感受与需要','提请求'],['刚才发生了什么','我有点……','下次可以……吗'],'具体表达，也可以寻求帮助。'];
recapVisual[6]=['说清楚，比贴标签更有用。','描述一件事，说出感受与需要，再提一个具体请求。'];
teacherNotes[6].goal='在虚构情境中练习安全、具体的感受表达，并通过同伴复述确认理解。';
teacherNotes[6].script='“今天练的是借笔记的故事。你可以自己默想，也可以轮流说。听的人复述需要，不评价谁对谁错。”';
lessons[6].basis='情绪表达 · 事实、感受与需要、请求';
lessons[6].intro='把观察、感受与需要、具体请求分开表达。';
lessons[6].cards=[['事实','你借走笔记之前没有问我。'],['感受与需要','我有点生气，希望先被问一下。'],['具体请求','下次借之前可以先问我吗？']];
lessons[6].question='怎样让对方更清楚你希望什么？';
lessons[6].answer='说清一件事和自己的感受，再提出具体请求。';
lessons[6].transfer='表达不保证对方配合。遇到伤害或威胁时，先保护自己、找大人。';
courseSections[2].items=['观察练习与小行动','把感受和请求说清楚'];
document.addEventListener('click',e=>{if(e.target.closest('[data-sources]')){const section=document.createElement('section');section.innerHTML='<h2>国内教学参考</h2>'+referenceList();$('#teacherContent').append(section)}});
render();
