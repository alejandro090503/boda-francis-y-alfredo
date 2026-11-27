import numpy as np, os
from PIL import Image, ImageFilter
B='C:/Users/aleja/'
O='C:/Users/aleja/boda-francis-y-alfredo/assets/'
def hx(s): s=s.lstrip('#'); return np.array([int(s[i:i+2],16) for i in (0,2,4)],float)
def gmap(L,stops):
    xs=[s[0] for s in stops]
    return np.stack([np.interp(L,xs,[hx(s[1])[c] for s in stops]) for c in range(3)],-1)
def blur_ch(a,r): return np.asarray(Image.fromarray((a*255).astype('uint8')).filter(ImageFilter.GaussianBlur(r)),float)/255
def proc(src,out,stops,width,sigma,pad=0,fade=False,gamma=1.0,flush=False):
    im=Image.open(src).convert('RGBA')
    h=round(im.height*width/im.width); im=im.resize((width,h),Image.LANCZOS)
    if pad and not flush:
        c=Image.new('RGBA',(width+2*pad,h+2*pad),(0,0,0,0)); c.paste(im,(pad,pad)); im=c
    a=np.asarray(im,float)/255
    L=(.299*a[...,0]+.587*a[...,1]+.114*a[...,2])
    lo,hi=np.percentile(L[a[...,3]>.5],3),np.percentile(L[a[...,3]>.5],97)
    L=np.clip((L-lo)/(hi-lo),0,1)**gamma
    rgb=gmap(L,stops)/255
    al=a[...,3]
    if fade:  # alfa a 0 radialmente en las orillas
        H,W=al.shape; yy,xx=np.mgrid[0:H,0:W]
        r=np.hypot((xx-W/2)/(W/2),(yy-H/2)/(H/2)); al=al*np.clip((1-r)/.28,0,1)
    # desenfoque horneado con color premultiplicado, alfa suavizado también
    pm=[blur_ch(rgb[...,c]*al,sigma) for c in range(3)]
    ab=blur_ch(al,sigma*1.15)
    col=np.stack([p/np.maximum(ab,.003) for p in pm],-1).clip(0,1)
    res=np.dstack([col,ab]); img=Image.fromarray((res*255+.5).astype('uint8'),'RGBA')
    img.save(O+out,quality=82,alpha_quality=90,method=6)
    print(out,img.size,round(os.path.getsize(O+out)/1024),'KB')
    return img
S_ROSA=[(0,'#2a1d5c'),(.3,'#996515'),(.62,'#DDBF86'),(1,'#F3E2BF')]
S_PEON=[(0,'#11053b'),(.45,'#2e2360'),(.78,'#C9A15D'),(1,'#F7E7CE')]
S_RAMA=[(0,'#5e3c08'),(.4,'#996515'),(.75,'#E8D2A6'),(1,'#FCF8F1')]
proc(B+'boda-cadmiel-y-leonardo/assets/adorno-rosas.webp','ador-rosas.webp',S_ROSA,420,9,pad=36,fade=True)
proc(B+'boda-cadmiel-y-leonardo/assets/adorno-flor-azul.webp','ador-peonia.webp',S_PEON,420,9,pad=36,fade=True)
proc(B+'boda-cadmiel-y-leonardo/assets/adorno-rama.webp','ador-rama.webp',S_RAMA,420,8,flush=True)
# sprites de caída (nítidos, pequeños), pétalos reales recoloreados
def sprite(n,out,stops,size=120):
    im=Image.open(B+f'boda-andrea-giovana-gomez-sanchez-luis-uriel-licona-rojas/flores/petalo-{n}.webp').convert('RGBA')
    im.thumbnail((size,size),Image.LANCZOS)
    a=np.asarray(im,float)/255; al=a[...,3]
    L=.299*a[...,0]+.587*a[...,1]+.114*a[...,2]
    m=al>.5; lo,hi=np.percentile(L[m],3),np.percentile(L[m],97)
    L=np.clip((L-lo)/(hi-lo),0,1)
    rgb=gmap(L,stops)/255
    # pequeños destellos metálicos: leve brillo en bordes
    img=Image.fromarray((np.dstack([rgb,al])*255+.5).astype('uint8'),'RGBA')
    img.save(O+out,quality=88,alpha_quality=95,method=6); print(out,img.size,os.path.getsize(O+out))
sprite(4,'caida-1.webp',[(0,'#996515'),(.5,'#E3C98F'),(1,'#FBEDCF')])
sprite(1,'caida-2.webp',[(0,'#11053b'),(.55,'#3b2d68'),(1,'#C9B9A0')])
sprite(6,'caida-3.webp',[(0,'#B98A3E'),(.5,'#E8D2A6'),(1,'#FBEDCF')])
