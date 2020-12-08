import {GameEntity, Vehicle} from './../../node_modules/yuka/build/yuka.module.js'

export class Collectible extends GameEntity {

	spawn() {

		this.position.x = Math.random() * 15 - 7.5;
		this.position.z = Math.random() * 15 - 7.5;

		if ( this.position.x < 1 && this.position.x > - 1 ) this.position.x += 1;
		if ( this.position.z < 1 && this.position.y > - 1 ) this.position.z += 1;

		//this.Collectible = new Vehicle()




	}

	handleMessage( telegram ) {

		const message = telegram.message;

		switch ( message ) {

			case 'PickedUp':

				this.spawn();
				return true;

			default:

				console.warn( 'Collectible: Unknown message.' );

		}

		return false;

	}

}
