export function lerp(a, b, t){
    return (1-t)*a+t*b
}

export function lerpClamped(a, b, t){
    if(t <= 0) return a;
    if(t >= 1) return b;
    return lerp(a, b, t);
}

export function inverseLerp(a, b, v){
    return (v - a) / (b - a);
}