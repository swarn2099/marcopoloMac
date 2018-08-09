import {Vibration, Alert} from 'react-native';
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

var arr=[];
const subscribedArray = [];
export function addOrgLike(kind, initial){
  Haptic.notification(Haptic.NotificationTypes.Warning)

if(kind != 'all'){
  firebase.firestore()
     .runTransaction(async transaction => {
       const doc = await transaction.get(firebase.firestore().collection('orgEvents').doc(initial));

       // if it does not exist set the population to one
       if (!doc.exists) {
         transaction.set(firebase.firestore().collection('orgEvents').doc(initial), { population: 1 });
         // return the new value so we know what the new population is
         return 1;
       }

       // exists already so lets increment it + 1
       const newPopulation = doc.data().population + 1;

       transaction.update(firebase.firestore().collection('orgEvents').doc(initial), {
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
   }else {
     firebase.firestore()
        .runTransaction(async transaction => {
          const doc = await transaction.get(firebase.firestore().collection('approvedEvents').doc(initial));

          // if it does not exist set the population to one
          if (!doc.exists) {
            transaction.set(firebase.firestore().collection('approvedEvents').doc(initial), { population: 1 });
            // return the new value so we know what the new population is
            return 1;
          }

          // exists already so lets increment it + 1
          const newPopulation = doc.data().population + 1;

          transaction.update(firebase.firestore().collection('approvedEvents').doc(initial), {
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
}
export function addRandomPost(initial){

  Haptic.notification(Haptic.NotificationTypes.Warning)


 firebase.firestore()
    .runTransaction(async transaction => {
      const doc = await transaction.get(firebase.firestore().collection('approvedEvents').doc(initial));

      // if it does not exist set the population to one
      if (!doc.exists) {
        transaction.set(firebase.firestore().collection('approvedEvents').doc(initial), { population: 1 });
        // return the new value so we know what the new population is
        return 1;
      }

      // exists already so lets increment it + 1
      const newPopulation = doc.data().population + 1;

      transaction.update(firebase.firestore().collection('approvedEvents').doc(initial), {
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
export function interestedPrivateEvents(name){

  Haptic.notification(Haptic.NotificationTypes.Warning)


 firebase.firestore()
    .runTransaction(async transaction => {
      const doc = await transaction.get(firebase.firestore().collection('privateEvents').doc(name));

      // if it does not exist set the population to one
      if (!doc.exists) {
        transaction.set(firebase.firestore().collection('privateEvents').doc(name), { population: 1 });
        // return the new value so we know what the new population is
        return 1;
      }

      // exists already so lets increment it + 1
      const newPopulation = doc.data().population + 1;

      transaction.update(firebase.firestore().collection('privateEvents').doc(name), {
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
export function deletePrivateEvents(name){

  Haptic.notification(Haptic.NotificationTypes.Warning)
  const { currentUser } = firebase.auth()

 firebase.firestore()
    .runTransaction(async transaction => {
      const doc = await transaction.get(firebase.firestore().collection('privateEvents').doc(name));



      // exists already so lets increment it + 1
      var arr = doc.data().users;
      arr = arr.filter(e => e !== currentUser.email); // will return ['A', 'C']

      transaction.update(firebase.firestore().collection('privateEvents').doc(name), {
        users: arr,
      });
      // return the new value so we know what the new population is
      return arr;
    })
    .then(newPopulation => {
      console.log(
        `Transaction successfully committed and new population is '${arr}'.`
      );
    })
    .catch(error => {
      console.log('Transaction failed: ', error);
    });


    Alert.alert(
      'You have left this event' ,
      'Close the card and refresh to load your new private events ',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
}

export function subscribeToOrg(author, name){
  Haptic.notification(Haptic.NotificationTypes.Warning)

  Alert.alert(
    'You are now subscribed to ' + name,
    'You will find events by this organization on Pool feed. Head over to pool and refresh.',
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )

  const { currentUser } = firebase.auth()
  firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(doc) {
        subscribedArray = doc.data().subscribed;
        subscribedArray.push(author);
        firebase.firestore().collection("users").doc(currentUser.uid).set({
            subscribed:  subscribedArray});
  });
}
