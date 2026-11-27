import numpy as np, os
from PIL import Image, ImageFilter
SRC='C:/Users/aleja/save-the-date-lekshmy-jaylin/'
OUT='C:/Users/aleja/boda-francis-y-alfredo/ink/'
def hx(s): s=s.lstrip('#'); return np.array([int(s[i:i+2],16) for i in (0,2,4)],float)
# t: 0 = muy claro (fondo) -> 1 = más oscuro (acento)
STOPS=[(0,'#FCF8F1'),(.16,'#F7E7CE'),(.38,'#E8D2A6'),(.60,'#C9A15D'),(.80,'#4a3a78'),(1,'#11053b')]
def gmap(t):
    xs=[s[0] for s in STOPS]; out=np.zeros(t.shape+(3,))
    for c in range(3):
        out[...,c]=np.interp(t,xs,[hx(s[1])[c] for s in STOPS])
    return out
for n in ['hero','top','oval','corner','footer']:
    im=Image.open(SRC+f'ink-{n}.jpg').convert('RGB')
    L=np.asarray(im.convert('L'),float)/255
    lo,hi=np.percentile(L,2),np.percentile(L,98.5)
    t=np.clip((hi-L)/(hi-lo),0,1)**1.25
    t*=.78   # techo: el tono más oscuro solo en los pliegues más hondos
    base=gmap(t)
    G=np.asarray(Image.fromarray((L*255).astype('uint8')).filter(ImageFilter.GaussianBlur(5)),float)/255
    vet=np.clip((G-L)*6,0,1)
    h,w=L.shape; yy,xx=np.mgrid[0:h,0:w]; d=(xx/w*.6+yy/h*.4)
    foil=np.stack([np.interp(d,[0,.25,.5,.75,1],[hx(c)[k] for c in ['#996515','#d9b57a','#fbedcf','#c99a52','#996515']]) for k in range(3)],-1)
    a=(vet*.85)[...,None]
    res=base*(1-a)+foil*a
    img=Image.fromarray(res.clip(0,255).astype('uint8'))
    img=img.resize((640,1147),Image.LANCZOS)
    q=80
    while True:
        img.save(OUT+f'{n}.webp',quality=q,method=6)
        sz=os.path.getsize(OUT+f'{n}.webp')/1024
        if sz<=118 or q<=40: break
        q-=6
    if sz<50: img.save(OUT+f'{n}.webp',quality=92,method=6); sz=os.path.getsize(OUT+f'{n}.webp')/1024
    print(n,round(sz),'KB q',q)
