export class Utils{
    static getCenterPoint(mesh) {
        let geometry = mesh.geometry;
        geometry.computeBoundingBox();   
        console.log(geometry);
        let center = geometry.boundingBox.getCenter(new THREE.Vector3());
        console.log(center);
        mesh.localToWorld( center );
        console.log(center);
        return center;
    }
}