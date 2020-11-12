<script type="x-shader/x-vertex" id="coreVShader">
    <?php include('js/shaders/ashimaCode/classicnoise3D.glsl'); ?>
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
</script>
<script type="x-shader/x-vertex" id="coreFShader">
    varying vec2 vUv;
    varying float noise;
    uniform sampler2D tExplosion;

    float random(vec3 scale, float seed){
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void main(){
        float r = .01 * random(vec3(12.9898, 78.233, 151.7182), 0.0);

        vec2 tPos = vec2(0,1.0-50.3 * noise + r);
        vec4 color = texture2D(tExplosion, tPos);
        gl_FragColor = vec4(color.rgb,1.0);
    }
</script>
