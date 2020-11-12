const CubeMatrix = AutoAnimObj.extend({
    init: function(){
        this._super()
        this.m = new THREE.Object3D()

        // Add Cubes
        this.cubes = {count: 8, dims: 1.4}
        this.cubeGeom = new THREE.BoxGeometry(this.cubes.dims, this.cubes.dims, this.cubes.dims)
        this.cubeMat = new THREE.MeshPhongMaterial({color: 0xff9999, wireframe: false})
        for(let i = this.cubes.count; i--;){
            this.cubes[i] = new Cube(this.cubeGeom, this.cubeMat)
            switch (i) {
                case 7:
                    this.cubes[i].setPos(-.8, -.8, -.8)
                    break
                case 6:
                    this.cubes[i].setPos(.8, -.8, -.8)
                    break
                case 5:
                    this.cubes[i].setPos(-.8, -.8, .8)
                    break
                case 4:
                    this.cubes[i].setPos(.8, -.8, .8)
                    break
                case 3:
                    this.cubes[i].setPos(-.8, .8, -.8)
                    break
                case 2:
                    this.cubes[i].setPos(.8, .8, -.8)
                    break
                case 1:
                    this.cubes[i].setPos(-.8, .8, .8)
                    break
                case 0:
                    this.cubes[i].setPos(.8, .8, .8)
                    break
                default:
                    break
            }
            this.m.add(this.cubes[i].m)
        }

        this.setVel(this.v.max, this.v.max, this.v.max)
    },// End init()
    openMatrix: function(){
        for(let i = this.cubes.count; i--;){
            this.cubes[i].setScale(.25, .25, .25)
            this.cubes[i].setPos(this.cubes[i].m.position.x*2, this.cubes[i].m.position.y*2, this.cubes[i].m.position.z*2)
        }
        this.setVel(.05, .05, 0)
    },
    closeMatrix: function(){
        for(let i = this.cubes.count; i--;){
            this.cubes[i].setScale(1, 1, 1)
            this.cubes[i].setPos(this.cubes[i].m.position.x/2, this.cubes[i].m.position.y/2, this.cubes[i].m.position.z/2)
        }
    },
    checkAll: function(){
        this.checkVel()
        this.checkPos()
        this.checkRot()
        this.checkScale()
    },
    render: function(){
        this.checkAll()
        for(let i = this.cubes.count; i--;){
            this.cubes[i].render()
        }
    }
    // init: function(dims = 3, rowCount = 5){
    //     this.m = new THREE.Object3D()
    //     this.rowCount = rowCount
    //     this.loopCount = Math.floor(this.rowCount/2)
    //
    //     this.cubes = {count: Math.pow(this.rowCount,3) , dims: dims/this.rowCount-((this.rowCount/this.rowCount*this.rowCount)*.1), arr: []}
    //     this.cubeGeom = new THREE.BoxGeometry(this.cubes.dims, this.cubes.dims, this.cubes.dims)
    //     this.cubeMat = new THREE.MeshPhongMaterial({color: 0xff9999, wireframe: false})
    //
    //     for(let z = (this.loopCount - (this.rowCount-1)); z <= this.loopCount; ++ z){
    //     for(let y = (this.loopCount - (this.rowCount-1)); y <= this.loopCount; ++ y){
    //     for(let x = (this.loopCount - (this.rowCount-1)); x <= this.loopCount; ++ x){
    //         console.log(x / (this.cubes.dims + .5), y / (this.cubes.dims + .5), z / (this.cubes.dims + .5));
    //         const mesh = new THREE.Mesh( this.cubeGeom, this.cubeMat)
    //         mesh.position.set(x / this.rowCount, y / this.rowCount, z / this.rowCount)
    //         mesh.receiveShadow = true
    //         mesh.castShadow = true
    //         this.m.add(mesh)
    //         this.cubes.arr.push(mesh)
    //     }
    //     }
    //     }
    //     this.m.scale.set(2, 2, 2)
    // }
})
