import {Vibration} from 'react-native';
import { Haptic} from 'expo';

import * as firebase from 'firebase';
require("firebase/firestore");
const ImpactStyles = {
  'Light': 'light',
  'Medium': 'medium',
  'Heavy': 'heavy',
}
const NotificationTypes = {
  'Success': 'success',
  'Warning': 'warning',
  'Error': 'error',
}


export function addStoryLike(name){

  Haptic.impact(Haptic.ImpactStyles.Light)



 firebase.firestore()
    .runTransaction(async transaction => {
      const doc = await transaction.get(firebase.firestore().collection('stories').doc(name));

      // if it does not exist set the population to one
      if (!doc.exists) {
        transaction.set(firebase.firestore().collection('stories').doc(name), { population: 1 });
        // return the new value so we know what the new population is
        return 1;
      }

      // exists already so lets increment it + 1
      const newPopulation = doc.data().population + 1;

      transaction.update(firebase.firestore().collection('stories').doc(name), {
        population: newPopulation,
      });

      // return the new value so we know what the new population is
      return newPopulation;
    })
    .then(newPopulation => {
      console.log(
        `Transaction successfully committed and new population is '${newPopulation}'.`
      );
    })
    .catch(error => {
      console.log('Transaction failed: ', error);
    });
}
export function addRandomPost(name){

  Haptic.notification(Haptic.NotificationTypes.Warning)


 firebase.firestore()
    .runTransaction(async transaction => {
      const doc = await transaction.get(firebase.firestore().collection('approvedEvents').doc(name));

      // if it does not exist set the population to one
      if (!doc.exists) {
        transaction.set(firebase.firestore().collection('approvedEvents').doc(name), { population: 1 });
        // return the new value so we know what the new population is
        return 1;
      }

      // exists already so lets increment it + 1
      const newPopulation = doc.data().population + 1;

      transaction.update(firebase.firestore().collection('approvedEvents').doc(name), {
        population: newPopulation,
      });

      // return the new value so we know what the new population is
      return newPopulation;
    })
    .then(newPopulation => {
      console.log(
        `Transaction successfully committed and new population is '${newPopulation}'.`
      );
    })
    .catch(error => {
      console.log('Transaction failed: ', error);
    });
}
