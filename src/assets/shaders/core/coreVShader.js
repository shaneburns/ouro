function coreVShader(){
    return classicnoise3D() + `
    
    varying vec2 vUv;
    varying float noise;
    uniform float time;
    uniform float turbScale;

    float turbulence(vec3 p){
        float w = 100.0;
        float t = -.35;
        for(float f = 1.0; f<=10.0;f++){
            float power = pow(2.0,f);
            t+=abs(pnoise(vec3(power*p), vec3(10.0,10.0,10.0)) / power);
        }
        return t/turbScale;
    }
    void main(){
        vUv = uv;
        noise = 10.0 * -.10 * turbulence(.5 * normal + time);
        float b = 5.0 * pnoise(0.05 * position, vec3(100.0));
        float displacement = -10.0 * noise + b;
        vec3 newPos = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos,1.0);
    }
    `
}