"""Local classroom inference. No chat logs; model and assets stay on this Mac."""
import os, sys, json, time, secrets, re, argparse, socket
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', HF_HUB_DISABLE_TELEMETRY='1', TOKENIZERS_PARALLELISM='false')
# Enforce no outbound connections, including model loading and generation.
def offline_guard(event, args):
    if event == 'socket.connect':
        raise PermissionError('Offline classroom blocks ALL outbound connections, including proxies')
sys.addaudithook(offline_guard)
SYSTEM = '你帮助初中生练习表达，不是心理咨询师。虚构故事：同学打断了小宁的发言，用户扮演小宁。你回应小宁，不扮演打断者。只写简体中文，最多两句、90字。语气温和，不批评学生，不保证效果，不猜测别人的动机。不追问私人经历，不诊断、不评分；真实困扰请找现场老师。'
MODEL = TOKENIZER = None
sessions = {}
ROOT = Path(__file__).resolve().parent.parent
SECRET = secrets.token_urlsafe(32)

def answer(messages):
    from mlx_lm import generate
    from mlx_lm.sample_utils import make_sampler
    if len(messages)==1:
        task='回应学生的感受和需要，再问一个帮助表达的小问题。'
        examples=[{'role':'user','content':'我不高兴，我还没有说完。'},{'role':'assistant','content':'被打断让你不高兴，你希望把话说完。你想请同学等一下，还是下课再聊？'}]
    else:
        task='写一句小宁可以直接对同学说的台词：用“我”指小宁，“你”指同学，给出具体请求，如等我讲完再补充、下课再聊。不能只说互相尊重。然后提醒可以修改这句话。'
        examples=[{'role':'user','content':'希望他别打断我，等我说完。'},{'role':'assistant','content':'“我还没说完，请你等我讲完，再说你的想法，好吗？”你可以换成自己习惯的说法。'},{'role':'user','content':'我想私下说，不想当众讲。'},{'role':'assistant','content':'“下课后，我想和你聊聊刚才被打断的事，可以吗？”你可以按自己的意愿修改。'},{'role':'user','content':'我很生气，怎么说又不骂人？'},{'role':'assistant','content':'“刚才我还没说完就被打断，有点生气，请你等我说完再补充，好吗？”你可以改成更习惯的说法。'}]
    # Check the actual generated text; no canned substitute is sent as AI.
    def usable(text):
        if not text or len(text)>150: return False
        forbidden=['你打断','我打断','打断别人让你','打断他人','你应该','学会尊重','平静','冷静','肯定会','一定会','不礼貌','I feel','没人的地方','避免了冲突','保证你']
        if any(word in text for word in forbidden):return False
        if len(messages)>1:
            return '我' in text and bool(re.search(r'等我|等你|说完|讲完|下课|私下|不要打断|先听',text))
        return True
    for attempt in range(3):
        extra='' if attempt==0 else '请重新组织：小宁是被同学打断的人。直接回应这次输入；请求要落实到等我说完或下课再聊，不说空泛的道理。'
        prompt = TOKENIZER.apply_chat_template([{'role':'system','content':SYSTEM+task+extra}]+examples+messages, tokenize=False, add_generation_prompt=True)
        result = generate(MODEL, TOKENIZER, prompt=prompt, max_tokens=180, sampler=make_sampler(temp=0.2+attempt*0.2), verbose=False).strip()
        if usable(result):return result
    raise RuntimeError('Generated wording did not pass classroom checks')

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw): super().__init__(*a, directory=str(ROOT), **kw)
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        super().end_headers()
    def valid_host(self): return self.headers.get('Host') == '127.0.0.1:'+str(self.server.server_port)
    def reply(self, data, code=200):
        raw=json.dumps(data,ensure_ascii=False).encode()
        self.send_response(code); self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
    def do_GET(self):
        if not self.valid_host(): return self.reply({'error':'请从本机课堂地址打开。'},403)
        path=urlparse(self.path).path
        if path=='/api/health': return self.reply({'app':'emotion-explorers-local-ai','ready':True,'offline':True,'token':SECRET,'model':'Qwen2.5-1.5B-Instruct · 本机生成'})
        if path.startswith('/api/') or path.startswith('/local-ai/'): return self.reply({'error':'不存在'},404)
        super().do_GET()
    def do_POST(self):
        origin='http://127.0.0.1:'+str(self.server.server_port)
        if not self.valid_host() or self.headers.get('Origin',origin)!=origin or self.headers.get('X-Classroom-Token')!=SECRET:
            return self.reply({'error':'请从本机课堂重新开始。'},403)
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=4096: return self.reply({'error':'输入过长。'},413)
            data=json.loads(self.rfile.read(size))
            if not isinstance(data,dict): raise ValueError()
        except (ValueError,TypeError): return self.reply({'error':'无法读取输入。'},400)
        if self.path=='/api/start':
            sessions.clear(); sid=secrets.token_urlsafe(20);sessions[sid]={'messages':[],'time':time.monotonic()}
            return self.reply({'session':sid})
        if self.path=='/api/clear':
            sessions.clear(); return self.reply({'cleared':True})
        if self.path!='/api/agent': return self.reply({'error':'不存在'},404)
        s=sessions.get(data.get('session'))
        if not s or time.monotonic()-s['time']>900: return self.reply({'error':'本轮已结束，请重新开始。'},409)
        if len(s['messages'])>=4: return self.reply({'error':'两轮完成，请让学生选择、修改建议。'},409)
        text=data.get('text','')
        if not isinstance(text,str) or not 1<=len(text.strip())<=180: return self.reply({'error':'请输入1—180字。'},400)
        text=text.strip()
        if re.search(r'(自杀|自残|不想活|想死|杀死|割腕|伤害自己|被性侵|正在被打)',text):
            sessions.clear()
            return self.reply({'safety':True,'text':'暂停演示。如果这涉及真实的伤害或危险，请现在告诉现场老师，由老师陪同提供帮助；不用在全班继续讲述。'})
        if re.search(r'(?<!\d)1[3-9]\d{9}(?!\d)|\b\d{17}[0-9Xx]\b',text):
            return self.reply({'error':'请删除电话号码或身份信息，只练习小宁的虚构故事。'},400)
        if re.search(r'(替我骂|帮我骂|让他丢脸|报复他|羞辱他)',text):
            return self.reply({'error':'课堂提示：这里不代写辱骂或报复的话。请改为小宁的感受或希望，再练一次表达。'},400)
        messages=s['messages']+[{'role':'user','content':text}]
        try: result=answer(messages)
        except Exception: return self.reply({'error':'这次未生成通过课堂检查的说法。请改写一句，或由老师和同桌继续练习。'},503)
        s['messages']=messages+[{'role':'assistant','content':result}]
        self.reply({'text':result,'round':len(s['messages'])//2,'done':len(s['messages'])>=4})

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--model',required=True);parser.add_argument('--port',type=int,default=8767);args=parser.parse_args()
    model_dir=Path(args.model).resolve()
    if not (model_dir/'model.safetensors').is_file(): sys.exit('模型尚未准备好，请先完成一次联网准备。')
    print('正在加载本地模型；不会连接外部服务。',flush=True)
    from mlx_lm import load
    MODEL,TOKENIZER=load(str(model_dir))
    server=HTTPServer(('127.0.0.1',args.port),Handler)
    print('课堂已就绪：http://127.0.0.1:'+str(args.port)+'/?offline-ai=1',flush=True)
    try: server.serve_forever()
    except KeyboardInterrupt: print("课堂已关闭。",flush=True)
    finally: sessions.clear();server.server_close()
