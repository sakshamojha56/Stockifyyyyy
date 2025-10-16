import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const stacksNetwork = new StacksTestnet();

export function authenticate() {
  showConnect({
    appDetails: {
      name: 'Stockify',
      icon: '/stockify-logo.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

export function getUserData() {
  return userSession.loadUserData();
}

export function isSignedIn() {
  return userSession.isUserSignedIn();
}

export function signOut() {
  userSession.signUserOut();
  window.location.href = '/';
}
