const darkForest = Class.extend({
    init: ()=>{
        this.mesh = new THREE.Object3D()
        // Floor
        this.floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000, 250, 250),
            new THREE.MeshPhongMaterial({color: 0xa0a0a0, wireframe: false})
        )
        this.floor.rotation.x -= Math.PI / 2
        this.floor.receiveShadow = true
        this.mesh.add(this.floor)

        // Light Pillar
        this.pillar = new THREE.Mesh(
            new THREE.BoxGeometry(6, 1500, 2),
            new THREE.MeshLambertMaterial({color: 0xffffff,emissive: 0xffffff, emissiveIntensity: 1000000, wireframe: false})
        )
        this.pillar.position.set(496, 750, 496)
        this.pillar.rotation.y += 1
        this.mesh.add(this.pillar)

        // Add Black Trees
        this.smallTrees = []
        let mesh = this.mesh, smallTrees = this.smallTrees
        mg.mtl.load('assets/blackTree3.mtl',(m)=>{// Black Tree 2
            m.preload()
            game.obj.setMaterials(m)
            for(let i = 500; i--;){
                mg.obj.load("assets/blackTree3.obj", (mesh)=>{
                    mesh.scale.set(2, 2, 2)
                    mesh.position.set(mg.randInt(500, -500), 0, mg.randInt(500, -500) )
                    mesh.rotation.y = mg.randInt(360)
                    mesh.traverse((n)=>{ if( n instanceof THREE.Mesh){ n.castShadow = true; n.recieveShadow = true; }; })
                    this.smallTrees[i] = mesh
                    mesh.add(mesh)
                })
            }
        })

    }
})
