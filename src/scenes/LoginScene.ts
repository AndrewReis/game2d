import 'phaser';
import { responsiveScreenHelper } from '../helpers/responsive-helper';

export class LoginScene extends Phaser.Scene {
  constructor() {
    super('Login');
  }

  preload() {
    responsiveScreenHelper(this);
    this.load.html('form', 'src/assets/html/form.html');
  }

  create() {
    this.add.text(10, 10, 'Login', { color: 'white', fontFamily: 'Arial', fontSize: '32px ' });

    const element = this.add.dom(400, 600).createFromCache('form');

    element.setPerspective(800);
    element.addListener('click');

    element.on('click', async (event: any) => {
      if (event.target.name === 'loginButton') {
        const inputUsername = element.getChildByName('username');
        const inputPassword = element.getChildByName('password');

        if (inputUsername.value !== '' && inputPassword.value !== '') {
          console.log(inputUsername.value)
          console.log(inputPassword.value)
          element.removeListener('click');

          const url = 'http://localhost:3333/sessions/signin'

          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: inputUsername.value,
                password: inputPassword.value
              })
            });

            const data = await response.json();

            // set storage TOKEN and User info
            this.scene.start('Loading');
          } catch (error) {
            console.error(error);
            element.addListener('click');
          }
        }
      }
    });
  }
}
